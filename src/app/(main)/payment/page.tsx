import { getFlightById } from '@/lib/flights';
import TicketPreview from '@/components/booking/TicketPreview';
import PaymentForm from '@/components/payment/PaymentForm';

interface PaymentPageProps {
  searchParams: { flightId?: string };
}

export default function PaymentPage({ searchParams }: PaymentPageProps) {
  const flight = searchParams.flightId ? getFlightById(searchParams.flightId) : undefined;

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10 lg:px-16">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Secure payment</p>
              <h1 className="mt-3 text-4xl font-semibold text-slate-900">Complete your booking</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                {flight
                  ? 'Pay with confidence using our secure payment form and get your itinerary instantly.'
                  : 'Choose a flight first, then return here to complete your checkout.'}
              </p>
            </div>
            <div className="rounded-3xl bg-slate-50 px-6 py-4 text-slate-700">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Payment method</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">Card</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <PaymentForm flightId={flight?.id} />
          <aside className="space-y-6">
            {flight ? (
              <TicketPreview flight={flight} />
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center shadow-sm">
                <p className="text-lg font-semibold text-slate-900">Flight not found</p>
                <p className="mt-3 text-sm text-slate-600">Return to the flight list and pick a route before paying.</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
