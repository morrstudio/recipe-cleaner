import Link from 'next/link'
import { Home } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
  return (
    <div className="bg-gradient-to-b from-[#F9F5F2] to-white min-h-screen flex items-center justify-center text-gray-800 font-sans">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#1A2530] mb-4">404</h1>
        <p className="text-xl mb-8">Oops! The page you're looking for doesn't exist.</p>
        <Link href="/" passHref>
          <Button className="bg-[#1A2530] hover:bg-[#2C3E50] text-white transition-colors duration-200">
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
