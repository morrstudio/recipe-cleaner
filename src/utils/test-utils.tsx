// src/utils/test-utils.tsx
import React from 'react';
import { render as rtlRender, screen, fireEvent, waitFor } from '@testing-library/react';
import { Recipe } from '@/types/recipe';

// Create test wrapper with providers
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div>{children}</div>
  );
}

function render(ui: React.ReactElement, options = {}) {
  return rtlRender(ui, { wrapper: TestWrapper, ...options });
}

// Mock recipe for testing
export const mockRecipe: Recipe = {
  id: '1',
  title: 'Test Recipe',
  servings: 4,
  totalTime: 30,
  ingredients: [
    { id: '1', name: 'Test Ingredient', amount: 1, unit: 'cup' }
  ],
  instructions: ['Test instruction']
};

export { render, screen, fireEvent, waitFor };