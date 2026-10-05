export async function generateEmbedding(text) {
  const response = await fetch(
    "/ollama/api/embed",
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
      `Ollama embedding request failed: ${response.status}`
    )
  }

  const data = await response.json()

  if (!data.embeddings || !data.embeddings[0]) {
    throw new Error("No embedding returned by Ollama.")
  }

  return data.embeddings[0]
}