// src/pages/index.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Recipe } from '@/types/recipe';
import { URLInput } from '@/components/URLInput';
import { useToast } from '@/components/ui/use-toast';

export default function HomePage() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (url: string) => {
    try {
      const response = await fetch('/api/scrape-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (!response.ok) throw new Error('Failed to extract recipe');

      const data = await response.json();
      setRecipe(data.recipe);
      localStorage.setItem('scrapedRecipe', JSON.stringify(data.recipe));
      
      toast({
        title: "Success!",
        description: "Recipe extracted successfully"
      });

      router.push('/recipe/view');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to extract recipe",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container max-w-4xl py-12">
      <URLInput onSubmit={handleSubmit} />
      {/* Rest of your homepage content */}
    </div>
  );
}