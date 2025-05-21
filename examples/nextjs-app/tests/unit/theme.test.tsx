import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from 'next-themes';

// Mock the useTheme hook properly
jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

describe('ThemeToggle', () => {
  it('renders the theme toggle button', () => {
    // Mock implementation for this test
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: jest.fn(),
    });

    render(<ThemeToggle />);

    // Check if the button is in the document
    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('🌙 Dark Mode');
  });

  it('toggles the theme when clicked', () => {
    // Mock for this test with a setTheme spy
    const setThemeMock = jest.fn();
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: setThemeMock,
    });

    render(<ThemeToggle />);

    // Find and click the button
    const button = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(button);

    // Check if setTheme was called with 'dark'
    expect(setThemeMock).toHaveBeenCalledWith('dark');
  });

  it('displays the correct text for dark theme', () => {
    // Mock for dark theme
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme: jest.fn(),
    });

    render(<ThemeToggle />);

    // Check for light mode text
    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('🌞 Light Mode');
  });
});
