// src/components/RecipeDisplay/index.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Check, Bot, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Recipe } from '@/types/recipe';
import { cn } from "@/lib/utils";

interface RecipeDisplayProps {
  recipe: Recipe;
  useMetric?: boolean;
  onMetricToggle?: () => void;
  onServingsChange?: (servings: number) => void;
  expandedSteps?: number[];
  onToggleStep?: (index: number) => void;
  completedSteps?: number[];
  onToggleStepComplete?: (index: number) => void;
  onOpenAIChat?: () => void;
}

export function RecipeDisplay({ 
  recipe, 
  useMetric = false,
  onMetricToggle,
  onServingsChange,
  expandedSteps = [],
  onToggleStep,
  completedSteps = [],
  onToggleStepComplete,
  onOpenAIChat 
}: RecipeDisplayProps) {
  const [servings, setServings] = useState(recipe.servings);

  const formatAmount = (amount: number, unit: string): string => {
    let convertedAmount = amount;
    let convertedUnit = unit;

    if (useMetric) {
      switch (unit.toLowerCase()) {
        case 'cup':
        case 'cups':
          convertedAmount = amount * 236.588;
          convertedUnit = 'ml';
          break;
        case 'tablespoon':
        case 'tablespoons':
          convertedAmount = amount * 14.787;
          convertedUnit = 'ml';
          break;
        case 'teaspoon':
        case 'teaspoons':
          convertedAmount = amount * 4.929;
          convertedUnit = 'ml';
          break;
        case 'pound':
        case 'pounds':
          convertedAmount = amount * 453.592;
          convertedUnit = 'g';
          break;
        case 'ounce':
        case 'ounces':
          convertedAmount = amount * 28.35;
          convertedUnit = 'g';
          break;
      }
    }
    return `${convertedAmount.toFixed(1)} ${convertedUnit}`;
  };

  const adjustServings = (delta: number) => {
    const newServings = Math.max(1, servings + delta);
    setServings(newServings);
    onServingsChange?.(newServings);
  };

  const toggleStep = (index: number) => {
    onToggleStepComplete?.(index);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{recipe.title}</h1>
        {onOpenAIChat && (
          <Button onClick={onOpenAIChat}>
            <Bot className="mr-2 h-4 w-4" />
            AI Assistant
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <span>{recipe.totalTime} min</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => adjustServings(-1)}
              disabled={servings <= 1}
            >
              -
            </Button>
            <span className="min-w-[3ch] text-center">{servings}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => adjustServings(1)}
            >
              +
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="ingredients">
            <TabsList>
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              <TabsTrigger value="instructions">Instructions</TabsTrigger>
            </TabsList>

            <TabsContent value="ingredients">
              <div className="flex justify-end mb-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="metric"
                    checked={useMetric}
                    onCheckedChange={onMetricToggle}
                  />
                  <Label htmlFor="metric">Metric Units</Label>
                </div>
              </div>

              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => {
                    const scalingFactor = servings / recipe.servings;
                    const scaledAmount = ingredient.amount * scalingFactor;
                    
                    return (
                      <div
                        key={index}
                        className="flex justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <span>{ingredient.name}</span>
                        <span className="text-muted-foreground">
                          {formatAmount(scaledAmount, ingredient.unit)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="instructions">
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {recipe.instructions.map((instruction, index) => (
                    <motion.div
                      key={index}
                      className={cn(
                        "border rounded-lg p-4",
                        completedSteps.includes(index) && "bg-accent/50"
                      )}
                      layout
                    >
                      <div className="flex gap-4">
                        <Button
                          variant="outline"
                          size="icon"
                          className={cn(
                            "h-8 w-8 rounded-full shrink-0",
                            completedSteps.includes(index) && 
                            "bg-primary text-primary-foreground"
                          )}
                          onClick={() => toggleStep(index)}
                        >
                          {completedSteps.includes(index) ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <span>{index + 1}</span>
                          )}
                        </Button>
                        <p className={cn(
                          "text-sm leading-relaxed",
                          completedSteps.includes(index) && 
                          "text-muted-foreground line-through"
                        )}>
                          {instruction}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}