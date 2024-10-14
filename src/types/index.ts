export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Recipe {
  _id: string;
  title: string;
  description: string;
  prepTime: number;
  cookTime: number;
  totalTime: number;
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  tags: string[];
  cuisine: string;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl: string;
  author: string;
  dateCreated: Date;
  dateModified: Date;
  rating: number;
  nutritionInfo: NutritionInfo;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  bio: string;
  dietaryPreferences: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
  };
  cookingExperience: string;
  favoriteIngredients: string[];
  cuisinePreferences: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  _id: string;
  recipeId: string;
  userId: string;
  text: string;
  createdAt: Date;
}

export interface Rating {
  _id: string;
  recipeId: string;
  userId: string;
  value: number;
  createdAt: Date;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface RecipeFilters {
  cuisine?: string;
  difficulty?: Difficulty;
  prepTime?: number;
  cookTime?: number;
  tags?: string[];
}

export interface SavedRecipe {
  id: string;
  title: string;
  url: string;
}