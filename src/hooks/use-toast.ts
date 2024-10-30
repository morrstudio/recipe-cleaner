// src/hooks/use-toast.ts
import { useState } from "react";

type ToastType = "default" | "success" | "error" | "warning";

interface Toast {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, "id">) => {
    setToasts((current) => [
      ...current,
      { ...toast, id: crypto.randomUUID() },
    ]);
  };

  const removeToast = (id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  return {
    toasts,
    toast: addToast,
    removeToast,
  };
}