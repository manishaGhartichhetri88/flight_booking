import React from 'react';
import { render, screen } from '@testing-library/react';

vi.mock('react-qr-code', () => ({
  __esModule: true,
  default: () => <svg data-testid="qr-code" />,
}));

import BookingQRCode from './index';

describe('BookingQRCode', () => {
  it('renders a QR code and download button', () => {
    render(<BookingQRCode bookingUrl="https://example.com/booking/123" />);

    expect(screen.getByTestId('qr-code')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /download qr/i })).toBeInTheDocument();
  });

  it('renders the correct button label', () => {
    render(<BookingQRCode bookingUrl="https://example.com/booking/123" />);

    expect(screen.getByText(/Download QR/i)).toBeInTheDocument();
  });
});