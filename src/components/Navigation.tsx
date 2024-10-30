import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/router'
import { Button } from "@/components/ui/button"
import { User, LogIn } from 'lucide-react'

export default function Navigation() {
  const { isAuthenticated, login, logout } = useAuth()
  const router = useRouter()

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password') // Replace with actual login logic
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const handleProfile = () => {
    router.push('/profile')
  }

  return (
    <nav className="flex justify-end mb-8">
      {isAuthenticated ? (
        <Button 
          onClick={handleProfile} 
          variant="outline" 
          size="lg"
          className="hover:bg-primary hover:text-primary-foreground"
        >
          <User className="mr-2 h-4 w-4" />
          Profile
        </Button>
      ) : (
        <Button 
          onClick={handleLogin} 
          variant="outline"
          size="lg"
          className="hover:bg-primary hover:text-primary-foreground"
        >
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </Button>
      )}
    </nav>
  )
}