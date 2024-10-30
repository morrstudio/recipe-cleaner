// /lib/recipeUtils.ts
import { Recipe } from '@/types/recipe';

export function validateRecipeModification(original: Recipe, modified: Recipe): boolean {
  // Ensure required fields are present
  const requiredFields: (keyof Recipe)[] = ['id', 'title', 'servings', 'ingredients', 'instructions'];
  for (const field of requiredFields) {
    if (!modified[field]) return false;
  }

  // Validate ingredients
  for (const ingredient of modified.ingredients) {
    if (
      typeof ingredient.name !== 'string' ||
      typeof ingredient.amount !== 'number' ||
      typeof ingredient.unit !== 'string'
    ) {
      return false;
    }
  }

  // Validate instructions
  if (!Array.isArray(modified.instructions) || 
      !modified.instructions.every(i => typeof i === 'string')) {
    return false;
  }

  // Additional validation rules can be added here

  return true;
}

export function summarizeRecipeChanges(original: Recipe, modified: Recipe): string[] {
  const changes: string[] = [];

  // Check title change
  if (original.title !== modified.title) {
    changes.push(`Title changed from "${original.title}" to "${modified.title}"`);
  }

  // Check servings change
  if (original.servings !== modified.servings) {
    changes.push(`Servings changed from ${original.servings} to ${modified.servings}`);
  }

  // Check ingredient changes
  const originalIngredients = new Set(original.ingredients.map(i => `${i.amount} ${i.unit} ${i.name}`));
  const modifiedIngredients = modified.ingredients.map(i => `${i.amount} ${i.unit} ${i.name}`);

  modifiedIngredients.forEach(ing => {
    if (!originalIngredients.has(ing)) {
      changes.push(`Added or modified ingredient: ${ing}`);
    }
  });

  // Check instruction changes
  modified.instructions.forEach((inst, i) => {
    if (inst !== original.instructions[i]) {
      changes.push(`Modified instruction ${i + 1}`);
    }
  });

  return changes;
}