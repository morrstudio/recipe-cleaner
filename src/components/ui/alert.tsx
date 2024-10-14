import React from 'react';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success';
}

export const Alert: React.FC<AlertProps> = ({ children, variant = 'default' }) => (
  <div className={`alert alert-${variant}`}>{children}</div>
);

export const AlertTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h5 className="alert-title">{children}</h5>
);

export const AlertDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="alert-description">{children}</div>
);