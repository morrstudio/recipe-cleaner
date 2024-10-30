// src/components/RecipeDisplay.tsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Clock, Users, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { Recipe } from '@/types/recipe'
import { cn } from "@/lib/utils"

interface RecipeDisplayProps {
  recipe: Recipe
  onServingsChange: (servings: number) => void
}

export function RecipeDisplay({ recipe, onServingsChange }: RecipeDisplayProps) {
  const [useMetric, setUseMetric] = useState(false)
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const toggleStep = (index: number) => {
    setActiveStep(activeStep === index ? null : index)
  }

  const toggleStepCompletion = (index: number) => {
    setCompletedSteps(prev => 
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const formatAmount = (amount: number, unit: string): string => {
    if (useMetric) {
      switch (unit.toLowerCase()) {
        case 'cup':
        case 'cups':
          return `${(amount * 236.588).toFixed(0)}ml`
        case 'tablespoon':
        case 'tablespoons':
          return `${(amount * 15).toFixed(0)}ml`
        case 'teaspoon':
        case 'teaspoons':
          return `${(amount * 5).toFixed(0)}ml`
        case 'pound':
        case 'pounds':
          return `${(amount * 453.592).toFixed(0)}g`
        case 'ounce':
        case 'ounces':
          return `${(amount * 28.35).toFixed(0)}g`
        default:
          return `${amount}${unit}`
      }
    }
    return `${amount}${unit}`
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-2xl font-bold">{recipe.title}</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{recipe.totalTime} min</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>{recipe.servings} servings</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Unit Toggle */}
        <div className="flex justify-end">
          <div className="flex items-center space-x-2">
            <Switch
              checked={useMetric}
              onCheckedChange={setUseMetric}
              id="metric-toggle"
            />
            <Label htmlFor="metric-toggle">Metric Units</Label>
          </div>
        </div>

        {/* Ingredients */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Ingredients</h3>
          <div className="grid gap-2">
            {recipe.ingredients.map((ingredient, index) => (
              <div
                key={index}
                className="flex justify-between p-2 rounded-lg hover:bg-accent transition-colors"
              >
                <span>{ingredient.name}</span>
                <span className="text-muted-foreground">
                  {formatAmount(ingredient.amount, ingredient.unit)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Instructions</h3>
          <div className="space-y-4">
            {recipe.instructions.map((instruction, index) => (
              <motion.div
                key={index}
                className={cn(
                  "rounded-lg border",
                  completedSteps.includes(index) && "bg-accent/50"
                )}
              >
                <div className="p-4 flex gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "h-8 w-8 rounded-full shrink-0",
                      completedSteps.includes(index) && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => toggleStepCompletion(index)}
                  >
                    {completedSteps.includes(index) ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </Button>
                  <div className="space-y-2">
                    <p className={cn(
                      "text-sm leading-relaxed",
                      completedSteps.includes(index) && "text-muted-foreground line-through"
                    )}>
                      {instruction}
                    </p>
                  </div>
                </div>
                <AnimatePresence>
                  {activeStep === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4"
                    >
                      {/* Add step-specific ingredients or notes here */}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}