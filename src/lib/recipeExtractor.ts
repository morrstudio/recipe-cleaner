// src/lib/recipeExtractor.ts

import { Recipe, Ingredient } from '@/types/recipe'
import OpenAI from 'openai'
import { recipeCache } from './cache'
import { CheerioAPI, load, type Element } from 'cheerio'

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Common recipe selectors for various recipe sites
const SELECTORS = {
  recipe: {
    container: [
      '[type="application/ld+json"]',
      '.recipe-content',
      '.recipe-container',
      '.wprm-recipe-container',
      '.tasty-recipes',
      '[itemtype*="Recipe"]',
    ],
    title: [
      '.recipe-title',
      '.wprm-recipe-name',
      'h1.title',
      '[itemprop="name"]',
    ],
    ingredients: [
      '.recipe-ingredients li',
      '.wprm-recipe-ingredient',
      '.ingredients-list li',
      '[itemprop="recipeIngredient"]',
    ],
    instructions: [
      '.recipe-instructions li',
      '.wprm-recipe-instruction',
      '.instructions-list li',
      '[itemprop="recipeInstructions"]',
    ],
    servings: [
      '[itemprop="recipeYield"]',
      '.recipe-servings',
      '.wprm-recipe-servings',
    ],
    time: [
      '[itemprop="totalTime"]',
      '.recipe-time',
      '.wprm-recipe-total-time',
    ],
  },
}

interface ExtractionResult {
  title: string
  ingredients: string[]
  instructions: string[]
  servings?: number
  totalTime?: number
}

// Add type definitions
type CheerioRoot = CheerioAPI
type CheerioSelection = ReturnType<typeof load>

export async function extractRecipe(url: string): Promise<Recipe> {
  try {
    // Validate URL
    const validUrl = new URL(url)

    // Check cache first
    const cacheKey = `recipe_${url}`
    const cached = recipeCache.get<Recipe>(cacheKey)
    if (cached) {
      return cached
    }

    const response = await fetch(validUrl.toString())
    if (!response.ok) {
      throw new Error('Failed to fetch recipe page')
    }

    const html = await response.text()
    const $ = load(html)

    // Try extraction methods in sequence
    const structuredData = extractStructuredData($)
    if (structuredData) {
      const recipe = processRecipeData(structuredData)
      recipeCache.set(cacheKey, recipe)
      return recipe
    }

    const htmlData = extractFromHtml($)
    if (htmlData) {
      const recipe = processRecipeData(htmlData)
      recipeCache.set(cacheKey, recipe)
      return recipe
    }

    const aiData = await extractWithAI(html)
    if (aiData) {
      const recipe = processRecipeData(aiData)
      recipeCache.set(cacheKey, recipe)
      return recipe
    }

    throw new Error('Could not extract recipe data')
  } catch (error: any) {
    console.error('Recipe extraction failed:', error)
    throw new Error(`Failed to extract recipe: ${error.message}`)
  }
}

function extractStructuredData($: CheerioRoot): ExtractionResult | null {
  try {
    const jsonLDElements = $('script[type="application/ld+json"]')

    for (let i = 0; i < jsonLDElements.length; i++) {
      const content = $(jsonLDElements[i]).html()
      if (!content) continue

      const data = JSON.parse(content)
      let recipe = null

      // Handle different schema structures
      if (data['@type'] === 'Recipe') {
        recipe = data
      } else if (Array.isArray(data['@graph'])) {
        recipe = data['@graph'].find(
          (item: any) => item['@type'] === 'Recipe'
        )
      }

      if (recipe) {
        return {
          title: recipe.name,
          ingredients: Array.isArray(recipe.recipeIngredient)
            ? recipe.recipeIngredient
            : [],
          instructions: extractInstructions(recipe.recipeInstructions),
          servings: parseServings(recipe.recipeYield),
          totalTime: parseTime(recipe.totalTime || recipe.cookTime),
        }
      }
    }
  } catch (error) {
    console.error('Structured data extraction failed:', error)
  }
  return null
}

function extractFromHtml($: CheerioRoot): ExtractionResult | null {
  try {
    // Use predefined selectors first, then fallback to generic ones
    let title = ''
    for (const selector of SELECTORS.recipe.title) {
      title = $(selector).first().text().trim()
      if (title) break
    }
    if (!title) {
      title = $('h1').first().text().trim() || $('title').first().text().trim()
    }

    // Updated selector handling with error checking
    const ingredients: string[] = []
    for (const selector of SELECTORS.recipe.ingredients) {
      try {
        $(selector).each(function(this: Element, _: number) {
          const text = $(this).text().trim()
          if (text) ingredients.push(text)
        })
        if (ingredients.length > 0) break
      } catch (err) {
        console.warn(`Selector "${selector}" failed:`, err)
        continue
      }
    }

    // Fallback for ingredients if none found
    if (ingredients.length === 0) {
      $('li')
        .filter((_, el) =>
          /cup|tablespoon|teaspoon|pound|ounce/i.test(
            $(el).text().trim()
          )
        )
        .each((_, el) => {
          const text = $(el).text().trim()
          if (text) ingredients.push(text)
        })
    }

    // Similar updates for instructions
    const instructions: string[] = []
    for (const selector of SELECTORS.recipe.instructions) {
      try {
        $(selector).each(function(this: Element, _: number) {
          const text = $(this).text().trim()
          if (text) instructions.push(text)
        })
        if (instructions.length > 0) break
      } catch (err) {
        console.warn(`Selector "${selector}" failed:`, err)
        continue
      }
    }

    // If no instructions found with selectors, try generic ones
    if (instructions.length === 0) {
      $('ol li, .instructions li, .recipe-instructions li, .recipe-steps li').each((_, el) => {
        const text = $(el).text().trim()
        if (text) instructions.push(text)
      })
    }

    // Try to find servings
    let servings: number | undefined
    for (const selector of SELECTORS.recipe.servings) {
      const text = $(selector).first().text().trim()
      if (text) {
        servings = parseServings(text)
        break
      }
    }

    // Try to find cooking time
    let totalTime: number | undefined
    for (const selector of SELECTORS.recipe.time) {
      const text = $(selector).first().text().trim()
      if (text) {
        totalTime = parseTime(text)
        break
      }
    }

    return {
      title,
      ingredients,
      instructions,
      servings,
      totalTime,
    }
  } catch (error) {
    console.error('Failed to extract from HTML:', error)
    return null
  }
}

async function extractWithAI(html: string): Promise<ExtractionResult | null> {
  try {
    // Clean HTML for AI processing
    const cleanText = cleanHtml(html)

    const completion = await openaiClient.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'Extract recipe details from the given text. Return a JSON object with title, ingredients array, and instructions array.',
        },
        {
          role: 'user',
          content: cleanText,
        },
      ],
      functions: [
        {
          name: 'formatRecipe',
          parameters: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              ingredients: {
                type: 'array',
                items: { type: 'string' },
              },
              instructions: {
                type: 'array',
                items: { type: 'string' },
              },
              servings: { type: 'number' },
              totalTime: { type: 'number' },
            },
            required: ['title', 'ingredients', 'instructions'],
          },
        },
      ],
      function_call: { name: 'formatRecipe' },
    })

    const result = completion.choices[0]?.message?.function_call?.arguments
    if (result) {
      return JSON.parse(result)
    }

    return null
  } catch (error) {
    console.error('AI extraction failed:', error)
    return null
  }
}

function processRecipeData(data: ExtractionResult): Recipe {
  return {
    id: crypto.randomUUID(),
    title: data.title,
    servings: data.servings || 4,
    totalTime: data.totalTime || 0,
    ingredients: data.ingredients.map(parseIngredient),
    instructions: data.instructions.map((inst) => inst.trim()),
  }
}

function parseIngredient(text: string): Ingredient {
  // Improved regex to handle more cases
  const match = text.match(
    /^([\d\s\/\.\-]+)?\s*([a-zA-Z.]+)?\s*(.+?)(?:\s*\((.*?)\))?$/
  )

  if (!match) {
    return {
      id: crypto.randomUUID(),
      name: text.trim(),
      amount: 1,
      unit: '',
    }
  }

  const [, amount = '1', unit = '', name, notes] = match

  // Clean up amount by removing extra spaces
  const cleanAmount = amount.trim().replace(/\s+/g, ' ')

  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    amount: parseAmount(cleanAmount),
    unit: unit.toLowerCase().trim(),
    ...(notes && { notes: notes.trim() }),
  }
}

function parseAmount(amount: string): number {
  // Handle ranges (take first number)
  if (amount.includes('-')) {
    amount = amount.split('-')[0]
  }

  // Handle fractions
  if (amount.includes('/')) {
    const [num, denom] = amount.split('/').map(Number)
    if (!isNaN(num) && !isNaN(denom) && denom !== 0) {
      return num / denom
    }
  }

  return Number(amount) || 1
}

function parseTime(time?: string): number {
  if (!time) return 0

  // Handle ISO duration format
  const isoMatch = time.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
  if (isoMatch) {
    const [, hours = '0', minutes = '0'] = isoMatch
    return Number(hours) * 60 + Number(minutes)
  }

  // Handle natural language
  const nlMatch = time.match(/(\d+)\s*(min|minute|hour|hr)/i)
  if (nlMatch) {
    const [, num, unit] = nlMatch
    const number = Number(num)
    if (unit.toLowerCase().startsWith('hour') || unit.toLowerCase().startsWith('hr')) {
      return number * 60
    }
    return number
  }

  return 0
}

function parseServings(servings?: string | number): number {
  if (typeof servings === 'number') return servings
  if (!servings) return 4

  // Handle ranges (take average)
  const match = servings.match(/(\d+)(?:\s*-\s*(\d+))?/)
  if (match) {
    const [, min, max] = match
    return max ? (Number(min) + Number(max)) / 2 : Number(min)
  }

  return 4
}

function cleanHtml(html: string): string {
  const $ = load(html)

  // Remove unnecessary elements
  $('script, style, nav, header, footer, .ads, #comments').remove()

  // Extract main content
  const mainContent = $('.recipe-content, .recipe-container, article, main').first()

  return (mainContent.length ? mainContent : $('body'))
    .text()
    .replace(/\s+/g, ' ')
    .trim()
}

function extractInstructions(instructions: any): string[] {
  if (!instructions) return []

  if (Array.isArray(instructions)) {
    return instructions
      .map((instruction) => {
        if (typeof instruction === 'string') return instruction
        if (typeof instruction === 'object' && instruction.text) return instruction.text
        return ''
      })
      .filter(Boolean)
  }

  if (typeof instructions === 'string') {
    return [instructions]
  }

  return []
}

export default extractRecipe
