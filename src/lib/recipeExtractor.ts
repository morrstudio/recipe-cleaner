import axios from 'axios';
import * as cheerio from 'cheerio';

export async function extractRecipe(url: string): Promise<{ ingredients: string[], instructions: string[] }> {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    const ingredients: string[] = [];
    const instructions: string[] = [];

    // Extract ingredients
    $('.wprm-recipe-ingredient').each((_, elem) => {
      const amount = $(elem).find('.wprm-recipe-ingredient-amount').text().trim();
      const unit = $(elem).find('.wprm-recipe-ingredient-unit').text().trim();
      const name = $(elem).find('.wprm-recipe-ingredient-name').text().trim();
      const ingredient = `${amount} ${unit} ${name}`.trim();
      if (ingredient) ingredients.push(ingredient);
    });

    // Extract instructions
    $('.wprm-recipe-instruction-text').each((_, elem) => {
      const instruction = $(elem).text().trim();
      if (instruction) instructions.push(instruction);
    });

    // If we couldn't find ingredients or instructions, try a more generic approach
    if (ingredients.length === 0 && instructions.length === 0) {
      $('ul li').each((_, elem) => {
        const text = $(elem).text().trim();
        if (text.match(/^\d+|\bcup\b|\btsp\b|\btbsp\b|\boz\b|\bpound\b/i)) {
          ingredients.push(text);
        }
      });

      $('ol li').each((_, elem) => {
        const text = $(elem).text().trim();
        if (text.length > 20) {
          instructions.push(text);
        }
      });
    }

    return { ingredients, instructions };
  } catch (error) {
    console.error('Error scraping recipe:', error);
    throw new Error('Failed to scrape recipe');
  }
}