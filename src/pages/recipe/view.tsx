// src/pages/recipe/view.tsx
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { LoadingCard, ErrorDisplay } from '@/components/ui/loading'
import { useToast } from "@/components/ui/use-toast"
import type { Recipe } from '@/types/recipe'
import { RecipeDisplay } from '@/components/RecipeDisplay'

export default function RecipeViewPage() {
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    try {
      const savedRecipe = localStorage.getItem('scrapedRecipe')
      if (!savedRecipe) {
        throw new Error('No recipe found')
      }

      const parsedRecipe = JSON.parse(savedRecipe) as Recipe
      setRecipe(parsedRecipe)
    } catch (err) {
      setError(new Error('Failed to load recipe'))
      toast({
        title: "Error",
        description: "Failed to load recipe",
        variant: "destructive"
      })
      router.push('/')
    }
  }, [router, toast])

  const handleServingsChange = (newServings: number) => {
    if (recipe) {
      setRecipe({
        ...recipe,
        servings: newServings
      })
    }
  }

  if (error) {
    return <ErrorDisplay error={error} resetError={() => router.push('/')} />
  }

  if (!recipe) {
    return (
      <div className="container max-w-4xl py-12">
        <LoadingCard />
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-12">
      {recipe && (
        <RecipeDisplay 
          recipe={recipe}
          onServingsChange={handleServingsChange}
        />
      )}
    </div>
  )
}