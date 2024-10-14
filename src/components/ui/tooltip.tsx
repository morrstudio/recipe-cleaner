import React, { useState } from 'react';

export const Tooltip = ({ children, content }: { children: React.ReactNode; content: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="tooltip-container" 
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && <div className="tooltip-content">{content}</div>}
    </div>
  );
};

export const TooltipProvider = ({ children }: { children: React.ReactNode }) => (
  <div className="tooltip-provider">{children}</div>
);

export const TooltipTrigger = ({ children }: { children: React.ReactNode }) => (
  <div className="tooltip-trigger">{children}</div>
);

export const TooltipContent = ({ children }: { children: React.ReactNode }) => (
  <div className="tooltip-content">{children}</div>
);