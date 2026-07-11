import React from 'react';
import { render, screen } from '@testing-library/react';
import MobileMenu from './index';

describe('MobileMenu', () => {
  it('renders the mobile menu header', () => {
    render(<MobileMenu />);

    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('renders menu items for mobile navigation', () => {
    render(<MobileMenu />);

    expect(screen.getByText('Flights')).toBeInTheDocument();
    expect(screen.getByText('Bookings')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });
});