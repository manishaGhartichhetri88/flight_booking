import React from 'react';
import { render, screen } from '@testing-library/react';
import Testimonials from './index';

describe('Testimonials', () => {
  it('renders testimonials and summary text', () => {
    render(React.createElement(Testimonials, null));
    expect(screen.getByText(/What travelers say/)).toBeInTheDocument();
    expect(screen.getByText(/Mia Chen/)).toBeInTheDocument();
    expect(screen.getByText(/Carlos Rivera/)).toBeInTheDocument();
  });

  it('renders both testimonial quotes and author titles', () => {
    render(React.createElement(Testimonials, null));
    expect(screen.getByText(/Booking my family trip was simple and fast/i)).toBeInTheDocument();
    expect(screen.getByText(/Frequent flyer/i)).toBeInTheDocument();
  });
});
