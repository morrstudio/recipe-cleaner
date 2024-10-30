import React from "react";
import { cn } from "../../lib/utils";

export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("container mx-auto px-4", className)}>
      {children}
    </div>
  );
}
