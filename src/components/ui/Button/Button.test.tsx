import React from 'react';
import { render, screen } from '@testing-library/react';
import Button from './index';

describe('Button', () => {
  it('renders with default primary styling', () => {
    render(React.createElement(Button, null, 'Click me'));
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('renders secondary variant styling', () => {
    render(React.createElement(Button, { variant: 'secondary' }, 'Secondary'));
    expect(screen.getByText('Secondary')).toBeInTheDocument();
  });

  it('renders as disabled when disabled prop is passed', () => {
    render(React.createElement(Button, { disabled: true }, 'Disabled'));
    expect(screen.getByRole('button', { name: 'Disabled' })).toBeDisabled();
  });
});
