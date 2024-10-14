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