import React from 'react';
import { render, screen } from '@testing-library/react';

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

import SearchBox from './index';

describe('SearchBox', () => {
  it('renders input fields with placeholders', () => {
    render(<SearchBox />);

    expect(screen.getByPlaceholderText('New York')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Los Angeles')).toBeInTheDocument();
  });

  it('renders the search flights link', () => {
    render(<SearchBox />);

    expect(screen.getByRole('link', { name: /Search flights/i })).toHaveAttribute('href', '/flights');
  });

  it('renders the quick search panel text', () => {
    render(<SearchBox />);

    expect(screen.getByText(/Find the best route in seconds/i)).toBeInTheDocument();
  });
});