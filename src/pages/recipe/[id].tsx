import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Be cautious with this in production
})

export async function extractRecipe(url: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that extracts recipe information from URLs. Please provide only the ingredients and instructions in a structured format."
        },
        {
          role: "user",
          content: `Extract the ingredients and instructions from this recipe URL: ${url}`
        }
      ],
    })

    const extractedRecipe = response.choices[0].message.content
    return JSON.parse(extractedRecipe)
  } catch (error) {
    console.error('Error extracting recipe:', error)
    throw new Error('Failed to extract recipe')
  }
}
