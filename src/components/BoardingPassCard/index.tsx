"use client";

import React from 'react';
import BookingQRCode from '@/components/BookingQRCode';
import { BookingRecord } from '@/types/booking';

interface Props {
  booking: BookingRecord;
}

export default function BoardingPassCard({ booking }: Props) {
  const bookingUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/booking/${booking.bookingId}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="rounded-lg border p-6 bg-white shadow-sm w-full max-w-2xl mx-auto">
      <div className="flex items-start gap-6">
        <div className="flex-1">
          <h3 className="text-xl font-semibold">{booking.passengers?.[0]?.name || 'Passenger'}</h3>
          <p className="text-sm text-slate-600">Booking: <strong>{booking.bookingId}</strong></p>
          <p className="mt-2 text-sm">Flight: <strong>{booking.flightNumber || booking.flightId}</strong></p>
          <p className="text-sm">From: <strong>{booking.from}</strong> → To: <strong>{booking.to}</strong></p>
          <p className="text-sm">Departure: <strong>{new Date(booking.departureAt).toLocaleString()}</strong></p>
          {booking.gate && <p className="text-sm">Gate: <strong>{booking.gate}</strong></p>}
          {booking.seat && <p className="text-sm">Seat: <strong>{booking.seat}</strong></p>}
          <p className="text-sm">Status: <strong>{booking.status}</strong></p>
        </div>

        <div className="w-44 flex-shrink-0">
          <BookingQRCode bookingUrl={bookingUrl} />
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button onClick={handlePrint} className="inline-flex items-center justify-center rounded bg-slate-900 px-4 py-2 text-sm text-white">Print Ticket</button>
      </div>
    </div>
  );
}
