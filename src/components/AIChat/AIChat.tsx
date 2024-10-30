import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Check, X, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Recipe } from '@/types/recipe';
import { useToast } from "@/components/ui/use-toast"
import { APIError } from '@/lib/api-error'

interface AIChatProps {
  recipe: Recipe;
  onRecipeUpdate: (recipe: Recipe) => void;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface PendingChange {
  type: 'ingredient' | 'instruction';
  original: string;
  proposed: string;
}

export default function AIChat({ recipe, onRecipeUpdate, onClose }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<PendingChange[] | null>(null);
  const [proposedRecipe, setProposedRecipe] = useState<Recipe | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast()

  useEffect(() => {
    // Initial welcome message
    setMessages([{
      id: crypto.randomUUID(),
      role: 'assistant',
      content: 'Hi! I can help modify this recipe, adjust ingredients, or answer cooking questions. For example, try asking me to:\n\n• Make it vegetarian\n• Adjust for allergies\n• Suggest ingredient substitutions\n• Explain cooking techniques'
    }]);
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const findRecipeChanges = (original: Recipe, proposed: Recipe): PendingChange[] => {
    const changes: PendingChange[] = [];

    // Check ingredients
    proposed.ingredients.forEach((newIng) => {
      const oldIng = original.ingredients.find(ing => ing.name === newIng.name);
      if (!oldIng || oldIng.amount !== newIng.amount || oldIng.unit !== newIng.unit) {
        changes.push({
          type: 'ingredient',
          original: oldIng ? `${oldIng.amount} ${oldIng.unit} ${oldIng.name}` : '',
          proposed: `${newIng.amount} ${newIng.unit} ${newIng.name}`
        });
      }
    });

    // Check instructions
    proposed.instructions.forEach((inst, i) => {
      if (inst !== original.instructions[i]) {
        changes.push({
          type: 'instruction',
          original: original.instructions[i] || '',
          proposed: inst
        });
      }
    });

    return changes;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          recipe: recipe
        }),
      });

      if (!response.ok) {
        throw new APIError(
          response.status,
          'Failed to get AI response'
        );
      }

      const data = await response.json();
      
      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.message
      };
      setMessages(prev => [...prev, aiMessage]);

      if (data.updatedRecipe) {
        setProposedRecipe(data.updatedRecipe);
        setPendingChanges(findRecipeChanges(recipe, data.updatedRecipe));
      }
    } catch (err) {
      console.error('Chat error:', err);
      toast({
        title: "Error",
        description: err instanceof APIError ? err.message : 'Failed to process request',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyChanges = () => {
    if (!proposedRecipe) return;
    
    onRecipeUpdate(proposedRecipe);
    setPendingChanges(null);
    setProposedRecipe(null);
    
    setMessages(prev => [...prev, {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '✨ Changes applied successfully! How else can I help?'
    }]);
  };

  const handleRejectChanges = () => {
    setPendingChanges(null);
    setProposedRecipe(null);
    
    setMessages(prev => [...prev, {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: 'Changes rejected. How else can I help?'
    }]);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center">
          <Bot className="mr-2 h-5 w-5" />
          AI Cooking Assistant
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex-grow p-4 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-2",
                    message.role === 'user' 
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="h-2 w-2 bg-current rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      {pendingChanges && pendingChanges.length > 0 && (
        <Alert className="mx-4 mb-4">
          <AlertTitle>Proposed Changes:</AlertTitle>
          <AlertDescription>
            <div className="space-y-2 mb-4">
              {pendingChanges.map((change, index) => (
                <div key={index} className="text-sm">
                  {change.original && (
                    <div className="line-through text-muted-foreground">
                      {change.original}
                    </div>
                  )}
                  <div className="text-green-600">
                    {change.original ? '→ ' : '+ '}{change.proposed}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                onClick={handleRejectChanges}
                variant="outline"
                size="sm"
                className="text-destructive hover:bg-destructive/10"
              >
                <X className="h-4 w-4 mr-1" />
                Reject
              </Button>
              <Button
                onClick={handleApplyChanges}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4 mr-1" />
                Apply Changes
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <CardFooter className="p-4 pt-0">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about the recipe or request modifications..."
              disabled={isLoading}
              className="flex-grow"
            />
            <Button type="submit" disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
}