import { supabase } from './supabase'
import { Recipe } from '@/types/recipe'

export async function getRecipeById(id: string): Promise<Recipe | null> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching recipe:', error)
    return null
  }

  return data as Recipe
}

export async function updateRecipeInDatabase(recipe: Recipe): Promise<void> {
  const { error } = await supabase
    .from('recipes')
    .upsert(recipe)

  if (error) {
    console.error('Error updating recipe:', error)
    throw error
  }
}