// src/components/RecipeCard.tsx
import { Clock, Users } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Recipe } from '@/types/recipe'

interface RecipeCardProps {
  recipe: Recipe
  onClick?: () => void
}

export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle>{recipe.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {recipe.totalTime} min
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {recipe.servings} servings
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">
            {recipe.ingredients.length} ingredients
          </Badge>
          <Badge variant="secondary">
            {recipe.instructions.length} steps
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}