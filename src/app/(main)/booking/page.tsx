'use client';

import Link from 'next/link';
import { useState } from 'react';
import { getFlightById } from '@/lib/flights';
import TicketPreview from '@/components/booking/TicketPreview';
import BookingSummary from '@/components/booking/BookingSummary';
import PassengerForm from '@/components/booking/PassengerForm';
import SeatSelector from '@/components/booking/SeatSelector';

interface BookingPageProps {
  searchParams: { flightId?: string };
}

interface Seat {
  id: string;
  row: number;
  column: string;
  isAvailable: boolean;
  isSelected: boolean;
  class: 'economy' | 'business' | 'first';
  price: number;
}

export default function BookingPage({ searchParams }: BookingPageProps) {
  const flight = searchParams.flightId ? getFlightById(searchParams.flightId) : undefined;
  const [passengerCount, setPassengerCount] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [seatsConfirmed, setSeatsConfirmed] = useState(false);

  const handleSeatsSelect = (seats: Seat[]) => {
    setSelectedSeats(seats);
    setSeatsConfirmed(true);
    localStorage.setItem('selectedSeats', JSON.stringify(seats));
  };

  const totalSeatPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const basePrice = flight ? parseInt(String(flight.price).replace(/\D/g, '')) : 0;
  const totalPrice = basePrice + totalSeatPrice;

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10 lg:px-16">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-[2rem] bg-gradient-to-r from-slate-950 to-slate-900 p-1 shadow-2xl shadow-slate-950/20">
          <div className="rounded-[1.75rem] bg-slate-950 px-8 py-8 text-white sm:px-12 sm:py-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-sky-300/80">Passenger details</p>
                <h1 className="mt-3 text-4xl font-semibold">Secure your seat</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                  {flight ? 'Select your seats and complete the traveler information below, then move to payment for your selected route.' : 'Select a flight on the flights page, then come back here to finish your booking.'}
                </p>
              </div>
              <div className="rounded-3xl bg-slate-900/90 px-5 py-4 text-slate-200">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Booking status</p>
                <p className="mt-3 text-2xl font-semibold text-white">
                  {!flight ? 'Waiting for selection' : seatsConfirmed ? 'Seats selected' : 'Flight selected'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.75fr]">
          <div className="space-y-6">
            {/* Passenger Count Selector */}
            {flight && (
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">Number of passengers</h2>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setPassengerCount(Math.max(1, passengerCount - 1))}
                    className="rounded-full bg-slate-200 w-10 h-10 flex items-center justify-center hover:bg-slate-300 transition font-semibold"
                  >
                    −
                  </button>
                  <div className="text-center flex-1">
                    <p className="text-4xl font-bold text-indigo-600">{passengerCount}</p>
                    <p className="text-sm text-slate-600 mt-1">Passenger{passengerCount !== 1 ? 's' : ''}</p>
                  </div>
                  <button
                    onClick={() => setPassengerCount(Math.min(9, passengerCount + 1))}
                    className="rounded-full bg-slate-200 w-10 h-10 flex items-center justify-center hover:bg-slate-300 transition font-semibold"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Seat Selector */}
            {flight && <SeatSelector flightId={flight.id} passengerCount={passengerCount} onSeatsSelect={handleSeatsSelect} />}

            {/* Passenger Details Form(s) */}
            {flight && seatsConfirmed && (
              <div className="space-y-6">
                {Array.from({ length: passengerCount }).map((_, i) => {
                  const seat = selectedSeats[i];
                  return <PassengerForm key={i} index={i} seat={seat} />;
                })}
              </div>
            )}

            {flight && seatsConfirmed && (
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-900">Payment readiness</h2>
                <p className="mt-3 text-slate-600">Save passenger details first, then continue to our secure checkout experience.</p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Link
                    href={flight ? `/payment?flightId=${flight.id}` : '/flights'}
                    className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    {flight ? 'Continue to payment' : 'Choose a flight'}
                  </Link>
                  <p className="text-sm text-slate-500">Your booking details are saved locally for this session.</p>
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            {flight ? (
              <>
                <TicketPreview flight={flight} />
                <BookingSummary flight={flight} />
              </>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center shadow-sm">
                <p className="text-lg font-semibold text-slate-900">No flight selected</p>
                <p className="mt-3 text-sm text-slate-600">Book a flight first to see route details, pricing, and boarding info.</p>
                <Link
                  href="/flights"
                  className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Browse flights
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
