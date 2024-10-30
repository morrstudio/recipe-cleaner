import type { NextApiRequest, NextApiResponse } from 'next'
import { extractRecipe } from '@/lib/recipeExtractor'

interface Ingredient {
  text?: string;
  [key: string]: any;
}

interface CleanedRecipe {
  ingredients?: Ingredient[];
  [key: string]: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }

  try {
    const { url } = req.body

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Valid URL is required' })
    }

    // Validate URL format
    try {
      new URL(url)
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL format' })
    }

    const cleanedRecipe = await extractRecipe(url) as CleanedRecipe;
    
    if (!cleanedRecipe) {
      return res.status(404).json({ error: 'No recipe found at the provided URL' })
    }

    // Format the recipe data before sending
    const formattedRecipe = {
      ...cleanedRecipe,
      ingredients: cleanedRecipe.ingredients?.map((ingredient: Ingredient) => ({
        ...ingredient,
        text: ingredient.text?.trim().replace(/\s+/g, ' ')
      }))
    }

    return res.status(200).json({ 
      recipe: formattedRecipe,
      formatted: true
    })
  } catch (error) {
    console.error("Error processing recipe:", error)
    return res.status(500).json({ 
      error: 'Failed to process recipe',
      message: process.env.NODE_ENV === 'development' 
        ? (error as Error).message 
        : undefined
    })
  }
}