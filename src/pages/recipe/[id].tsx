import OpenAI from 'openai'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Be cautious with this in production
})

export async function extractRecipe(url: string | null, toast: any) {
  if (!url) {
    throw new Error('URL is required')
  }

  try {
    toast({
      title: "Extracting Recipe",
      description: "Please wait while we process your recipe...",
    })

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that extracts recipe information from URLs. Return the response in JSON format with 'ingredients' and 'instructions' arrays."
        },
        {
          role: "user",
          content: `Extract the ingredients and instructions from this recipe URL: ${url}. Return the response in JSON format.`
        }
      ],
    })

    const extractedRecipe = response.choices[0].message.content
    if (!extractedRecipe) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No recipe content returned",
      })
      throw new Error('No recipe content returned')
    }

    try {
      const parsedRecipe = JSON.parse(extractedRecipe)
      toast({
        title: "Success",
        description: "Recipe extracted successfully!",
      })
      return parsedRecipe
    } catch (parseError) {
      console.error('Error parsing recipe JSON:', parseError)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Recipe response was not in valid JSON format",
      })
      throw new Error('Recipe response was not in valid JSON format')
    }
  } catch (error) {
    console.error('Error extracting recipe:', error)
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to extract recipe",
    })
    throw new Error('Failed to extract recipe')
  }
}
