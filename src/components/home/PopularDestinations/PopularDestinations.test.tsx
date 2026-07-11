import React from 'react';
import { render, screen } from '@testing-library/react';
import PopularDestinations from './index';

describe('PopularDestinations', () => {
  it('renders the destination list and titles', () => {
    render(React.createElement(PopularDestinations, null));
    expect(screen.getByText(/Popular destinations/)).toBeInTheDocument();
    expect(screen.getByText('New York')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
  });

  it('renders the updated daily badge and all destination cards', () => {
    render(React.createElement(PopularDestinations, null));
    expect(screen.getByText(/Updated daily/)).toBeInTheDocument();
    expect(screen.getAllByText(/Best deals this week/)).toHaveLength(6);
  });
});
