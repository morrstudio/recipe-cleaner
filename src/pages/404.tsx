import Link from 'next/link'
import { Home } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { cn } from "@/lib/utils"

export default function NotFoundPage() {
  return (
    <Container 
      className={cn(
        "min-h-screen flex items-center justify-center",
        "bg-gradient-to-b from-muted/50 to-background"
      )}
    >
      <div className="text-center space-y-6">
        <h1 className="text-7xl font-bold tracking-tighter">404</h1>
        <p className="text-xl text-muted-foreground">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link href="/" passHref>
          <Button size="lg" variant="default">
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
        </Link>
      </div>
    </Container>
  )
}
