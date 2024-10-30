// src/components/AIChat/ChatMessage.tsx
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: {
    role: 'user' | 'assistant' | 'system';
    content: string;
  };
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex",
        message.role === 'user' ? "justify-end" : "justify-start",
        message.role === 'system' && "justify-center"
      )}
    >
      <div
        className={cn(
          "rounded-lg px-4 py-2 max-w-[80%]",
          message.role === 'user' && "bg-primary text-primary-foreground",
          message.role === 'assistant' && "bg-muted",
          message.role === 'system' && "bg-accent text-accent-foreground text-sm"
        )}
      >
        {message.content}
      </div>
    </div>
  );
}