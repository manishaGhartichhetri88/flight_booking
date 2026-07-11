import React from 'react';
import { render, screen } from '@testing-library/react';
import FlightCard from './index';

const flight = {
  id: 'f1',
  airline: 'Skyway Airlines',
  flightNumber: 'SKY 487',
  seatClass: 'Economy',
  baggageAllowance: '1 carry-on + 1 checked bag',
  boardingTime: '07:15',
  boardingZone: 'Zone 2',
  from: 'New York (JFK)',
  to: 'Los Angeles (LAX)',
  departure: 'May 18, 2026 · 08:00',
  arrival: 'May 18, 2026 · 14:15',
  departureTerminal: '4',
  departureGate: '22B',
  arrivalTerminal: '5',
  arrivalGate: '18',
  price: 'Rs 299',
  duration: '6h 15m',
  stops: 'Non-stop',
  timetable: '08:00 - 14:15',
  rating: 4.8,
  image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  originCountry: 'US',
  destinationCountry: 'US',
  description: 'A comfortable coast-to-coast flight with premium snacks and entertainment included.',
  amenities: ['Wi-Fi', 'Meal included', 'Seat selection', 'Priority boarding'],
};

describe('FlightCard', () => {
  it('renders flight details and link', () => {
    render(React.createElement(FlightCard, { flight }));

    expect(screen.getByRole('link')).toHaveAttribute('href', '/flight/f1');
    expect(screen.getAllByText('Skyway Airlines')).toHaveLength(2);
    expect(screen.getAllByText('08:00 - 14:15')).toHaveLength(2);
    expect(screen.getByText('Rs 299')).toBeInTheDocument();
    expect(screen.getByText('6h 15m')).toBeInTheDocument();
    expect(screen.getByText('4.8 ★')).toBeInTheDocument();
  });

  it('renders the route and flight image alt text', () => {
    render(React.createElement(FlightCard, { flight }));
    expect(screen.getByText('New York (JFK) → Los Angeles (LAX)')).toBeInTheDocument();
    expect(screen.getByAltText('Skyway Airlines route image')).toBeInTheDocument();
  });

  it('renders stops badge and description content', () => {
    render(React.createElement(FlightCard, { flight }));
    expect(screen.getByText('Non-stop')).toBeInTheDocument();
    expect(screen.getByText('A comfortable coast-to-coast flight with premium snacks and entertainment included.')).toBeInTheDocument();
  });
});
