import axios from 'axios';
import { Recipe } from '../types/recipe';

interface ChatResponse {
  message: string;
  updatedRecipe?: Recipe;
}

export async function chatWithAI(input: string, recipeId: string): Promise<ChatResponse> {
  try {
    const response = await axios.post('/api/chat', {
      message: input,
      recipeId: recipeId
    });

    return response.data;
  } catch (error) {
    console.error('Error in chatWithAI:', error);
    throw new Error('Failed to communicate with AI');
  }
}
