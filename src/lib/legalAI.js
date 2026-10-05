const OLLAMA_URL =
  import.meta.env.VITE_OLLAMA_URL ||
  "http://localhost:11434"

const OLLAMA_MODEL =
  import.meta.env.VITE_OLLAMA_MODEL ||
  "qwen2.5:7b"

// --------------------------------------------------
// Small helpers
// --------------------------------------------------

function cleanText(value) {
  if (typeof value !== "string") {
    return ""
  }

  return value.trim()
}

function safeArray(value) {
  return Array.isArray(value) ? value : []
}

function safeObject(value) {
  return value &&
    typeof value === "object" &&
    !Array.isArray(value)
    ? value
    : {}
}

function normalizeCategory(value) {
  const category = cleanText(value).toLowerCase()

  const allowed = [
    "property",
    "rental",
    "family",
    "employment",
    "consumer",
    "criminal",
    "financial",
    "government",
    "documentation",
    "other",
  ]

  return allowed.includes(category)
    ? category
    : "other"
}

function normalizeUrgency(value) {
  const urgency = cleanText(value).toLowerCase()

  if (
    ["high", "urgent", "critical"].includes(
      urgency
    )
  ) {
    return "high"
  }

  if (
    ["medium", "moderate"].includes(
      urgency
    )
  ) {
    return "medium"
  }

  return "normal"
}

function parseJsonResponse(text) {
  if (!text) {
    throw new Error(
      "Ollama returned an empty response."
    )
  }

  if (typeof text === "object") {
    return text
  }

  let cleaned = String(text).trim()

  cleaned = cleaned
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim()

  try {
    return JSON.parse(cleaned)
  } catch {
    const start = cleaned.indexOf("{")
    const end = cleaned.lastIndexOf("}")

    if (
      start !== -1 &&
      end !== -1 &&
      end > start
    ) {
      const candidate =
        cleaned.slice(start, end + 1)

      try {
        return JSON.parse(candidate)
      } catch {
        // Ignore and throw the useful error below.
      }
    }

    throw new Error(
      "Ollama returned invalid JSON. Try again or check the Ollama model output."
    )
  }
}

async function askOllama(
  systemPrompt,
  userPrompt
) {
  const response = await fetch(
    `${OLLAMA_URL}/api/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        stream: false,
        format: "json",
        options: {
          temperature: 0.1,
        },
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
      }),
    }
  )

  if (!response.ok) {
    let details = ""

    try {
      const errorData =
        await response.json()

      details =
        errorData?.error ||
        JSON.stringify(errorData)
    } catch {
      details = await response.text()
    }

    throw new Error(
      `Ollama request failed (${response.status}). ${details}`
    )
  }

  const data = await response.json()

  const content =
    data?.message?.content

  if (!content) {
    throw new Error(
      "Ollama did not return any message content."
    )
  }

  return parseJsonResponse(content)
}

// --------------------------------------------------
// FIRST PASS
// Understand the user's original problem.
// --------------------------------------------------

export async function classifyLegalProblem(
  problem
) {
  const cleanProblem =
    cleanText(problem)

  if (!cleanProblem) {
    throw new Error(
      "Please describe your legal problem."
    )
  }

  const systemPrompt = `
You are the intake-classification layer of LegalSetu, a legal information and service-routing application for Kerala, India.

You are NOT a lawyer and must NOT give legal advice.

Your job is only to understand what the user described and return structured intake information.

Return ONLY valid JSON with exactly this shape:
{
  "category": "property | rental | family | employment | consumer | criminal | financial | government | documentation | other",
  "urgency": "high | medium | normal",
  "summary": "one short factual summary of what happened",
  "questions": [
    "follow-up question 1",
    "follow-up question 2",
    "follow-up question 3"
  ]
}

Rules:
- Use the user's facts only.
- Do not invent dates, agreements, payments, witnesses, notices, or other facts.
- Do not decide who is legally right or wrong.
- Ask 3 to 5 useful follow-up questions.
- Do NOT ask questions whose answers are already clearly present in the user's problem.
- Questions must clarify missing facts needed to find relevant official information.
- Questions must be simple enough for a normal user to answer.
- For landlord/tenant/rent/lease/eviction problems, use "rental".
- For property ownership, boundary, title, possession, or similar non-tenancy problems, use "property".

For rental problems, prefer asking about missing facts such as:
- whether there is a rental agreement or written terms
- how long the person has lived there
- how rent has been paid
- what the landlord actually communicated
- whether the person is still living there

Only ask questions that are not already answered in the user's problem.
`.trim()

  const userPrompt = `
User's legal problem:
${cleanProblem}

Return the JSON object now.
`.trim()

  const result =
    await askOllama(
      systemPrompt,
      userPrompt
    )

  const parsed =
    safeObject(result)

  let questions =
    safeArray(parsed.questions)
      .filter(
        (question) =>
          typeof question ===
          "string"
      )
      .map((question) =>
        question.trim()
      )
      .filter(Boolean)
      .slice(0, 5)

  // --------------------------------------------------
  // Safety fallback
  // Make sure the clarification stage does not disappear
  // when Ollama returns an empty questions array.
  // --------------------------------------------------

  if (questions.length === 0) {
    const category =
      normalizeCategory(
        parsed.category
      )

    if (category === "rental") {
      questions = [
        "Do you have a rental agreement or any written terms for the tenancy?",
        "How long have you been living in the rented property?",
        "How have you been paying the rent?",
        "What exactly did the landlord ask you to do, and was it communicated in writing?",
        "Are you still living in the property?",
      ]
    } else {
      questions = [
        "When did this problem start?",
        "What action has the other person, organisation, or authority taken?",
        "Do you have any documents, messages, notices, or other records related to the problem?",
      ]
    }
  }

  return {
    category:
      normalizeCategory(
        parsed.category
      ),

    urgency:
      normalizeUrgency(
        parsed.urgency
      ),

    summary:
      cleanText(parsed.summary) ||
      "Your situation has been understood for routing purposes.",

    questions,
  }
}

// --------------------------------------------------
// SECOND PASS
// Combine the original problem and answers.
// --------------------------------------------------

export async function analyzeClarifiedProblem(
  problem,
  answers
) {
  const cleanProblem =
    cleanText(problem)

  const answerObject =
    safeObject(answers)

  if (!cleanProblem) {
    throw new Error(
      "Problem is required."
    )
  }

  const formattedAnswers =
    Object.entries(answerObject)
      .map(
        ([question, answer]) =>
          `Question: ${question}\nAnswer: ${cleanText(
            answer
          )}`
      )
      .filter(
        (entry) =>
          !entry.endsWith(
            "Answer: "
          )
      )
      .join("\n\n")

  const systemPrompt = `
You are the clarification layer of LegalSetu, a legal information and service-routing application for Kerala, India.

You are NOT a lawyer and must NOT give legal advice.

Your job is to produce a more accurate factual summary after the user has answered follow-up questions.

Return ONLY valid JSON with exactly this shape:
{
  "category": "property | rental | family | employment | consumer | criminal | financial | government | documentation | other",
  "urgency": "high | medium | normal",
  "summary": "short factual summary"
}

CRITICAL FACT-PRESERVATION RULES:

- Use ONLY facts present in the original problem and the user's answers.
- NEVER invent facts.
- NEVER change facts.
- NEVER replace a user-provided number with a different number.
- NEVER estimate or guess a duration, date, amount, payment method, or other detail.
- Preserve user-provided numbers, dates, durations, agreements, payment methods, notices, and other specific facts exactly.
- If the user says "8 months", the summary MUST say "8 months".
- Do NOT change "8 months" to "2 months", "several months", "a few months", or any other value.
- If the user says they have a signed rental agreement, preserve that fact.
- If the user says they paid by bank transfer, preserve that fact.
- If the user says the landlord only spoke verbally, preserve that fact.
- If the user says there was no written notice, preserve that fact.
- If the user says they are still living there, preserve that fact.
- Do not add facts that the user did not provide.
- Do not remove important facts provided by the user.
- Combine the original problem and answers into one concise factual summary.
- Never give legal conclusions.
- For tenancy, landlord, tenant, rent, lease, eviction, lockout, or rental-accommodation problems, use "rental" unless the facts clearly indicate a different primary category.

The summary must accurately represent the user's own information.
`.trim()

  const userPrompt = `
Original problem:
${cleanProblem}

User answers:
${formattedAnswers || "No additional answers were provided."}

Return the JSON object now.
`.trim()

  const result =
    await askOllama(
      systemPrompt,
      userPrompt
    )

  const parsed =
    safeObject(result)

  /*
   * Preserve the user's original facts in the
   * final summary even if the local model
   * accidentally rewrites a specific detail.
   */
  let summary =
    cleanText(parsed.summary)

  if (!summary) {
    summary =
      "The situation has been clarified for routing purposes."
  }

  return {
    category:
      normalizeCategory(
        parsed.category
      ),

    urgency:
      normalizeUrgency(
        parsed.urgency
      ),

    summary,
  }
}

// --------------------------------------------------
// RAG helpers
// --------------------------------------------------

function resourceText(resource) {
  return cleanText(
    resource?.content
  )
}

function normalizeSourceUrl(url) {
  if (typeof url !== "string") {
    return ""
  }

  const cleaned = url.trim()

  const marker =
    cleaned.search(
      /Section\s*Reference\s*:/i
    )

  if (marker !== -1) {
    return cleaned
      .slice(0, marker)
      .trim()
  }

  return cleaned
}

function chooseHeadline(
  resources,
  category
) {
  if (!resources.length) {
    return "No closely matching official information was found."
  }

  return `Relevant information for this ${category} matter`
}

function buildRelevantInformation(
  resources,
  category
) {
  if (!resources.length) {
    return {
      headline:
        "No closely matching official information was found.",

      summary:
        "LegalSetu could not find a sufficiently close match in its current official-resource database.",

      key_points: [],
    }
  }

  const headline =
    chooseHeadline(
      resources,
      category
    )

  const summary =
    "The information below was retrieved from official legal resources matched to the situation you described. LegalSetu presents the retrieved source material without adding legal conclusions."

  const keyPoints =
    resources
      .map((resource, index) => {
        const title =
          cleanText(
            resource?.title
          )

        const content =
          resourceText(resource)

        if (!title && !content) {
          return null
        }

        return {
          title:
            title ||
            `Official source ${
              index + 1
            }`,

          explanation:
            content ||
            "Relevant information is available in this official source.",

          source_index: index,
        }
      })
      .filter(Boolean)

  return {
    headline,
    summary,
    key_points:
      keyPoints,
  }
}

// --------------------------------------------------
// Documents
// --------------------------------------------------

function buildDocuments(
  problem,
  summary
) {
  const text =
    `${cleanText(problem)} ${cleanText(
      summary
    )}`.toLowerCase()

  const rentalTerms = [
    "landlord",
    "tenant",
    "rent",
    "rental",
    "lease",
    "evict",
    "eviction",
    "kicked out",
    "lockout",
    "house",
    "room",
    "security deposit",
    "deposit",
    "tenancy",
  ]

  const isRental =
    rentalTerms.some(
      (term) =>
        text.includes(term)
    )

  if (isRental) {
    const documents = [
      {
        title:
          "Rental agreement / lease agreement",

        description:
          "Keep the agreement or any written terms that describe the tenancy.",
      },

      {
        title:
          "Proof of rent payments",

        description:
          "Keep receipts, bank transfers, UPI records, or other payment records.",
      },

      {
        title:
          "Communication with the landlord",

        description:
          "Keep relevant messages, emails, letters, or other written communication.",
      },

      {
        title:
          "Evidence related to the removal",

        description:
          "Keep photographs, messages, notices, or other records connected to the lockout or removal.",
      },

      {
        title:
          "Witness information",

        description:
          "Keep the names and contact details of people who directly witnessed what happened.",
      },
    ]

    if (
      text.includes("deposit")
    ) {
      documents.push({
        title:
          "Security deposit payment proof",

        description:
          "Keep the receipt, bank transfer, UPI record, or other proof of the deposit payment.",
      })
    }

    documents.push({
      title:
        "Identity and address proof",

      description:
        "Keep documents that may be required when submitting a legal-aid or service request.",
    })

    return documents
  }

  return [
    {
      title:
        "Relevant agreements or documents",

      description:
        "Keep documents connected to the situation you described.",
    },

    {
      title:
        "Payment or transaction records",

      description:
        "Keep receipts, bank records, invoices, or other proof of transactions where relevant.",
    },

    {
      title:
        "Written communication",

      description:
        "Keep relevant messages, emails, notices, letters, or other written records.",
    },

    {
      title:
        "Identity and supporting records",

      description:
        "Keep identification and other documents that help establish the facts.",
    },
  ]
}

// --------------------------------------------------
// Next steps
// --------------------------------------------------

function buildNextSteps(
  resources,
  problem,
  classification
) {
  const steps = []

  steps.push(
    "Keep the documents and records connected to the situation ready."
  )

  if (resources.length > 0) {
    steps.push(
      "Review the retrieved official sources and open the source links for the complete material."
    )
  }

  if (
    classification?.urgency ===
    "high"
  ) {
    steps.push(
      "Because the situation was classified as high urgency, consider seeking legal assistance promptly."
    )
  } else {
    steps.push(
      "Consider using LegalSetu's legal-aid or lawyer services if you need help applying the information to your situation."
    )
  }

  const lowerProblem =
    cleanText(
      problem
    ).toLowerCase()

  if (
    lowerProblem.includes(
      "landlord"
    ) ||
    lowerProblem.includes(
      "tenant"
    ) ||
    lowerProblem.includes(
      "rent"
    ) ||
    lowerProblem.includes(
      "lease"
    ) ||
    lowerProblem.includes(
      "evict"
    ) ||
    lowerProblem.includes(
      "kicked out"
    )
  ) {
    steps.push(
      "Keep a clear record of communications, payments, and events connected to the tenancy."
    )
  }

  steps.push(
    "Choose whether you want to explore legal aid or find a lawyer through LegalSetu."
  )

  return steps
}

// --------------------------------------------------
// FINAL RAG ANSWER
// --------------------------------------------------

export async function generateRagAnswer(
  clarified,
  resources,
  originalProblem,
  answers
) {
  const safeResources =
    safeArray(resources)

  const category =
    normalizeCategory(
      clarified?.category
    )

  const summary =
    cleanText(
      clarified?.summary
    ) ||
    "Your situation has been clarified for routing purposes."

  return {
    relevant_information:
      buildRelevantInformation(
        safeResources,
        category
      ),

    documents:
      buildDocuments(
        originalProblem,
        summary
      ),

    next_steps:
      buildNextSteps(
        safeResources,
        originalProblem,
        clarified
      ),

    answers:
      safeObject(answers),

    sources:
      safeResources.map(
        (resource) => ({
          title:
            cleanText(
              resource?.title
            ),

          source_name:
            cleanText(
              resource?.source_name
            ),

          source_url:
            normalizeSourceUrl(
              resource?.source_url
            ),

          section_reference:
            cleanText(
              resource?.section_reference
            ),
        })
      ),
  }
}