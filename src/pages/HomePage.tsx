'use client'

import { useState } from 'react'
import { useRouter } from 'next/router'
import { Eraser, Utensils, Bot } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { scrapeRecipe } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import FAQ from '@/components/FAQ'

interface AITool {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function HomePage() {
  const { isAuthenticated, login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [recipeUrl, setRecipeUrl] = useState('')
  const router = useRouter()

  const aiTools: AITool[] = [
    { 
      id: 1, 
      title: "Recipe Cleaner", 
      description: "Simplify and optimize recipes for easy reading and cooking.",
      icon: <Eraser className="h-8 w-8 text-blue-500" />
    },
    { 
      id: 2, 
      title: "Ingredient Adjuster", 
      description: "Automatically adjust ingredient quantities for different serving sizes.",
      icon: <Utensils className="h-8 w-8 text-green-500" />
    },
    { 
      id: 3, 
      title: "AI Sous Chef", 
      description: "Get personalized cooking tips and recipe modifications.",
      icon: <Bot className="h-8 w-8 text-purple-500" />
    },
  ]

  const handleSubmitRecipe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!recipeUrl.trim()) {
      toast.error('Please enter a valid recipe URL')
      return
    }
    setIsLoading(true)
    try {
      const scrapedRecipe = await scrapeRecipe(recipeUrl)
      console.log('Scraped recipe:', scrapedRecipe)
      
      // Store the scraped recipe in localStorage
      localStorage.setItem('scrapedRecipe', JSON.stringify(scrapedRecipe))
      
      // Navigate to the modern recipe page
      router.push('/modern-recipe')
    } catch (error) {
      console.error('Error scraping recipe:', error)
      toast.error('An error occurred while scraping the recipe.')
    } finally {
      setIsLoading(false)
      setRecipeUrl('')
    }
  }

  const handleLogin = () => {
    console.log('Login button clicked')
    // For now, we'll use placeholder values. In a real app, you'd get these from a login form.
    login('user@example.com', 'password')
  }

  return (
    <div className="bg-white min-h-screen text-gray-800 font-sans">
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-12">
        <nav className="flex justify-end mb-8">
          <Button
            onClick={handleLogin}
            variant="outline"
            className="text-[#1A2530] border-[#1A2530] hover:bg-[#1A2530] hover:text-white transition-colors duration-200 rounded-full px-6 py-2"
          >
            Login
          </Button>
        </nav>
        
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-[#1A2530] mb-2">RecipeCleaner</h1>
          <p className="text-xl text-gray-600">Simplify Your Cooking Experience</p>
        </header>

        <form onSubmit={handleSubmitRecipe} className="mb-16">
          <div className="flex items-center max-w-3xl mx-auto">
            <Input
              type="url"
              placeholder="Paste your recipe URL here..."
              value={recipeUrl}
              onChange={(e) => setRecipeUrl(e.target.value)}
              className="flex-grow text-lg rounded-full border-gray-300 focus:ring-2 focus:ring-[#1A2530] focus:border-transparent pr-32"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              className="absolute right-0 bg-[#1A2530] hover:bg-[#2C3E50] text-white rounded-full px-6 py-2 mr-2"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Clean Recipe'}
            </Button>
          </div>
        </form>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-[#1A2530] mb-8 text-center">Our AI Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aiTools.map((tool) => (
              <Card key={tool.id} className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-gray-100 rounded-full">
                    {tool.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{tool.title}</h3>
                  <p className="text-sm text-gray-600">{tool.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <FAQ />
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  )
}