import { useState } from 'react'
import { useRouter } from 'next/router'
import { Sparkles, Bot, ChefHat, BookOpen } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  PageHeader,
  PageHeaderHeading,
  PageHeaderDescription,
} from "@/components/ui/page-header"
import { Container } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { extractRecipe } from '@/lib/recipeExtractor'
import { toast } from 'react-toastify'

const features = [
  {
    icon: <ChefHat className="h-6 w-6" />,
    title: "Clear Instructions",
    description: "Transform cluttered recipes into step-by-step instructions"
  },
  {
    icon: <Bot className="h-6 w-6" />,
    title: "AI Assistant",
    description: "Get help modifying recipes for dietary needs and preferences"
  },
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "Smart Conversion",
    description: "Automatically adjust servings and convert measurements"
  }
]

export default function HomePage() {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic URL validation
    if (!url.trim()) {
      toast.error('Please enter a recipe URL')
      return
    }

    try {
      new URL(url)
    } catch {
      toast.error('Please enter a valid URL')
      return
    }

    setIsLoading(true)
    
    try {
      // Show loading toast
      const loadingToast = toast.loading('Extracting recipe...')
      
      const recipe = await extractRecipe(url)
      
      // Store the recipe in localStorage
      localStorage.setItem('scrapedRecipe', JSON.stringify(recipe))
      
      // Update loading toast to success
      toast.update(loadingToast, {
        render: 'Recipe extracted successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 2000
      })
      
      // Navigate to recipe page
      router.push('/recipe/view')
    } catch (error) {
      console.error('Failed to extract recipe:', error)
      toast.error('Failed to extract recipe. Please try another URL.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Container>
        <div className="py-20 text-center space-y-12">
          {/* Hero Section */}
          <PageHeader>
            <PageHeaderHeading className="text-4xl md:text-6xl">
              Clean Recipes, Better Cooking
            </PageHeaderHeading>
            <PageHeaderDescription className="text-xl text-muted-foreground max-w-[700px] mx-auto mt-4">
              Transform any recipe into a clear, easy-to-follow format with smart features and AI assistance.
            </PageHeaderDescription>
          </PageHeader>

          {/* URL Input Form */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste any recipe URL..."
                disabled={isLoading}
                className="h-12 text-lg"
              />
              <Button 
                type="submit" 
                size="lg"
                disabled={isLoading}
                className="min-w-[140px]"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
                    <span>Loading</span>
                  </div>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Clean Recipe
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
            {features.map((feature, index) => (
              <Card key={index} className="relative overflow-hidden border-2">
                <CardContent className="pt-6 pb-8 px-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Example URLs */}
          <div className="text-center space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Try it with these example recipes:</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                'allrecipes.com/recipe/10813/best-chocolate-chip-cookies',
                'foodnetwork.com/recipes/alton-brown/guacamole-recipe-1940609',
                'bonappetit.com/recipe/classic-potato-salad'
              ].map((example, index) => (
                <Badge 
                  key={index}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => setUrl(`https://www.${example}`)}
                >
                  {example.split('/')[0]}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}