// src/components/URLInput/index.tsx
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface URLInputProps {
  onSubmit: (url: string) => Promise<void>;
  className?: string;
}

export function URLInput({ onSubmit, className }: URLInputProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!url.trim()) {
      setError('Please enter a recipe URL');
      return;
    }

    try {
      new URL(url); // Validate URL format
      setIsLoading(true);
      await onSubmit(url);
      setUrl(''); // Clear input on success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid URL format');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <Input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste your recipe URL here..."
          disabled={isLoading}
          className={cn(
            "flex-1",
            error && "border-destructive"
          )}
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="min-w-[140px]"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2" />
              Loading...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
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
  );
}