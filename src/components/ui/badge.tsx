import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default' }) => (
  <span className={`badge badge-${variant}`}>{children}</span>
);