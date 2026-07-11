import React from 'react';
import { render, screen } from '@testing-library/react';
import FlightList from './index';
import { flights } from '@/lib/flights';

describe('FlightList', () => {
  it('renders a card for each flight in the data source', () => {
    render(React.createElement(FlightList, null));

    flights.forEach((flight) => {
      const airlineNodes = screen.getAllByText(flight.airline);
      expect(airlineNodes.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('renders the correct number of flight cards', () => {
    render(React.createElement(FlightList, null));
    expect(screen.getAllByRole('link')).toHaveLength(flights.length);
  });
});
