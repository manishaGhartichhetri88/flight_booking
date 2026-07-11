import React from 'react';
import { render, screen } from '@testing-library/react';
import TicketPreview from './index';

describe('TicketPreview', () => {
  const flight = {
    airline: 'Skyway Airlines',
    flightNumber: 'SKY 487',
    from: 'New York (JFK)',
    to: 'Los Angeles (LAX)',
    price: 'Rs 299',
    seatClass: 'Business',
    boardingTime: '07:15',
    boardingZone: 'A1',
    departure: 'May 18, 2026 · 08:00',
    departureGate: '12',
    departureTerminal: 'B',
    arrival: 'May 18, 2026 · 11:45',
    arrivalGate: '24',
    arrivalTerminal: 'C',
    amenities: ['WiFi', 'Extra legroom'],
  } as any;

  it('renders flight details and pricing', () => {
    render(<TicketPreview flight={flight} />);

    expect(screen.getByText('Skyway Airlines')).toBeInTheDocument();
    expect(screen.getByText('New York (JFK) → Los Angeles (LAX)')).toBeInTheDocument();
    expect(screen.getByText('Rs 299')).toBeInTheDocument();
  });

  it('renders the flight number and boarding information', () => {
    render(<TicketPreview flight={flight} />);

    expect(screen.getByText('SKY 487')).toBeInTheDocument();
    expect(screen.getByText('07:15')).toBeInTheDocument();
    expect(screen.getByText('A1')).toBeInTheDocument();
  });

  it('renders included flight amenities', () => {
    render(<TicketPreview flight={flight} />);

    expect(screen.getByText('WiFi')).toBeInTheDocument();
    expect(screen.getByText('Extra legroom')).toBeInTheDocument();
  });
});