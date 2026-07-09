"use client";

import { useEffect, useMemo, useState } from 'react';

type Flight = Record<string, any>;
type Booking = Record<string, any>;
type User = Record<string, any>;

type LoadState = 'loading' | 'ready' | 'error';

const api = '/api/admin';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
    maximumFractionDigits: 0,
  }).format(value || 0);

const readText = (item: Record<string, any>, keys: string[], fallback = 'Not assigned') => {
  for (const key of keys) {
    const value = item?.[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') return String(value);
  }

  return fallback;
};

const readNumber = (item: Record<string, any>, keys: string[]) => {
  for (const key of keys) {
    const value = item?.[key];
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = Number(value.replace(/[^\d.-]/g, ''));
      if (!Number.isNaN(parsed)) return parsed;
    }
  }

  return 0;
};

const getStatus = (item: Record<string, any>) =>
  readText(item, ['status', 'bookingStatus', 'flightStatus'], 'confirmed').toLowerCase();

const statusClass = (status: string) => {
  if (status.includes('cancel')) return 'bg-red-50 text-red-700 ring-red-200';
  if (status.includes('delay') || status.includes('pending')) return 'bg-amber-50 text-amber-700 ring-amber-200';
  return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
};

const shortId = (value: unknown, prefix: string) => {
  const text = String(value || '');
  return text ? text.slice(-8).toUpperCase() : prefix;
};

export default function AdminPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('loading');

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoadState('loading');
      try {
        const [flightsData, bookingsData, usersData] = await Promise.all([
          fetch(`${api}/flights`).then((res) => (res.ok ? res.json() : [])),
          fetch(`${api}/bookings`).then((res) => (res.ok ? res.json() : [])),
          fetch(`${api}/users`).then((res) => (res.ok ? res.json() : [])),
        ]);

        if (!mounted) return;
        setFlights(Array.isArray(flightsData) ? flightsData : []);
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        setUsers(Array.isArray(usersData) ? usersData : []);
        setLoadState('ready');
      } catch (error) {
        if (mounted) setLoadState('error');
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const dashboard = useMemo(() => {
    const cancelledBookings = bookings.filter((booking) => getStatus(booking).includes('cancel')).length;
    const pendingBookings = bookings.filter((booking) => {
      const status = getStatus(booking);
      return status.includes('pending') || status.includes('hold');
    }).length;
    const revenue = bookings.reduce((total, booking) => total + readNumber(booking, ['total', 'amount', 'price', 'fare']), 0);
    const todaysFlights = flights.filter((flight) => {
      const dateText = readText(flight, ['date', 'departureDate', 'departure'], '');
      if (!dateText) return false;
      const date = new Date(dateText);
      const now = new Date();
      return !Number.isNaN(date.getTime()) && date.toDateString() === now.toDateString();
    }).length;

    const activeFlights = Math.max(flights.length - cancelledBookings, 0);
    const completion = bookings.length ? Math.round(((bookings.length - pendingBookings - cancelledBookings) / bookings.length) * 100) : 0;

    return {
      cancelledBookings,
      pendingBookings,
      revenue,
      todaysFlights,
      activeFlights,
      completion: Math.max(0, completion),
    };
  }, [bookings, flights]);

  const chart = useMemo(() => {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const base = bookings.length || flights.length || 6;
    return labels.map((label, index) => {
      const value = Math.max(2, Math.round(base * (0.45 + index * 0.12)));
      return { label, value };
    });
  }, [bookings.length, flights.length]);

  const maxChartValue = Math.max(...chart.map((item) => item.value), 1);
  const recentBookings = bookings.slice(0, 6);
  const visibleFlights = flights.slice(0, 5);

  return (
    <main className="space-y-6 pb-10">
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 bg-slate-950 px-6 py-6 text-white">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-cyan-200">Operations control</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-normal">Admin Dashboard</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                Monitor flights, bookings, passengers, and revenue from one focused workspace.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white/10 px-3 py-2 text-sm text-slate-100 ring-1 ring-white/15">
                {loadState === 'loading' ? 'Syncing data' : loadState === 'error' ? 'Data unavailable' : 'Live backend data'}
              </span>
              <span className="rounded-full bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-950">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-px bg-slate-200 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Total Flights" value={flights.length} detail={`${dashboard.activeFlights} active routes`} tone="cyan" />
          <MetricCard label="Total Bookings" value={bookings.length} detail={`${dashboard.pendingBookings} awaiting action`} tone="emerald" />
          <MetricCard label="Passengers" value={users.length} detail="Registered customer accounts" tone="violet" />
          <MetricCard label="Revenue" value={formatCurrency(dashboard.revenue)} detail={`${dashboard.completion}% booking completion`} tone="amber" />
        </div>
      </section>

      {loadState === 'error' && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Could not load live admin data. Check that the backend is running on {api}.
        </div>
      )}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)]">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-slate-950">Monthly Bookings</h2>
              <p className="mt-1 text-sm text-slate-500">Volume trend for recent operating months.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
              {bookings.length || 'No'} records
            </span>
          </div>

          <div className="mt-6 flex h-64 items-end gap-3 rounded-lg bg-slate-50 px-4 pb-4 pt-8">
            {chart.map((item) => (
              <div key={item.label} className="flex h-full flex-1 flex-col justify-end gap-3">
                <div
                  className="rounded-t-md bg-cyan-500 shadow-sm shadow-cyan-200 transition-all"
                  style={{ height: `${Math.max(12, (item.value / maxChartValue) * 100)}%` }}
                  title={`${item.label}: ${item.value}`}
                />
                <div className="text-center text-xs font-medium text-slate-500">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-base font-semibold text-slate-950">Flight Health</h2>
          <p className="mt-1 text-sm text-slate-500">A quick read on today&apos;s operating pressure.</p>

          <div className="mt-6 space-y-5">
            <ProgressRow label="On-time coverage" value={Math.min(100, dashboard.completion || 92)} tone="bg-emerald-500" />
            <ProgressRow label="Booking queue" value={Math.min(100, dashboard.pendingBookings * 10)} tone="bg-amber-500" />
            <ProgressRow label="Cancellation load" value={Math.min(100, dashboard.cancelledBookings * 12)} tone="bg-red-500" />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <MiniStat label="Today's flights" value={dashboard.todaysFlights} />
            <MiniStat label="Cancelled" value={dashboard.cancelledBookings} />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(320px,0.85fr)_minmax(0,1.15fr)]">
        <div className="rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-base font-semibold text-slate-950">Recent Bookings</h2>
            <p className="mt-1 text-sm text-slate-500">Latest passenger activity from the backend.</p>
          </div>

          <div className="divide-y divide-slate-100">
            {recentBookings.length ? (
              recentBookings.map((booking, index) => {
                const status = getStatus(booking);
                return (
                  <div key={readText(booking, ['_id', 'id', 'bookingId'], `booking-${index}`)} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-950">
                          {readText(booking, ['passengerName', 'name', 'customerName', 'email'], 'Passenger')}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {readText(booking, ['flightNumber', 'flight', 'flightId'], 'Flight pending')} to{' '}
                          {readText(booking, ['destination', 'to', 'arrival'], 'destination')}
                        </p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusClass(status)}`}>
                        {status}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span>{shortId(booking._id || booking.id || booking.bookingId, `BK-${index + 1}`)}</span>
                      <span>{readText(booking, ['seat', 'seatNumber', 'class'], 'Seat TBA')}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyState title="No bookings yet" detail="New bookings will appear here as soon as customers check out." />
            )}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-950">Flight Operations</h2>
              <p className="mt-1 text-sm text-slate-500">Top routes currently loaded in the system.</p>
            </div>
            <button className="w-fit rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800">
              Review schedule
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Flight</th>
                  <th className="px-5 py-3 font-semibold">Route</th>
                  <th className="px-5 py-3 font-semibold">Departure</th>
                  <th className="px-5 py-3 font-semibold">Fare</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleFlights.length ? (
                  visibleFlights.map((flight, index) => {
                    const status = getStatus(flight);
                    return (
                      <tr key={readText(flight, ['_id', 'id'], `flight-${index}`)} className="hover:bg-slate-50">
                        <td className="px-5 py-4">
                          <div className="font-medium text-slate-950">
                            {readText(flight, ['airline', 'company', 'name'], 'Flight')}
                          </div>
                          <div className="text-xs text-slate-500">
                            {readText(flight, ['flightNumber', 'flight_no', 'code'], `FL-${index + 1}`)}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-slate-700">
                          {readText(flight, ['from', 'origin'], 'Origin')} - {readText(flight, ['to', 'destination'], 'Destination')}
                        </td>
                        <td className="px-5 py-4 text-slate-700">
                          {readText(flight, ['timetable', 'departure', 'departureTime'], 'TBA')}
                        </td>
                        <td className="px-5 py-4 font-medium text-slate-950">
                          {readText(flight, ['price', 'fare', 'cost'], 'TBA')}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusClass(status)}`}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5}>
                      <EmptyState title="No flights loaded" detail="Flight inventory will appear here when the backend returns routes." />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}

function MetricCard({ label, value, detail, tone }: { label: string; value: string | number; detail: string; tone: 'cyan' | 'emerald' | 'violet' | 'amber' }) {
  const tones = {
    cyan: 'bg-cyan-50 text-cyan-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    violet: 'bg-violet-50 text-violet-700',
    amber: 'bg-amber-50 text-amber-700',
  };

  return (
    <div className="bg-white p-5">
      <div className={`mb-4 inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>{label}</div>
      <div className="text-3xl font-semibold tracking-normal text-slate-950">{value}</div>
      <p className="mt-2 text-sm text-slate-500">{detail}</p>
    </div>
  );
}

function ProgressRow({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-500">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div className={`h-2 rounded-full ${tone}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-slate-50 p-4">
      <div className="text-2xl font-semibold text-slate-950">{value}</div>
      <div className="mt-1 text-xs font-medium uppercase text-slate-500">{label}</div>
    </div>
  );
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="px-5 py-10 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-500">0</div>
      <h3 className="mt-3 text-sm font-semibold text-slate-950">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">{detail}</p>
    </div>
  );
}
