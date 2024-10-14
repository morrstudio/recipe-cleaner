import { Recipe, Ingredient } from '@/types'

export function adjustServings(recipe: Recipe, newServings: number): Recipe {
  const factor = newServings / recipe.servings
  const adjustedIngredients = recipe.ingredients.map(ing => ({
    ...ing,
    amount: ing.amount * factor
  }))

  return {
    ...recipe,
    ingredients: adjustedIngredients,
    servings: newServings
  }
}

export function convertToMetric(ingredient: Ingredient): Ingredient {
  const { amount, unit } = ingredient
  switch (unit.toLowerCase()) {
    case 'cup':
    case 'cups':
      return { ...ingredient, amount: amount * 236.588, unit: 'ml' }
    case 'tbsp':
    case 'tablespoon':
    case 'tablespoons':
      return { ...ingredient, amount: amount * 14.7868, unit: 'ml' }
    case 'tsp':
    case 'teaspoon':
    case 'teaspoons':
      return { ...ingredient, amount: amount * 4.92892, unit: 'ml' }
    case 'oz':
    case 'ounce':
    case 'ounces':
      return { ...ingredient, amount: amount * 28.3495, unit: 'g' }
    case 'lb':
    case 'pound':
    case 'pounds':
      return { ...ingredient, amount: amount * 453.592, unit: 'g' }
    default:
      return ingredient
  }
}

export function formatAmount(amount: number): string {
  if (amount % 1 === 0) {
    return amount.toString()
  }
  return amount.toFixed(2)
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}