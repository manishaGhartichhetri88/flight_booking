import React from 'react';
import { render, screen } from '@testing-library/react';
import Loader from './index';

describe('Loader', () => {
  it('renders a spinning loader element', () => {
    render(React.createElement(Loader, null));
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('includes accessible loading text', () => {
    render(React.createElement(Loader, null));
    expect(screen.getByRole('status')).toHaveAccessibleName(/loading/i);
  });
});
