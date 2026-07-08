"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import BookingQRCode from '@/components/BookingQRCode';
import { getFlightById } from '@/lib/flights';
import TicketPreview from '@/components/booking/TicketPreview';

interface ConfirmationPageProps {
  searchParams: { flightId?: string };
}

export default function ConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const flight = searchParams.flightId ? getFlightById(searchParams.flightId) : undefined;

  const [qrSrc, setQrSrc] = useState<string | null>(null);
  const [bookingRef, setBookingRef] = useState<string | null>(null);

  const generateQR = () => {
    try {
      // Create booking on server and show booking QR
      const pRaw = typeof window !== 'undefined' ? localStorage.getItem('passengers') : null;
      const passengers = pRaw ? JSON.parse(pRaw) : [];
      const selectedSeats = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('selectedSeats') || '[]') : [];
      const selectedSeat = selectedSeats?.[0] || null;
      const seatLabel = selectedSeat
        ? typeof selectedSeat === 'object'
          ? `${selectedSeat.row}${selectedSeat.column}`
          : String(selectedSeat)
        : null;

      const flight = searchParams.flightId ? getFlightById(searchParams.flightId) : undefined;

      const body = {
        flightId: searchParams.flightId,
        flightNumber: flight?.id || flight?.airline || searchParams.flightId,
        passengers,
        from: flight?.from,
        to: flight?.to,
        departureAt: flight?.departure || flight?.date || new Date().toISOString(),
        arrivalAt: flight?.arrival || null,
        seat: seatLabel,
      };

      fetch('/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        .then((r) => r.json())
        .then((data) => {
          if (data?.bookingId) {
            setBookingRef(data.bookingId);
          }
        })
        .catch(() => setBookingRef(null));
    } catch (e) {
      setBookingRef(null);
    }
  };

  useEffect(() => {
    // generate on mount so QR appears if data exists
    if (typeof window !== 'undefined') generateQR();
  }, [searchParams.flightId]);

  return (
    <main className="min-h-screen px-6 py-10 lg:px-16">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Booking complete</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900">Your flight is confirmed</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            {flight
              ? `Thanks for booking with us. Your seat is reserved on the ${flight.airline} flight from ${flight.from} to ${flight.to}.`
              : 'Your payment was successful. You will receive an email confirmation shortly.'}
          </p>
        </div>

        {flight && <TicketPreview flight={flight} />}

        {/* Trip QR for check-in */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-center">
          <h3 className="text-lg font-semibold text-slate-900">Boarding QR</h3>
          <p className="text-sm text-slate-600 mt-2">Present this QR at airport check-in.</p>
          <div className="mt-4 flex flex-col items-center gap-4">
            <div>
              <button onClick={generateQR} className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">Generate QR now</button>
            </div>
            {bookingRef ? (
              <div className="flex flex-col items-center gap-3">
                <BookingQRCode bookingUrl={`${typeof window !== 'undefined' ? window.location.origin : ''}/booking/${bookingRef}`} />
                <p className="text-sm text-slate-700">Booking reference: <strong>{bookingRef}</strong></p>
              </div>
            ) : (
              <p className="text-sm text-slate-500">No QR available yet. Click generate to create booking and QR.</p>
            )}

            {/* No payload preview — we only display the QR image */}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Next steps</h2>
              <p className="mt-2 text-sm text-slate-600">Save your itinerary and check your inbox for travel instructions.</p>
            </div>
            <Link
              href="/flights"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Browse more flights
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
