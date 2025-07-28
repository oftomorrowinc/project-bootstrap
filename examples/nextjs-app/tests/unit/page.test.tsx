import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

// Mock the components that Home depends on
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => (
    <button data-testid="shadcn-button-mock" {...props}>
      {children}
    </button>
  ),
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

  it('renders the ShadCN button section', () => {
    render(<Home />);

    const buttonSection = screen.getByText(/Try the ShadCN UI button/i);
    expect(buttonSection).toBeInTheDocument();
    expect(screen.getByTestId('shadcn-button-mock')).toBeInTheDocument();
    expect(screen.getByText('Click Me!')).toBeInTheDocument();
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
