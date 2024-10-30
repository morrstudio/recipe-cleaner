// src/components/URLInput.tsx
import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading"
import { cn } from "@/lib/utils"

interface URLInputProps {
  onSubmit: (url: string) => Promise<void>
  className?: string
}

export function URLInput({ onSubmit, className }: URLInputProps) {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Basic URL validation
    if (!url.trim()) {
      setError('Please enter a recipe URL')
      return
    }

    try {
      new URL(url) // Validate URL format
      setIsLoading(true)
      await onSubmit(url)
      setUrl('') // Clear input on success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid URL format')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste your recipe URL here..."
            disabled={isLoading}
            className={cn(
              "w-full text-lg",
              error && "border-destructive",
              isLoading && "opacity-50"
            )}
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="h-12 px-6"
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Clean Recipe
            </>
          )}
        </Button>
      </form>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}