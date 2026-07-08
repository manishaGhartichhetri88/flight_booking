import type { Flight } from '@/types/flight';

interface TicketPreviewProps {
  flight: Flight;
}

export default function TicketPreview({ flight }: TicketPreviewProps) {
  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-sky-500">{flight.airline}</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">{flight.from} → {flight.to}</h3>
          </div>
          <div className="rounded-3xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">{flight.price}</div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.5rem] bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Flight</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{flight.flightNumber}</p>
            <p className="mt-1 text-sm text-slate-600">{flight.seatClass}</p>
          </div>
          <div className="rounded-[1.5rem] bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Boarding</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{flight.boardingTime}</p>
            <p className="mt-1 text-sm text-slate-600">{flight.boardingZone}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.5rem] bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Departure</p>
            <p className="mt-2 text-slate-900">{flight.departure}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-500">Gate {flight.departureGate} · Terminal {flight.departureTerminal}</p>
          </div>
          <div className="rounded-[1.5rem] bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Arrival</p>
            <p className="mt-2 text-slate-900">{flight.arrival}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-500">Gate {flight.arrivalGate} · Terminal {flight.arrivalTerminal}</p>
          </div>
        </div>

        <div className="rounded-[1.5rem] bg-slate-50 p-5 text-sm leading-6 text-slate-600">
          <p className="font-semibold text-slate-900">What’s included</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {flight.amenities.map((amenity) => (
              <span key={amenity} className="rounded-full bg-white px-3 py-1 text-xs text-slate-700 shadow-sm">
                {amenity}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
