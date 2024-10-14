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
        <Button onClick={handleProfile} variant="outline" className="text-[#1A2530] border-[#1A2530] hover:bg-[#1A2530] hover:text-white transition-colors duration-200 px-6 py-2 rounded-full">
          <User className="mr-2 h-5 w-5" />
          Profile
        </Button>
      ) : (
        <Button onClick={handleLogin} variant="outline" className="text-[#1A2530] border-[#1A2530] hover:bg-[#1A2530] hover:text-white transition-colors duration-200 px-6 py-2 rounded-full">
          <LogIn className="mr-2 h-5 w-5" />
          Login
        </Button>
      )}
    </nav>
  )
}