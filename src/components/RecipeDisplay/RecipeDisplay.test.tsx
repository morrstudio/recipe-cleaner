// src/components/RecipeDisplay/RecipeDisplay.test.tsx
import { render, screen, fireEvent } from '@/utils/test-utils';
import { RecipeDisplay } from './index';
import { mockRecipe } from '@/utils/test-utils';

describe('RecipeDisplay', () => {
  it('renders recipe title', () => {
    render(<RecipeDisplay recipe={mockRecipe} />);
    expect(screen.getByText(mockRecipe.title)).toBeInTheDocument();
  });

  it('handles servings adjustment locally', () => {
    render(<RecipeDisplay recipe={mockRecipe} />);
    const increaseButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(increaseButton);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('calls onServingsChange when provided', () => {
    const onServingsChange = jest.fn();
    render(<RecipeDisplay recipe={mockRecipe} onServingsChange={onServingsChange} />);
    const increaseButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(increaseButton);
    expect(onServingsChange).toHaveBeenCalledWith(5);
  });

  it('shows AI chat button when onOpenAIChat is provided', () => {
    const onOpenAIChat = jest.fn();
    render(<RecipeDisplay recipe={mockRecipe} onOpenAIChat={onOpenAIChat} />);
    const aiButton = screen.getByText(/ask ai assistant/i);
    expect(aiButton).toBeInTheDocument();
    fireEvent.click(aiButton);
    expect(onOpenAIChat).toHaveBeenCalled();
  });
});