import OpenAI from 'openai'
import axios from 'axios'

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Be cautious with this in production
})

export async function extractRecipe(url: string) {
  try {
    // First, try to use OpenAI API
    const aiExtractedRecipe = await extractRecipeWithAI(url)
    if (aiExtractedRecipe.ingredients.length > 0 || aiExtractedRecipe.instructions.length > 0) {
      return aiExtractedRecipe
    }

    // If OpenAI API fails or returns empty results, use fallback method
    console.log('Falling back to regex-based extraction method')
    return await extractRecipeWithRegex(url)
  } catch (error) {
    console.error('Error extracting recipe:', error)
    return { ingredients: [], instructions: [] }
  }
}

async function extractRecipeWithAI(url: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that extracts recipe information from URLs. Please provide only the ingredients and instructions in a structured JSON format with keys 'ingredients' (an array of strings) and 'instructions' (an array of strings). Be sure to include all ingredients and steps, even if they're in different sections on the page. If you can't find the information, return empty arrays."
        },
        {
          role: "user",
          content: `Extract the ingredients and instructions from this recipe URL: ${url}`
        }
      ],
    })

    const extractedRecipe = response.choices[0].message.content
    
    console.log('OpenAI response:', extractedRecipe)

    if (extractedRecipe) {
      try {
        const parsedRecipe = JSON.parse(extractedRecipe)
        if (Array.isArray(parsedRecipe.ingredients) && Array.isArray(parsedRecipe.instructions)) {
          return parsedRecipe
        }
      } catch (parseError) {
        console.error('Error parsing OpenAI response:', parseError)
      }
    }
    
    return { ingredients: [], instructions: [] }
  } catch (error) {
    console.error('Error using OpenAI API:', error)
    return { ingredients: [], instructions: [] }
  }
}

async function extractRecipeWithRegex(url: string) {
  try {
    const response = await axios.get(url)
    const html = response.data

    const ingredients = extractIngredients(html)
    const instructions = extractInstructions(html)

    return { ingredients, instructions }
  } catch (error) {
    console.error('Error extracting recipe with regex:', error)
    return { ingredients: [], instructions: [] }
  }
}

function extractIngredients(html: string): string[] {
  const ingredientRegex = /<li[^>]*class="[^"]*ingredient[^"]*"[^>]*>(.*?)<\/li>/gi
  const matches = html.match(ingredientRegex) || []
  return matches.map(match => cleanHtml(match))
}

function extractInstructions(html: string): string[] {
  const instructionRegex = /<li[^>]*class="[^"]*instruction[^"]*"[^>]*>(.*?)<\/li>/gi
  const matches = html.match(instructionRegex) || []
  return matches.map(match => cleanHtml(match))
}

function cleanHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}
