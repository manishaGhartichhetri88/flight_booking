import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Select from './index';

describe('Select', () => {
  it('renders select element with options', () => {
    render(
      React.createElement(Select, { 'aria-label': 'Destinations' },
        React.createElement('option', { value: 'nyc' }, 'New York'),
        React.createElement('option', { value: 'lax' }, 'Los Angeles')
      )
    );

    expect(screen.getByLabelText('Destinations')).toBeInTheDocument();
    expect(screen.getByText('New York')).toBeInTheDocument();
  });

  it('fires onChange event when value changes', () => {
    const handleChange = vi.fn();
    render(
      React.createElement(Select, { 'aria-label': 'Destinations', onChange: handleChange },
        React.createElement('option', { value: 'nyc' }, 'New York'),
        React.createElement('option', { value: 'lax' }, 'Los Angeles')
      )
    );

    fireEvent.change(screen.getByLabelText('Destinations'), { target: { value: 'lax' } });
    expect(handleChange).toHaveBeenCalled();
  });
});
