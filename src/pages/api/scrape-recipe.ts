// src/pages/api/scrape-recipe.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { extractRecipe } from '@/lib/recipeExtractor';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const recipe = await extractRecipe(url);
    return res.status(200).json({ recipe });
  } catch (error) {
    console.error('Recipe extraction failed:', error);
    return res.status(500).json({ error: 'Failed to extract recipe' });
  }
}