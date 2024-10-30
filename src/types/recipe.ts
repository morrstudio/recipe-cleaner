// src/types/recipe.ts

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  notes?: string;
  preparation?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  totalTime: number;
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  source?: {
    url: string;
    name: string;
  };
  metadata?: {
    cuisine?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    tags?: string[];
  };
  useMetric?: boolean;
}

export interface RecipeModification {
  id: string;
  recipeId: string;
  type: 'ingredient' | 'instruction' | 'servings';
  originalValue: string;
  newValue: string;
  reason: string;
  timestamp: Date;
}

export type RecipeValidationError = {
  field: string;
  message: string;
};

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  validationErrors?: RecipeValidationError[];
}

export interface RecipeDisplayProps {
  recipe: Recipe
  isMetric: boolean
  onMetricToggle: () => void
  onServingsChange: (newServings: number) => void
  expandedSteps: number[]
  onToggleStep: (index: number) => void
  completedSteps: number[]
  onToggleStepComplete: (index: number) => void
}