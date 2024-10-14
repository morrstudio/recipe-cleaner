import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { chatWithAI } from '@/lib/api'

interface AIChatProps {
  recipeId: string;
  onRecipeUpdate: () => void;
}

export default function AIChat({ recipeId, onRecipeUpdate }: AIChatProps) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([])
  const [input, setInput] = useState('')
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: 'user' as const, content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')

    try {
      const response = await chatWithAI(input, recipeId)
      const aiMessage = { role: 'assistant' as const, content: response }
      setMessages(prev => [...prev, aiMessage])
      if (response.includes('updated the recipe')) {
        onRecipeUpdate()
      }
    } catch (error) {
      console.error('AI chat error:', error)
      const errorMessage = { role: 'assistant' as const, content: 'Sorry, I encountered an error. Please try again.' }
      setMessages(prev => [...prev, errorMessage])
    }
  }

  return (
    <div className="h-96 flex flex-col">
      <ScrollArea className="flex-grow mb-4" ref={scrollAreaRef}>
        {messages.map((message, index) => (
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
          placeholder="Ask the AI assistant..."
          className="flex-grow"
        />
        <Button type="submit">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  )
}