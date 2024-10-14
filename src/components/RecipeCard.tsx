import Link from 'next/link'
import { Clock, Users } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Recipe } from '@/types'

interface RecipeCardProps {
  recipe: Recipe
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/recipe/${recipe._id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow duration-200">
        <div className="p-6">
          <h3 className="text-lg font-semibold">{recipe.title}</h3>
        </div>
        <CardContent>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {recipe.prepTime + recipe.cookTime} min
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {recipe.servings} servings
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {recipe.ingredients.length} ingredients • {recipe.instructions.length} steps
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
