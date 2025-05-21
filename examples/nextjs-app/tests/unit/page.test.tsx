import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

// Mock the components that Home depends on
jest.mock('@/components/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle-mock">Theme Toggle</div>,
}));

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      pathname: '/',
    };
  },
}));

describe('Home Page', () => {
  it('renders the heading', () => {
    render(<Home />);

    const heading = screen.getByRole('heading', { name: /NextJS App with Firebase/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders the theme toggle section', () => {
    render(<Home />);

    const toggleSection = screen.getByText(/Toggle between light and dark mode/i);
    expect(toggleSection).toBeInTheDocument();
    expect(screen.getByTestId('theme-toggle-mock')).toBeInTheDocument();
  });

  it('renders documentation links', () => {
    render(<Home />);

    const nextjsLink = screen.getByRole('link', { name: /NextJS Docs/i });
    const firebaseLink = screen.getByRole('link', { name: /Firebase Docs/i });

    expect(nextjsLink).toBeInTheDocument();
    expect(firebaseLink).toBeInTheDocument();

    expect(nextjsLink).toHaveAttribute('href', 'https://nextjs.org/docs');
    expect(firebaseLink).toHaveAttribute('href', 'https://firebase.google.com/docs');
  });
});
