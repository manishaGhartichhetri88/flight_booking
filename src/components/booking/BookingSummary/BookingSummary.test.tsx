import React from 'react';
import { render, screen } from '@testing-library/react';
import BookingSummary from './index';

const flight = {
  id: 'f1',
  airline: 'Skyway Airlines',
  flightNumber: 'SKY 487',
  boardingTime: '07:15',
  from: 'New York (JFK)',
  to: 'Los Angeles (LAX)',
  departure: 'May 18, 2026 · 08:00',
  price: 'Rs 299',
};

describe('BookingSummary', () => {
  it('renders pending state when no flight is provided', () => {
    render(React.createElement(BookingSummary, null));
    expect(screen.getByText('Select a flight')).toBeInTheDocument();
    expect(screen.getAllByText('Pending')).toHaveLength(3);
    expect(screen.getByText('$0')).toBeInTheDocument();
  });

  it('renders booking details with flight data', () => {
    render(React.createElement(BookingSummary, { flight: flight as any }));
    expect(screen.getByText('SKY 487')).toBeInTheDocument();
    expect(screen.getByText('07:15')).toBeInTheDocument();
    expect(screen.getByText('New York (JFK) → Los Angeles (LAX)')).toBeInTheDocument();
    expect(screen.getByText('May 18, 2026')).toBeInTheDocument();
    expect(screen.getByText('Rs 299')).toBeInTheDocument();
  });

  it('renders the travel date and total for a provided flight', () => {
    render(React.createElement(BookingSummary, { flight: flight as any }));
    expect(screen.getByText('Travel date')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('Rs 299')).toBeInTheDocument();
  });
});
