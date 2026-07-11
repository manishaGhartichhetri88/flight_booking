import React from 'react';
import { render, screen } from '@testing-library/react';
import Card from './index';

describe('Card', () => {
  it('renders title and description', () => {
    render(
      React.createElement(Card, { title: 'Hello', description: 'World' }, 'Content')
    );
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('World')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('uses default styling when variant is default', () => {
    render(
      React.createElement(Card, { title: 'Test', variant: 'default' }, 'Test')
    );
    expect(screen.getByRole('heading', { name: 'Test' })).toBeInTheDocument();
  });

  it('applies custom className to the card container', () => {
    const { container } = render(
      React.createElement(Card, { title: 'Custom', description: 'Description', className: 'custom-class' }, 'Content')
    );
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });
});
