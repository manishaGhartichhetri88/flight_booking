import React from 'react';
import { render, screen } from '@testing-library/react';
import Badge from './index';

describe('Badge', () => {
  it('renders children content', () => {
    render(React.createElement(Badge, null, 'New'));
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('applies expected styling class', () => {
    render(React.createElement(Badge, null, 'Hot'));
    expect(screen.getByText('Hot')).toHaveClass('rounded-full');
  });
});
