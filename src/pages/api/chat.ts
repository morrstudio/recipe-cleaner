// /pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { Recipe } from '@/types/recipe';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ChatPayload {
  message: string;
  recipe: Recipe;
}

interface ChatResponse {
  message: string;
  updatedRecipe?: Recipe;
}

const systemPrompt = `You are an expert cooking assistant that helps modify recipes and provide cooking advice. When suggesting recipe modifications:
1. Maintain the original format and structure
2. Keep modifications practical and realistic
3. Explain why changes are being made
4. Return complete modified recipes, not just the changes
5. Consider common ingredient substitutions and dietary restrictions
6. Keep original measurements unless specifically asked to convert them`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { message, recipe }: ChatPayload = req.body;

    if (!message || !recipe) {
      return res.status(400).json({ 
        message: 'Message and recipe are required' 
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Current recipe: ${JSON.stringify(recipe)}\n\nUser request: ${message}`
        }
      ],
      functions: [
        {
          name: "modifyRecipe",
          parameters: {
            type: "object",
            properties: {
              recipe: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  title: { type: "string" },
                  servings: { type: "number" },
                  totalTime: { type: "number" },
                  ingredients: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        amount: { type: "number" },
                        unit: { type: "string" },
                        notes: { type: "string", optional: true }
                      }
                    }
                  },
                  instructions: {
                    type: "array",
                    items: { type: "string" }
                  }
                },
                required: ["id", "title", "servings", "ingredients", "instructions"]
              },
              explanation: { type: "string" }
            },
            required: ["explanation"]
          }
        }
      ],
      function_call: {
        name: "modifyRecipe"
      }
    });

    const response = completion.choices[0].message;

    if (response.function_call?.name === "modifyRecipe") {
      const result = JSON.parse(response.function_call.arguments);
      
      // Check if the recipe was actually modified
      const hasChanges = JSON.stringify(result.recipe) !== JSON.stringify(recipe);

      return res.status(200).json({
        message: result.explanation,
        ...(hasChanges && { updatedRecipe: result.recipe })
      });
    }

    // Fallback for general questions/advice
    return res.status(200).json({
      message: response.content || "I couldn't process that request. Please try again."
    });

  } catch (error: any) {
    console.error('Chat API error:', error);
    
    // Handle rate limiting
    if (error?.status === 429) {
      return res.status(429).json({
        message: 'Too many requests. Please try again in a moment.'
      });
    }

    // Handle invalid API key
    if (error?.status === 401) {
      return res.status(500).json({
        message: 'API configuration error. Please contact support.'
      });
    }

    // Handle OpenAI API errors
    if (error?.response?.data?.error) {
      return res.status(500).json({
        message: 'AI service error. Please try again.'
      });
    }

    // Generic error
    return res.status(500).json({
      message: 'Failed to process your request. Please try again.'
    });
  }
}