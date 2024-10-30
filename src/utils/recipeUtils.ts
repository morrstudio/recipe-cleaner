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

interface MetricConversion {
  fromUnit: string;
  toUnit: string;
  factor: number;
}

const metricConversions: MetricConversion[] = [
  { fromUnit: 'pound', toUnit: 'gram', factor: 453.592 },
  { fromUnit: 'pounds', toUnit: 'grams', factor: 453.592 },
  { fromUnit: 'oz', toUnit: 'gram', factor: 28.3495 },
  { fromUnit: 'ounce', toUnit: 'gram', factor: 28.3495 },
  { fromUnit: 'ounces', toUnit: 'grams', factor: 28.3495 },
  { fromUnit: 'cup', toUnit: 'milliliter', factor: 236.588 },
  { fromUnit: 'cups', toUnit: 'milliliters', factor: 236.588 },
  { fromUnit: 'tablespoon', toUnit: 'milliliter', factor: 14.7868 },
  { fromUnit: 'tablespoons', toUnit: 'milliliters', factor: 14.7868 },
  { fromUnit: 'teaspoon', toUnit: 'milliliter', factor: 4.92892 },
  { fromUnit: 'teaspoons', toUnit: 'milliliters', factor: 4.92892 }
];

export function convertToMetric(amount: number, unit: string): { amount: number; unit: string } {
  const normalizedUnit = unit.toLowerCase();
  const conversion = metricConversions.find(c => c.fromUnit === normalizedUnit);
  
  if (!conversion) return { amount, unit };
  
  return {
    amount: Number((amount * conversion.factor).toFixed(1)),
    unit: conversion.toUnit
  };
}

export function parseIngredientText(text: string) {
  const match = text.match(/^([\d\s\/]+)?\s*([a-zA-Z]+)?\s*(.+)$/);
  if (!match) return null;

  const [, amountStr = '1', unit = '', name] = match;
  return {
    amount: parseFraction(amountStr.trim()),
    unit: unit.toLowerCase().trim(),
    name: name.trim()
  };
}

export function parseFraction(fraction: string): number {
  if (!fraction) return 1;
  
  const parts = fraction.split(' ');
  if (parts.length > 1) {
    return parts.reduce((acc, part) => acc + parseFraction(part), 0);
  }

  if (fraction.includes('/')) {
    const [num, denom] = fraction.split('/').map(Number);
    return num / denom;
  }

  return Number(fraction);
}

export function formatNumber(num: number): string {
  if (num === Math.floor(num)) return num.toString();

  const fractions: Record<number, string> = {
    0.25: '¼',
    0.5: '½',
    0.75: '¾',
    0.33: '⅓',
    0.67: '⅔',
    0.2: '⅕',
    0.4: '⅖',
    0.6: '⅗',
    0.8: '⅘'
  };

  const whole = Math.floor(num);
  const decimal = num - whole;
  
  const closestFraction = Object.entries(fractions).reduce((prev, [dec, frac]) => 
    Math.abs(Number(dec) - decimal) < Math.abs(Number(prev[0]) - decimal) ? [dec, frac] : prev
  );

  return whole ? `${whole} ${closestFraction[1]}` : closestFraction[1];
}

export function formatIngredient(amount: number, unit: string, name: string, useMetric: boolean): string {
  let formattedAmount = amount;
  let formattedUnit = unit;

  if (useMetric) {
    const metric = convertToMetric(amount, unit);
    formattedAmount = metric.amount;
    formattedUnit = metric.unit;
  }

  const displayAmount = formatNumber(formattedAmount);
  const displayUnit = formattedUnit ? ` ${formattedUnit}` : '';
  
  return `${displayAmount}${displayUnit} ${name}`.trim();
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
