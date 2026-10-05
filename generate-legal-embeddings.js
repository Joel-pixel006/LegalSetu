import dotenv from "dotenv"
import { createClient } from "@supabase/supabase-js"

dotenv.config()
dotenv.config({ path: ".env.local" })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY

if (!supabaseUrl) {
  throw new Error("VITE_SUPABASE_URL is missing.")
}

if (!supabaseSecretKey) {
  throw new Error("SUPABASE_SECRET_KEY is missing.")
}

const supabase = createClient(
  supabaseUrl,
  supabaseSecretKey
)

async function generateEmbedding(text) {
  const response = await fetch(
    "http://localhost:11434/api/embed",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "nomic-embed-text",
        input: text,
      }),
    }
  )

  if (!response.ok) {
    throw new Error(
      `Ollama returned status ${response.status}`
    )
  }

  const data = await response.json()

  const embedding = data.embeddings?.[0]

  if (!embedding) {
    throw new Error("No embedding returned by Ollama.")
  }

  return embedding
}

async function main() {
  console.log("Fetching legal resources...")

  const { data: resources, error } = await supabase
    .from("legal_resources")
    .select("id, title, content")
    .is("embedding", null)

  if (error) {
    throw error
  }

  if (!resources || resources.length === 0) {
    console.log("No resources need embeddings.")
    return
  }

  console.log(
    `Found ${resources.length} resource(s).`
  )

  for (const resource of resources) {
    console.log(
      `Generating embedding for: ${resource.title}`
    )

    const embedding = await generateEmbedding(
      resource.content
    )

    const { error: updateError } = await supabase
      .from("legal_resources")
      .update({
        embedding,
      })
      .eq("id", resource.id)

    if (updateError) {
      throw updateError
    }

    console.log(
      `✓ Embedded: ${resource.title}`
    )
  }

  console.log(
    "All embeddings generated successfully!"
  )
}

main().catch((error) => {
  console.error("Embedding generation failed:")
  console.error(error.message)
})