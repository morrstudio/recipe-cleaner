import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../pages/index';

// Mock the dependencies
jest.mock('next/router', () => require('next-router-mock'));
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
  ToastContainer: () => null,
}));
jest.mock('@/lib/api', () => ({
  scrapeRecipe: jest.fn(),
}));

// Mock the UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));
jest.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input {...props} />,
}));
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));
jest.mock('@/components/ui/accordion', () => ({
  Accordion: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  AccordionItem: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  AccordionTrigger: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  AccordionContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

describe('Home', () => {
  it('renders the main heading', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', { name: /RecipeCleaner/i });
    expect(heading).toBeInTheDocument();
  });

  it('displays the recipe URL input', () => {
    render(<Home />);
    const input = screen.getByPlaceholderText(/Paste your recipe URL here/i);
    expect(input).toBeInTheDocument();
  });

  it('shows the "Clean Recipe" button', () => {
    render(<Home />);
    const button = screen.getByRole('button', { name: /Clean Recipe/i });
    expect(button).toBeInTheDocument();
  });

  it('displays AI tools section', () => {
    render(<Home />);
    const aiToolsHeading = screen.getByRole('heading', { name: /Our AI Tools/i });
    expect(aiToolsHeading).toBeInTheDocument();
  });

  it('shows FAQ section', () => {
    render(<Home />);
    const faqHeading = screen.getByRole('heading', { name: /Frequently Asked Questions/i });
    expect(faqHeading).toBeInTheDocument();
  });

  it('displays login button when not logged in', () => {
    render(<Home />);
    const loginButton = screen.getByRole('button', { name: /Login/i });
    expect(loginButton).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    const mockScrapeRecipe = jest.fn().mockResolvedValue({ _id: '123' });
    jest.spyOn(require('@/lib/api'), 'scrapeRecipe').mockImplementation(mockScrapeRecipe);

    render(<Home />);
    const input = screen.getByPlaceholderText(/Paste your recipe URL here/i);
    const submitButton = screen.getByRole('button', { name: /Clean Recipe/i });

    fireEvent.change(input, { target: { value: 'https://example.com/recipe' } });
    fireEvent.click(submitButton);

    expect(mockScrapeRecipe).toHaveBeenCalledWith('https://example.com/recipe');
  });
});
