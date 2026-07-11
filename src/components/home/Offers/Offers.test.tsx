import React from 'react';
import { render, screen } from '@testing-library/react';
import Offers from './index';

describe('Offers', () => {
  it('renders offer headings and discount badge', () => {
    render(React.createElement(Offers, null));
    expect(screen.getByText(/Limited-time offers/)).toBeInTheDocument();
    expect(screen.getByText(/Up to 30% off/)).toBeInTheDocument();
    expect(screen.getByText(/New York → LAX/)).toBeInTheDocument();
  });

  it('renders all featured route offers with prices', () => {
    render(React.createElement(Offers, null));
    expect(screen.getByText(/London → Dubai/)).toBeInTheDocument();
    expect(screen.getByText(/Paris → Tokyo/)).toBeInTheDocument();
    expect(screen.getAllByText(/From Rs/)).toHaveLength(3);
  });
});
