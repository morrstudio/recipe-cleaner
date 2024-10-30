import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-4 border-muted animate-pulse">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="h-8 w-8 rounded-full border-t-4 border-primary animate-spin" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function ErrorDisplay({ 
  error, 
  resetError 
}: { 
  error: Error
  resetError: () => void 
}) {
  return (
    <Alert variant="destructive" className="m-4">
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription>
        {error.message}
        <Button 
          variant="outline" 
          onClick={resetError}
          className="mt-2"
        >
          Try Again
        </Button>
      </AlertDescription>
    </Alert>
  )
}

export function LoadingCard() {
  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
        <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
        <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
      </div>
    </Card>
  )
}