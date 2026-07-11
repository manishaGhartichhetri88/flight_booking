import React from 'react';
import { render, screen } from '@testing-library/react';

vi.mock('@/components/BookingQRCode', () => ({
  __esModule: true,
  default: () => <div data-testid="booking-qrcode" />,
}));

import BoardingPassCard from './index';

describe('BoardingPassCard', () => {
  const booking = {
    bookingId: 'ABC123',
    passengers: [{ name: 'Jane Doe' }],
    flightNumber: 'SKY 487',
    from: 'New York',
    to: 'Los Angeles',
    departureAt: '2026-05-18T08:00:00.000Z',
    gate: '12',
    seat: '14A',
    status: 'Confirmed',
  } as any;

  it('renders the booking summary details', () => {
    render(<BoardingPassCard booking={booking} />);

    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText(/Booking:/i)).toHaveTextContent('ABC123');
    expect(screen.getByText(/Flight:/i)).toHaveTextContent('SKY 487');
    expect(screen.getByText(/From:/i)).toHaveTextContent('New York');
    expect(screen.getByText(/To:/i)).toHaveTextContent('Los Angeles');
    expect(screen.getByText(/Gate:/i)).toHaveTextContent('12');
    expect(screen.getByText(/Seat:/i)).toHaveTextContent('14A');
    expect(screen.getByText(/Status:/i)).toHaveTextContent('Confirmed');
  });

  it('renders the mocked BookingQRCode component', () => {
    render(<BoardingPassCard booking={booking} />);

    expect(screen.getByTestId('booking-qrcode')).toBeInTheDocument();
  });
});