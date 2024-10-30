// src/components/ui/use-toast.tsx
import * as React from "react"
import { Toast, ToastProvider, ToastViewport } from "./toast"

interface ToastProps {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

const ToastContext = React.createContext<{
  toast: (props: ToastProps) => void
}>({
  toast: () => null,
})

export function ToastWrapper({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const toast = React.useCallback((props: ToastProps) => {
    setToasts((prev) => [...prev, props])
    setTimeout(() => {
      setToasts((prev) => prev.slice(1))
    }, 5000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastProvider>
        {children}
        {toasts.map((t, i) => (
          <Toast key={i} {...t} />
        ))}
        <ToastViewport />
      </ToastProvider>
    </ToastContext.Provider>
  )
}

export const useToast = () => React.useContext(ToastContext)