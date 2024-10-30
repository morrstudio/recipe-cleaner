import React from 'react'
import { cn } from "@/lib/utils"

interface LayoutProps {
  children: React.ReactNode
  className?: string
}

export default function Layout({ children, className }: LayoutProps) {
  return (
    <main
      className={cn(
        "relative min-h-screen flex flex-col antialiased",
        "bg-background/95 bg-gradient-to-b from-muted/50 to-background",
        className
      )}
    >
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </main>
  )
}
