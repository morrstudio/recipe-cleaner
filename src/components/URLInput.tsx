import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface URLInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export default function URLInput({ onSubmit, isLoading }: URLInputProps) {
  const [recipeUrl, setRecipeUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (recipeUrl.trim() === '') return;
    onSubmit(recipeUrl);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-16">
      <div className="flex items-center max-w-2xl mx-auto">
        <Input
          type="url"
          placeholder="Paste your recipe URL here..."
          value={recipeUrl}
          onChange={(e) => setRecipeUrl(e.target.value)}
          className="flex-grow text-lg rounded-l-full rounded-r-none border-r-0 focus:ring-0 focus:border-gray-300"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          className="bg-[#1A2530] hover:bg-[#2C3E50] text-white rounded-r-full rounded-l-none"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Clean Recipe
            </>
          )}
        </Button>
      </div>
    </form>
  );
}