// src/components/AIChat/ModificationPreview.tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import type { Recipe } from '@/types/recipe';

interface ModificationPreviewProps {
  originalRecipe: Recipe;
  modifiedRecipe: Recipe;
  onApply: () => void;
  onReject: () => void;
}

export function ModificationPreview({
  originalRecipe,
  modifiedRecipe,
  onApply,
  onReject
}: ModificationPreviewProps) {
  return (
    <Alert className="mx-4 mb-4">
      <AlertTitle>Proposed Changes</AlertTitle>
      <AlertDescription>
        <div className="space-y-2">
          {modifiedRecipe.ingredients.map((ing, i) => {
            const oldIng = originalRecipe.ingredients[i];
            if (oldIng && (oldIng.amount !== ing.amount || oldIng.unit !== ing.unit)) {
              return (
                <div key={i} className="text-sm">
                  <div className="line-through text-muted-foreground">
                    {oldIng.amount} {oldIng.unit} {oldIng.name}
                  </div>
                  <div className="text-green-600">
                    → {ing.amount} {ing.unit} {ing.name}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <Button
            onClick={onReject}
            variant="outline"
            size="sm"
            className="text-destructive hover:bg-destructive/10"
          >
            <X className="h-4 w-4 mr-1" />
            Reject
          </Button>
          <Button
            onClick={onApply}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="h-4 w-4 mr-1" />
            Apply Changes
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}