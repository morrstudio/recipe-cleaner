'use client'

import { useState, useEffect, useMemo } from 'react'
import { ChefHat, Clock, Users } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import AIChat from '@/components/AIChat'
import { Recipe, Ingredient, scaleRecipe, convertUnit, createRecipe, formatIngredient, validateRecipe, parseIngredient } from '../types/recipe'
import { chatWithAI } from '../utils/ai-utils';

export default function ModernRecipePage() {
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [servings, setServings] = useState(4)
  const [useMetric, setUseMetric] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [userInput, setUserInput] = useState('')
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [expandedSteps, setExpandedSteps] = useState<number[]>([])
  const [recipeUpdated, setRecipeUpdated] = useState(false)

  useEffect(() => {
    const storedRecipe = localStorage.getItem('scrapedRecipe')
    if (storedRecipe) {
      try {
        const parsedRecipe = JSON.parse(storedRecipe)
        const newRecipe = createRecipe({
          ...parsedRecipe,
          ingredients: parsedRecipe.ingredients.map(parseIngredient)
        })
        if (validateRecipe(newRecipe)) {
          setRecipe(newRecipe)
          setServings(newRecipe.servings)
        } else {
          console.error('Invalid recipe data')
        }
      } catch (error) {
        console.error('Error parsing stored recipe:', error)
      }
    }
  }, [])

  const toggleExpandedStep = (stepIndex: number) => {
    setExpandedSteps(prev => 
      prev.includes(stepIndex) 
        ? prev.filter(i => i !== stepIndex)
        : [...prev, stepIndex]
    )
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userInput.trim() || !recipe) return

    const userMessage = { role: 'user' as const, content: userInput }
    setChatMessages(prev => [...prev, userMessage])
    setUserInput('')
    setIsLoading(true)

    try {
      const response = await chatWithAI(userInput, recipe.id)
      const aiMessage = { role: 'assistant' as const, content: response.message }
      setChatMessages(prev => [...prev, aiMessage])
      if (response.updatedRecipe) {
        setRecipe(response.updatedRecipe)
      }
    } catch (error) {
      console.error('AI chat error:', error)
      const errorMessage = { role: 'assistant' as const, content: 'Sorry, I encountered an error. Please try again.' }
      setChatMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleRecipeUpdate = (updatedRecipe: Recipe) => {
    if (validateRecipe(updatedRecipe)) {
      setRecipe(updatedRecipe)
      localStorage.setItem('scrapedRecipe', JSON.stringify(updatedRecipe))
      console.log('Recipe updated successfully')
      setRecipeUpdated(true)
      setTimeout(() => setRecipeUpdated(false), 3000)
    } else {
      console.error('Invalid updated recipe data:', updatedRecipe)
      // Consider showing an error message to the user
    }
  }

  const scaledRecipe = useMemo(() => {
    if (!recipe) return null;
    let scaledRecipe = scaleRecipe(recipe, servings);
    if (useMetric) {
      scaledRecipe = {
        ...scaledRecipe,
        ingredients: scaledRecipe.ingredients.map(ing => convertUnit(ing, true))
      };
    }
    return scaledRecipe;
  }, [recipe, servings, useMetric]);

  if (!recipe || !scaledRecipe) return <div>Loading...</div>

  return (
    <div className="bg-[#F9F5F2] min-h-screen text-gray-800 font-sans pb-24">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold text-center mb-4">{recipe.title}</h1>
        
        {recipeUpdated && (
          <div className="update-notification">Recipe updated successfully!</div>
        )}

        <div className="flex justify-center items-center space-x-8 mb-6">
          <div className="flex items-center">
            <Clock className="h-6 w-6 mr-2 text-gray-600" />
            <span className="text-lg">Total Time: {recipe.totalTime} min</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-gray-600" />
            <span className="text-lg">{servings} servings</span>
            <div className="flex items-center space-x-1">
              <Button onClick={() => setServings(Math.max(1, servings - 1))} variant="outline" size="sm">-</Button>
              <Button onClick={() => setServings(servings + 1)} variant="outline" size="sm">+</Button>
            </div>
          </div>
        </div>

        <Button
          onClick={() => setChatOpen(true)}
          className="w-full mb-10 bg-blue-600 hover:bg-blue-700 text-white text-lg py-3 rounded-full transition-colors duration-200"
        >
          <ChefHat className="h-6 w-6 mr-2" />
          Customize Recipe with AI Assistant
        </Button>

        <Card className="mb-8 shadow-lg">
          <CardContent className="p-6">
            <Tabs defaultValue="ingredients">
              <TabsList className="w-full mb-6">
                <TabsTrigger value="ingredients" className="flex-1">Ingredients</TabsTrigger>
                <TabsTrigger value="instructions" className="flex-1">Instructions</TabsTrigger>
              </TabsList>
              <TabsContent value="ingredients">
                <div className="flex items-center justify-end mb-4">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="metric-switch" className="text-sm">Metric</Label>
                    <Switch
                      id="metric-switch"
                      checked={useMetric}
                      onCheckedChange={setUseMetric}
                    />
                  </div>
                </div>
                {scaledRecipe ? (
                  <ul className="space-y-4">
                    {scaledRecipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex justify-between items-center py-2 border-b border-gray-200 text-lg">
                        <span>{formatIngredient(ingredient)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No ingredients available</p>
                )}
              </TabsContent>
              <TabsContent value="instructions">
                <ol className="space-y-6">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="border-b border-gray-200 pb-4">
                      <div 
                        className="flex items-start cursor-pointer"
                        onClick={() => toggleExpandedStep(index)}
                      >
                        <span className="mr-4 font-bold text-xl">{index + 1}.</span>
                        <div>
                          <p className="text-lg mb-2">{instruction}</p>
                          {expandedSteps.includes(index) && (
                            <ul className="ml-6 mt-2 space-y-1 text-gray-600">
                              {recipe.ingredients
                                .filter(ing => instruction.toLowerCase().includes(ing.name.toLowerCase()))
                                .map((ing, i) => (
                                  <li key={i} className="text-sm">{ing.name}</li>
                                ))
                              }
                            </ul>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg transition-all duration-300 ease-in-out ${chatOpen ? 'h-96' : 'h-16'}`}>
        <div className="max-w-4xl mx-auto px-4 h-full flex flex-col">
          <div className="flex items-center justify-between py-4">
            <Button
              onClick={() => setChatOpen(!chatOpen)}
              variant="ghost"
              className="text-[#1A2530] font-semibold hover:bg-[#1A2530] hover:text-white transition-colors duration-200"
            >
              <ChefHat className="h-5 w-5 mr-2" />
              {chatOpen ? 'Close AI Sous Chef' : 'Open AI Sous Chef'}
            </Button>
            {!chatOpen && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{recipe.totalTime} mins</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  <span>{servings} servings</span>
                </div>
              </div>
            )}
          </div>
          {chatOpen && recipe && (
            <AIChat 
              recipeId={recipe.id} 
              onRecipeUpdate={handleRecipeUpdate} 
            />
          )}
        </div>
      </div>
    </div>
  )
}
