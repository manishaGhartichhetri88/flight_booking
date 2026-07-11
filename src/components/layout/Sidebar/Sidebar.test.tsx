import React from 'react';
import { render, screen } from '@testing-library/react';
import Sidebar from './index';

describe('Sidebar', () => {
  it('renders the sidebar heading', () => {
    render(<Sidebar />);

    expect(screen.getByText('Quick links')).toBeInTheDocument();
  });

  it('renders the sidebar link items', () => {
    render(<Sidebar />);

    expect(screen.getByText('Search flights')).toBeInTheDocument();
    expect(screen.getByText('Recent bookings')).toBeInTheDocument();
    expect(screen.getByText('Travel alerts')).toBeInTheDocument();
  });
});