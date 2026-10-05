import { generateEmbedding } from "./embeddings"

async function testEmbedding() {
  try {
    const text =
      "My landlord has not returned my security deposit."

    const embedding = await generateEmbedding(text)

    console.log("Embedding generated successfully!")
    console.log("Number of dimensions:", embedding.length)
    console.log("First 10 values:", embedding.slice(0, 10))
  } catch (error) {
    console.error("Embedding test failed:", error)
  }
}

testEmbedding()