import { Recipe } from '../types/recipe';

export const scrapeRecipe = async (url: string): Promise<{ ingredients: string[], instructions: string[] }> => {
  try {
    const response = await fetch('/api/scrape-recipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error('Failed to scrape recipe');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error scraping recipe:', error);
    throw error;
  }
};

export async function chatWithAI(input: string, recipeId: string): Promise<{ message: string, updatedRecipe?: Recipe }> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input, recipeId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to chat with AI');
    }

    const data = await response.json();
    const aiResponse = data.response;
    const updatedRecipeData = data.updatedRecipe; // This should be undefined if no update was made

    // Return both the AI message and the updated recipe (if applicable)
    return {
      message: aiResponse,
      updatedRecipe: updatedRecipeData
    };
  } catch (error) {
    console.error('Error chatting with AI:', error);
    throw error;
  }
}
