import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from './index';

const mockPush = vi.fn();
let mockedPathname = '/';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => mockedPathname,
}));

vi.mock('@/components/layout/Avatar', () => ({
  __esModule: true,
  default: ({ name }: { name?: string }) => ({
    $$typeof: Symbol.for('react.element'),
    type: 'div',
    key: null,
    ref: null,
    props: { 'data-testid': 'avatar', children: name },
  }),
}));

describe('Navbar', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders navigation links and sign in button when not authenticated', () => {
    render(React.createElement(Navbar, null));

    expect(screen.getByText('FlightBook')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Flights')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('renders avatar when user is stored in localStorage', async () => {
    localStorage.setItem('me', JSON.stringify({ name: 'Alice', email: 'alice@example.com' }));

    render(React.createElement(Navbar, null));

    expect(await screen.findByTestId('avatar')).toHaveTextContent('Alice');
  });

  it('does not render on admin routes', () => {
    mockedPathname = '/admin/dashboard';
    render(React.createElement(Navbar, null));

    expect(screen.queryByText('FlightBook')).not.toBeInTheDocument();
  });
});
