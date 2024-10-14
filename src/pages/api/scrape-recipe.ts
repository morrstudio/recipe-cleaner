import type { NextApiRequest, NextApiResponse } from 'next'
import { extractRecipe } from '@/lib/recipeExtractor'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { url } = req.body
      console.log("Received URL:", url)
      
      const cleanedRecipe = await extractRecipe(url)
      
      console.log("Cleaned recipe:", cleanedRecipe)
      res.status(200).json(cleanedRecipe)
    } catch (error) {
      console.error("Error in API route:", error)
      res.status(500).json({ error: 'Failed to clean recipe' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}