'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Check, Share2, ChefHat, Clock, Users, X, Minus, Plus, Send } from 'lucide-react'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Card, CardContent } from "../components/ui/card"
import { Tooltip } from "../components/ui/tooltip"
import { Switch } from "../components/ui/switch"
import { Label } from "../components/ui/label"
import { ScrollArea } from "../components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { Badge } from "../components/ui/badge"

interface Ingredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
}

interface Instruction {
  id: number;
  text: string;
}

interface Recipe {
  title: string;
  servings: number;
  prepTime: number;
  cookTime: number;
  ingredients: Ingredient[];
  instructions: Instruction[];
}

export default function ModernRecipePage() {
  const [recipeData, setRecipeData] = useState<Recipe | null>(null)
  const [totalTime, setTotalTime] = useState(0)
  const [servings, setServings] = useState(4)
  const [useMetric, setUseMetric] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [userInput, setUserInput] = useState('')
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([])
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [expandedStep, setExpandedStep] = useState<number | null>(null)
  const [recipeModified, setRecipeModified] = useState(false)
  const [currentModification, setCurrentModification] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const storedRecipe = localStorage.getItem('scrapedRecipe')
    if (storedRecipe) {
      const parsedRecipe = JSON.parse(storedRecipe)
      setRecipeData(parsedRecipe)
      setTotalTime(parsedRecipe.prepTime + parsedRecipe.cookTime)
      setServings(parsedRecipe.servings)
    }
  }, [])

  const adjustServings = (amount: number) => {
    setServings(prev => Math.max(1, prev + amount))
  }

  const toggleStep = (stepId: number) => {
    setExpandedStep(expandedStep === stepId ? null : stepId)
  }

  const completeStep = (stepId: number) => {
    setCompletedSteps(prev => 
      prev.includes(stepId) ? prev.filter(id => id !== stepId) : [...prev, stepId]
    )
  }

  const convertToMetric = (amount: number, unit: string) => {
    // Implement conversion logic here
    return amount
  }

  const getMetricUnit = (unit: string) => {
    // Implement unit conversion logic here
    return unit
  }

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userInput.trim() === '') return

    const newUserMessage = { role: 'user' as const, content: userInput }
    setChatMessages(prev => [...prev, newUserMessage])

    // Simulate AI response
    let assistantResponse = "I understand you'd like help with the recipe. I can assist with modifying ingredients, adjusting quantities, suggesting alternatives, or explaining techniques. What specific aspect of the recipe would you like me to help with?"
    
    if (userInput.toLowerCase().includes('gluten-free') || userInput.toLowerCase().includes('gf')) {
      assistantResponse = "I've updated the recipe to be gluten-free. I've replaced the all-purpose flour with a gluten-free flour blend. Here are the changes:\n\n- 2.25 cups all-purpose flour → 2.25 cups gluten-free flour blend\n- Added 1 tsp xanthan gum (if not included in the flour blend)\n\nThe rest of the recipe remains the same. Remember that gluten-free cookies might have a slightly different texture. You may need to adjust the baking time slightly, so keep an eye on them in the oven."
      setRecipeModified(true)
      setCurrentModification('Gluten-Free')
    }

    const newAssistantMessage = { role: 'assistant' as const, content: assistantResponse }
    setChatMessages(prev => [...prev, newAssistantMessage])
    setUserInput('')
  }

  if (!recipeData) {
    return <div>Loading recipe...</div>
  }

  return (
    <div className="bg-[#F9F5F2] min-h-screen text-gray-800 font-sans pb-24">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-[#1A2530] mb-4">{recipeData.title}</h1>
          <div className="flex items-center justify-center text-sm text-gray-700 space-x-8 mb-4">
            <span className="flex items-center text-xl font-semibold">
              <Clock className="h-6 w-6 mr-2 text-[#1A2530]" /> 
              Total Time: {totalTime} min
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center text-sm text-gray-700 space-x-4 space-y-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor="servings">Servings</Label>
              <Users className="h-5 w-5" />
              <div className="flex items-center border rounded-md">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="px-2 py-1"
                  onClick={() => adjustServings(-1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id="servings"
                  type="number"
                  value={servings}
                  onChange={(e) => setServings(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 text-center border-none"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="px-2 py-1"
                  onClick={() => adjustServings(1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Tooltip content="Share this recipe">
              <Button variant="outline" size="sm" className="text-[#1A2530] border-[#1A2530] hover:bg-[#1A2530] hover:text-white transition-colors duration-200">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </Tooltip>
          </div>
        </header>

        <Button
          onClick={() => setChatOpen(true)}
          className="w-full mb-6 bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
        >
          <ChefHat className="h-5 w-5 mr-2" />
          Customize Recipe with AI Assistant
        </Button>

        <Card className="mb-8">
          <CardContent className="p-6">
            {recipeModified && (
              <Badge variant="outline">
                {currentModification} Version
              </Badge>
            )}
            <Tabs defaultValue="ingredients">
              <TabsList>
                <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                <TabsTrigger value="instructions">Instructions</TabsTrigger>
              </TabsList>
              <TabsContent value="ingredients">
                <div className="flex items-center justify-end mb-4">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="metric-switch">Metric</Label>
                    <Switch
                      checked={useMetric}
                      onCheckedChange={setUseMetric}
                    />
                  </div>
                </div>
                <ul className="space-y-4">
                  {recipeData.ingredients.map((ing) => (
                    <li key={ing.id} className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="font-medium text-lg text-[#1A2530]">{ing.name}</span>
                      <span className="text-gray-700">
                        {useMetric
                          ? `${(convertToMetric(ing.amount * servings / recipeData.servings, ing.unit)).toFixed(2)} ${getMetricUnit(ing.unit)}`
                          : `${(ing.amount * servings / recipeData.servings).toFixed(2)} ${ing.unit}`
                        }
                      </span>
                    </li>
                  ))}
                </ul>
              </TabsContent>
              <TabsContent value="instructions">
                <div className="space-y-6">
                  {recipeData.instructions.map((inst, index) => (
                    <motion.div
                      key={inst.id}
                      initial={false}
                      animate={{ backgroundColor: completedSteps.includes(inst.id) ? '#E5E7EB' : '#FFFFFF' }}
                      className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                    >
                      <div
                        className="p-6 flex items-start cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => toggleStep(inst.id)}
                      >
                        <div className="mr-4 mt-1">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-200 ${
                              completedSteps.includes(inst.id) ? 'bg-[#1A2530] border-[#1A2530]' : 'border-gray-400'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation()
                              completeStep(inst.id)
                            }}
                          >
                            {completedSteps.includes(inst.id) ? (
                              <Check className="h-5 w-5 text-white" />
                            ) : (
                              <span className="text-gray-600 font-medium">{index + 1}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <p className={`text-lg ${completedSteps.includes(inst.id) ? 'text-gray-500' : 'text-[#1A2530]'}`}>
                            {inst.text}
                          </p>
                        </div>
                        <ChevronDown
                          className={`h-6 w-6 text-gray-600 transform transition-transform duration-200 ${
                            expandedStep === inst.id ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
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
              size="sm"
              className="text-[#1A2530] font-semibold hover:bg-[#1A2530] hover:text-white transition-colors duration-200"
            >
              <ChefHat className="h-5 w-5 mr-2" />
              {chatOpen ? 'Close AI Sous Chef' : 'Open AI Sous Chef'}
            </Button>
            {!chatOpen && (
              <Badge variant="secondary">
                AI Assistant Available
              </Badge>
            )}
            {chatOpen && (
              <Button
                onClick={() => setChatOpen(false)}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-[#1A2530] transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
          {chatOpen && (
            <>
              <ScrollArea className="flex-grow mb-4 px-2">
                <div className="space-y-4">
                  <Alert variant="default">
                    <AlertTitle>Welcome to your AI Sous Chef!</AlertTitle>
                    <AlertDescription>
                      I can personalize this recipe to your dietary needs and preferences. Try asking me to make it gluten-free, vegan, or adjust it for any allergies you may have.
                    </AlertDescription>
                  </Alert>
                  {chatMessages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg ${message.role === 'user' ? 'bg-[#1A2530] text-white' : 'bg-gray-100 text-[#1A2530]'}`}>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <form onSubmit={handleChatSubmit} className="mb-4">
                <div className="flex items-center space-x-2">
                  <Input
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ask to modify recipe, e.g., 'Make it gluten-free'"
                    className="flex-grow border-2 border-[#1A2530] focus:ring-[#1A2530] focus:border-[#1A2530]"
                  />
                  <Button type="submit" className="bg-[#1A2530] hover:bg-[#2C3E50] text-white p-2 rounded-full transition-colors duration-200">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}