import React, { useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Recipe } from '@/types/recipe'

interface AIChatProps {
  recipeId: string;
  onRecipeUpdate: (updatedRecipe: Recipe) => void;
}

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

export default function AIChat({ recipeId, onRecipeUpdate }: AIChatProps) {
  const [input, setInput] = useState('')
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    setIsLoading(true)
    const userMessage: ChatMessage = { role: 'user', content: input }
    setChatHistory(prev => [...prev, userMessage])

    try {
      console.log('Sending request to API...')
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input, recipeId }),
      })
      console.log('Response status:', response.status)

      const data = await response.json()
      console.log('Response data:', data)

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      if (data.updatedRecipe) {
        onRecipeUpdate(data.updatedRecipe);
      }

      const aiMessage: ChatMessage = { role: 'ai', content: data.message }
      setChatHistory(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Detailed error:', error)
      const errorMessage: ChatMessage = { 
        role: 'ai', 
        content: error instanceof Error ? error.message : 'Sorry, there was an error processing your request.' 
      }
      setChatHistory(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setInput('')
    }
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-grow mb-4">
        {chatHistory.map((message, index) => (
          <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              {message.content}
            </span>
          </div>
        ))}
      </ScrollArea>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the recipe..."
          disabled={isLoading}
          className="flex-grow"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  )
}
