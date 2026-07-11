import React from 'react';
import { render, screen } from '@testing-library/react';

let mockedPathname = '/';
vi.mock('next/navigation', () => ({
  usePathname: () => mockedPathname,
}));

import Footer from './index';

describe('Footer', () => {
  beforeEach(() => {
    mockedPathname = '/';
  });

  it('renders footer content on non-admin routes', () => {
    render(React.createElement(Footer, null));
    expect(screen.getByText(/© 2026 Flight Booking/)).toBeInTheDocument();
    expect(screen.getByText(/Built for fast search and easy booking/)).toBeInTheDocument();
  });

  it('hides the footer on admin pages', () => {
    mockedPathname = '/admin/dashboard';
    render(React.createElement(Footer, null));
    expect(screen.queryByText(/© 2026 Flight Booking/)).not.toBeInTheDocument();
  });

  it('renders the footer on general non-admin paths', () => {
    mockedPathname = '/about';
    render(React.createElement(Footer, null));
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
