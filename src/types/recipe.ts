// src/types/recipe.ts

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface Recipe {
  id: string;
  title: string;
  totalTime: number;
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
}

export type RecipeUpdate = Partial<Recipe> & { ingredients?: Partial<Ingredient>[], instructions?: string[] };

// Utility functions

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function parseIngredient(ingredientString: string): Ingredient {
  const match = ingredientString.match(/^([\d.\/]+)?\s*(\w+)?\s*(.+)$/);
  if (!match) {
    throw new Error(`Invalid ingredient format: ${ingredientString}`);
  }
  
  let [, amountStr = '1', unit = '', name] = match;
  let amount = eval(amountStr); // This allows for fractions like '1/2'
  
  if (isNaN(amount)) {
    throw new Error(`Invalid amount in ingredient: ${ingredientString}`);
  }
  
  return { name: name.trim(), amount, unit: unit.trim() };
}

export function formatIngredient(ingredient: Ingredient): string {
  return `${ingredient.amount} ${ingredient.unit} ${ingredient.name}`.trim();
}

export function scaleIngredient(ingredient: Ingredient, factor: number): Ingredient {
  return {
    ...ingredient,
    amount: Number((ingredient.amount * factor).toFixed(2))
  };
}

export function convertUnit(ingredient: Ingredient, toMetric: boolean): Ingredient {
  if (toMetric) {
    if (ingredient.unit === 'oz') {
      return { ...ingredient, amount: Number((ingredient.amount * 28.35).toFixed(2)), unit: 'g' };
    }
    if (ingredient.unit === 'cup') {
      return { ...ingredient, amount: Number((ingredient.amount * 236.6).toFixed(2)), unit: 'ml' };
    }
  } else {
    if (ingredient.unit === 'g') {
      return { ...ingredient, amount: Number((ingredient.amount / 28.35).toFixed(2)), unit: 'oz' };
    }
    if (ingredient.unit === 'ml') {
      return { ...ingredient, amount: Number((ingredient.amount / 236.6).toFixed(2)), unit: 'cup' };
    }
  }
  return ingredient;
}

export function createRecipe(data: Partial<Recipe>): Recipe {
  const recipe = {
    id: data.id || generateUUID(),
    title: data.title || 'Untitled Recipe',
    totalTime: data.totalTime || 0,
    servings: data.servings || 1,
    ingredients: data.ingredients || [],
    instructions: data.instructions || [],
  };

  if (!validateRecipe(recipe)) {
    throw new Error('Invalid recipe data');
  }

  return recipe;
}

export function scaleRecipe(recipe: Recipe, newServings: number): Recipe {
  if (newServings <= 0) {
    throw new Error('New servings must be a positive number');
  }

  const factor = newServings / recipe.servings;
  const scaledRecipe = {
    ...recipe,
    servings: newServings,
    ingredients: recipe.ingredients.map(ing => scaleIngredient(ing, factor))
  };

  if (!validateRecipe(scaledRecipe)) {
    throw new Error('Scaling resulted in an invalid recipe');
  }

  return scaledRecipe;
}

export function validateRecipe(recipe: Recipe): boolean {
  if (!recipe || typeof recipe !== 'object') {
    console.error('Invalid recipe object');
    return false;
  }

  const requiredFields: (keyof Recipe)[] = ['id', 'title', 'totalTime', 'servings', 'ingredients', 'instructions'];
  for (const field of requiredFields) {
    if (!(field in recipe)) {
      console.error(`Missing required field: ${field}`);
      return false;
    }
  }

  if (typeof recipe.id !== 'string' || recipe.id.trim() === '') {
    console.error('Invalid recipe id');
    return false;
  }
  if (typeof recipe.title !== 'string' || recipe.title.trim() === '') {
    console.error('Invalid recipe title');
    return false;
  }
  if (typeof recipe.totalTime !== 'number' || recipe.totalTime < 0) {
    console.error('Invalid totalTime');
    return false;
  }
  if (typeof recipe.servings !== 'number' || recipe.servings <= 0) {
    console.error('Invalid servings');
    return false;
  }

  for (const ing of recipe.ingredients) {
    if (typeof ing.name !== 'string' || typeof ing.amount !== 'number' || typeof ing.unit !== 'string') {
      return false;
    }
  }
  
  for (const instruction of recipe.instructions) {
    if (typeof instruction !== 'string') return false;
  }
  
  return true;
}

export function updateRecipe(recipe: Recipe, update: RecipeUpdate): Recipe {
  const updatedRecipe = { ...recipe, ...update };

  if (update.ingredients) {
    updatedRecipe.ingredients = recipe.ingredients.map((ing, index) => ({
      ...ing,
      ...(update.ingredients && update.ingredients[index] ? update.ingredients[index] : {})
    }));
  }

  if (update.instructions) {
    updatedRecipe.instructions = update.instructions;
  }

  if (!validateRecipe(updatedRecipe)) {
    throw new Error('Update resulted in an invalid recipe');
  }

  return updatedRecipe;
}
