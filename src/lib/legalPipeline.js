import {
  classifyLegalProblem,
  analyzeClarifiedProblem,
  generateRagAnswer,
} from "./legalAI"

import { generateEmbedding } from "./embeddings"
import { supabase } from "./supabase"

// --------------------------------------------------
// FIRST PASS
// --------------------------------------------------

export async function processLegalProblem(
  problem
) {
  if (!problem || !problem.trim()) {
    throw new Error(
      "Please describe your legal problem."
    )
  }

  const cleanProblem =
    problem.trim()

  // First local AI pass
  const classification =
    await classifyLegalProblem(
      cleanProblem
    )

  // Initial embedding
  const embedding =
    await generateEmbedding(
      cleanProblem
    )

  // Search official resources
  const {
    data: resources,
    error,
  } = await supabase.rpc(
    "match_legal_resources",
    {
      query_embedding: embedding,
      match_threshold: 0.3,
      match_count: 5,
    }
  )

  if (error) {
    throw new Error(
      `Legal resource search failed: ${error.message}`
    )
  }

  return {
    problem: cleanProblem,
    classification,
    resources: resources || [],
  }
}

// --------------------------------------------------
// SECOND PASS + RAG
// --------------------------------------------------

export async function processClarifiedProblem(
  problem,
  answers
) {
  if (!problem || !problem.trim()) {
    throw new Error(
      "Problem is required."
    )
  }

  const cleanProblem =
    problem.trim()

  // Clarify using local AI
  const clarified =
    await analyzeClarifiedProblem(
      cleanProblem,
      answers
    )

  const formattedAnswers =
    Object.entries(answers || {})
      .map(
        ([question, answer]) =>
          `Question: ${question}\nAnswer: ${answer}`
      )
      .join("\n\n")

  // Build retrieval query
  const searchText = `
Original problem:
${cleanProblem}

Category:
${clarified.category}

Urgency:
${clarified.urgency}

Clarified situation:
${clarified.summary}

Additional information from the user:
${formattedAnswers || "No additional information provided."}
  `.trim()

  console.log(
    "LEGALSETU RAG SEARCH TEXT:",
    searchText
  )

  // Create embedding from clarified case
  const embedding =
    await generateEmbedding(
      searchText
    )

  // Search Supabase pgvector
  const {
    data: resources,
    error,
  } = await supabase.rpc(
    "match_legal_resources",
    {
      query_embedding: embedding,
      match_threshold: 0.3,
      match_count: 5,
    }
  )

  if (error) {
    throw new Error(
      `Legal resource search failed: ${error.message}`
    )
  }

  const retrievedResources =
    resources || []

  console.log(
    "LEGALSETU RETRIEVED RESOURCES:",
    retrievedResources.map(
      (resource) => ({
        title: resource.title,
        source: resource.source_name,
        similarity:
          resource.similarity,
      })
    )
  )

  // Direct RAG
  const ragAnswer =
    await generateRagAnswer(
      clarified,
      retrievedResources,
      cleanProblem,
      answers
    )

  console.log(
    "LEGALSETU RAG ANSWER:",
    ragAnswer
  )

  return {
    clarified,
    resources: retrievedResources,
    ragAnswer,
  }
}