import React from 'react';
import { render, screen } from '@testing-library/react';
import Hero from './index';

describe('Hero', () => {
  it('renders headline and feature cards', () => {
    render(<Hero />);

    expect(screen.getByRole('heading', { name: /Find the best flights with confidence/i })).toBeInTheDocument();
    expect(screen.getByText('Easy booking')).toBeInTheDocument();
    expect(screen.getByText('Secure checkout')).toBeInTheDocument();
  });

  it('renders top destination and featured route panels', () => {
    render(<Hero />);

    expect(screen.getByText(/Los Angeles, USA/i)).toBeInTheDocument();
    expect(screen.getByText(/NYC → LAX/i)).toBeInTheDocument();
  });

  it('renders the hero card offers on the left side', () => {
    render(<Hero />);

    expect(screen.getByText('Easy booking')).toBeInTheDocument();
    expect(screen.getByText('Secure checkout')).toBeInTheDocument();
  });
});