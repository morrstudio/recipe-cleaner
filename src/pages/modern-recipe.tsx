import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ChevronRight, 
  Clock, 
  Users, 
  Check,
  Bot,
  Share2,
  Sparkles,
  Plus,
  Minus,
  X,
  ArrowLeft
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert } from "@/components/ui/alert"
import { Recipe, Ingredient } from '@/types/recipe'
import { AIChat } from '@/components/AIChat'
import { useRouter } from 'next/router';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/ui/loading";
import { RecipeDisplay } from '@/components/RecipeDisplay';

export default function ModernRecipePage() {
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const router = useRouter();
  const { toast } = useToast();
  const [isMetric, setIsMetric] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState<number[]>([]);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    const savedRecipe = localStorage.getItem('scrapedRecipe');
    if (!savedRecipe) {
      toast({
        title: "Error",
        description: "No recipe found",
        variant: "destructive"
      });
      router.push('/');
      return;
    }

    try {
      setRecipe(JSON.parse(savedRecipe));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load recipe",
        variant: "destructive"
      });
      router.push('/');
    }
  }, [router, toast]);

  const handleRecipeUpdate = (updatedRecipe: Recipe) => {
    setRecipe(updatedRecipe);
    localStorage.setItem('scrapedRecipe', JSON.stringify(updatedRecipe));
    toast({
      title: "Success",
      description: "Recipe updated successfully"
    });
  };

  const handleServingsChange = (newServings: number) => {
    if (!recipe) return;
    
    const updatedRecipe = {
      ...recipe,
      servings: newServings
    };
    setRecipe(updatedRecipe);
    localStorage.setItem('scrapedRecipe', JSON.stringify(updatedRecipe));
  };

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-[300px] h-[150px] flex items-center justify-center">
          <LoadingSpinner />
        </Card>
      </div>
    );
  }

  const formatAmount = (amount: number, unit: string) => {
    if (isMetric) {
      // Convert to metric and round to 1 decimal place
      switch (unit.toLowerCase()) {
        case 'cup':
        case 'cups':
          return { amount: Math.round(amount * 236.588 * 10) / 10, unit: 'ml' }
        case 'tablespoon':
        case 'tablespoons':
        case 'tbsp':
          return { amount: Math.round(amount * 14.787 * 10) / 10, unit: 'ml' }
        case 'teaspoon':
        case 'teaspoons':
        case 'tsp':
          return { amount: Math.round(amount * 4.929 * 10) / 10, unit: 'ml' }
        case 'pound':
        case 'pounds':
        case 'lb':
        case 'lbs':
          return { amount: Math.round(amount * 453.592 * 10) / 10, unit: 'g' }
        case 'ounce':
        case 'ounces':
        case 'oz':
          return { amount: Math.round(amount * 28.35 * 10) / 10, unit: 'g' }
        default:
          return { amount, unit }
      }
    }
    return { amount, unit }
  }

  const toggleStep = (index: number) => {
    setExpandedSteps(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const toggleStepCompletion = (index: number) => {
    setCompletedSteps(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-12 px-4">
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <RecipeDisplay 
          recipe={recipe}
          isMetric={isMetric}
          onMetricToggle={() => setIsMetric(!isMetric)}
          onServingsChange={handleServingsChange}
          expandedSteps={expandedSteps}
          onToggleStep={toggleStep}
          completedSteps={completedSteps}
          onToggleStepComplete={toggleStepCompletion}
        />

        <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
          <SheetTrigger asChild>
            <Button
              className="fixed bottom-6 right-6 shadow-lg"
              size="lg"
            >
              <Bot className="mr-2 h-5 w-5" />
              Ask AI Assistant
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[400px] sm:w-[540px] p-0">
            <AIChat
              recipe={recipe}
              onRecipeUpdate={handleRecipeUpdate}
              onClose={() => setIsChatOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}