import type { Flight } from '@/types/flight';

interface BookingSummaryProps {
  flight?: Flight;
}

export default function BookingSummary({ flight }: BookingSummaryProps) {
  const route = flight ? `${flight.from} → ${flight.to}` : 'Select a flight';
  const travelDate = flight ? flight.departure.split(' · ')[0] : 'Pending';
  const total = flight ? flight.price : '$0';

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Booking summary</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Flight</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{flight?.flightNumber ?? 'Pending'}</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Boarding</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{flight?.boardingTime ?? 'Pending'}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Route</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{route}</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Travel date</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{travelDate}</p>
        </div>
      </div>

      <div className="mt-8 rounded-3xl bg-slate-50 p-6">
        <p className="text-sm text-slate-500">Total</p>
        <p className="mt-2 text-4xl font-semibold text-slate-900">{total}</p>
      </div>
    </section>
  );
}
