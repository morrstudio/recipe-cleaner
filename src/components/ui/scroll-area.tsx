import React from 'react';

interface ScrollAreaProps {
  children: React.ReactNode;
  className?: string;
}

export const ScrollArea: React.FC<ScrollAreaProps> = ({ children, className = '' }) => (
  <div className={`scroll-area ${className}`} style={{ overflowY: 'auto', maxHeight: '100%' }}>
    {children}
  </div>
);