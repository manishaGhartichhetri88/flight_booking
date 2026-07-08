import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import TicketPreview from '@/components/booking/TicketPreview';
import { getFlightById } from '@/lib/flights';

interface FlightPageProps {
  params: { id: string };
}

export default function FlightDetailsPage({ params }: FlightPageProps) {
  const flight = getFlightById(params.id);

  if (!flight) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10 lg:px-16">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-slate-950 via-sky-900 to-cyan-600 p-1 shadow-2xl shadow-slate-900/20">
          <div className="rounded-[1.75rem] bg-slate-950 p-10 text-white">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs uppercase tracking-[0.45em] text-sky-300/70">Flight booking details</p>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight">{flight.from} → {flight.to}</h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">{flight.description}</p>
                <div className="mt-6 flex flex-wrap gap-3 text-sm">
                  <span className="rounded-full bg-white/10 px-4 py-2 text-slate-100">{flight.flightNumber}</span>
                  <span className="rounded-full bg-white/10 px-4 py-2 text-slate-100">{flight.seatClass}</span>
                  <span className="rounded-full bg-white/10 px-4 py-2 text-slate-100">{flight.baggageAllowance}</span>
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 px-6 py-5 text-right shadow-xl shadow-slate-950/30">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Best fare</p>
                <p className="mt-3 text-5xl font-semibold text-white">{flight.price}</p>
                <p className="mt-2 text-sm text-slate-300">Secure your seat with premium support.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Departure</p>
                    <p className="mt-3 text-2xl font-semibold text-slate-900">{flight.departure.split(' · ')[1]}</p>
                    <p className="mt-2 text-sm text-slate-500">{flight.departure.split(' · ')[0]}</p>
                    <p className="mt-4 text-base font-semibold text-slate-900">{flight.from}</p>
                  </div>
                  <div className="text-right text-slate-500">
                    <p className="text-xs uppercase tracking-[0.35em]">Gate</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{flight.departureGate}</p>
                    <p className="mt-3 text-sm">Terminal {flight.departureTerminal}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Arrival</p>
                    <p className="mt-3 text-2xl font-semibold text-slate-900">{flight.arrival.split(' · ')[1]}</p>
                    <p className="mt-2 text-sm text-slate-500">{flight.arrival.split(' · ')[0]}</p>
                    <p className="mt-4 text-base font-semibold text-slate-900">{flight.to}</p>
                  </div>
                  <div className="text-right text-slate-500">
                    <p className="text-xs uppercase tracking-[0.35em]">Gate</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{flight.arrivalGate}</p>
                    <p className="mt-3 text-sm">Terminal {flight.arrivalTerminal}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <p className="text-sm text-slate-500">Duration</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{flight.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Stops</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{flight.stops}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Boarding</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{flight.boardingTime}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Boarding zone</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{flight.boardingZone}</p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-slate-50 via-slate-100 to-sky-50 p-7 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500">In-flight perks</p>
                  <ul className="mt-4 space-y-3 text-sm text-slate-700">
                    <li>Complimentary snacks and drinks</li>
                    <li>Wi-Fi access onboard</li>
                    <li>Priority boarding available</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Special service</p>
                  <p className="mt-4 text-base leading-7 text-slate-700">Relax with flexible ticket change options and 24/7 customer support for every step of your trip.</p>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <TicketPreview flight={flight} />
            <Link
              href={`/booking?flightId=${flight.id}`}
              className="block rounded-3xl bg-slate-950 px-6 py-4 text-center text-base font-semibold text-white transition hover:bg-slate-800"
            >
              Continue to booking
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
