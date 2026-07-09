"use client";

import { useEffect, useMemo, useState } from 'react';

type AdminView = 'flights' | 'bookings' | 'passengers' | 'check-in' | 'payments' | 'reports' | 'users' | 'profile' | 'settings';
type Row = Record<string, any>;
type LoadState = 'loading' | 'ready' | 'error';

const api = '/api/admin';

const viewCopy: Record<AdminView, { title: string; eyebrow: string; description: string }> = {
  flights: {
    title: 'Flights',
    eyebrow: 'Schedule control',
    description: 'Routes, fares, timings, and operating status from the backend flight inventory.',
  },
  bookings: {
    title: 'Bookings',
    eyebrow: 'Reservation queue',
    description: 'Recent customer bookings and fulfilment status from the booking collection.',
  },
  passengers: {
    title: 'Passengers',
    eyebrow: 'Customer manifest',
    description: 'Passenger-facing accounts and travel contact details registered in the system.',
  },
  'check-in': {
    title: 'Check-In',
    eyebrow: 'Boarding readiness',
    description: 'Bookings grouped into a practical check-in queue for airport operations.',
  },
  payments: {
    title: 'Payments',
    eyebrow: 'Revenue desk',
    description: 'Payment amounts and booking settlement status calculated from live booking data.',
  },
  reports: {
    title: 'Reports',
    eyebrow: 'Operating summary',
    description: 'A compact report across flights, bookings, customers, and revenue.',
  },
  users: {
    title: 'Users',
    eyebrow: 'Access directory',
    description: 'User accounts and roles returned by the backend users endpoint.',
  },
  profile: {
    title: 'Profile',
    eyebrow: 'Admin account',
    description: 'Current administrator workspace details and backend connectivity status.',
  },
  settings: {
    title: 'Settings',
    eyebrow: 'System configuration',
    description: 'Read-only operational settings inferred from the running frontend and backend.',
  },
};

const readText = (item: Row, keys: string[], fallback = 'Not assigned') => {
  for (const key of keys) {
    const value = item?.[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') return String(value);
  }

  return fallback;
};

const readNumber = (item: Row, keys: string[]) => {
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

const getStatus = (item: Row) => readText(item, ['status', 'bookingStatus', 'flightStatus', 'paymentStatus'], 'confirmed').toLowerCase();

const statusClass = (status: string) => {
  if (status.includes('cancel') || status.includes('failed')) return 'bg-red-50 text-red-700 ring-red-200';
  if (status.includes('delay') || status.includes('pending') || status.includes('hold')) return 'bg-amber-50 text-amber-700 ring-amber-200';
  return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(value || 0);

export default function AdminResourcePage({ view }: { view: AdminView }) {
  const [flights, setFlights] = useState<Row[]>([]);
  const [bookings, setBookings] = useState<Row[]>([]);
  const [users, setUsers] = useState<Row[]>([]);
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
      } catch {
        if (mounted) setLoadState('error');
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const revenue = bookings.reduce((total, booking) => total + readNumber(booking, ['total', 'amount', 'price', 'fare']), 0);
    const pending = bookings.filter((booking) => {
      const status = getStatus(booking);
      return status.includes('pending') || status.includes('hold');
    }).length;
    const cancelled = bookings.filter((booking) => getStatus(booking).includes('cancel')).length;
    const checkedIn = bookings.filter((booking) => {
      const status = getStatus(booking);
      return status.includes('checked') || status.includes('confirmed') || status.includes('paid');
    }).length;

    return { revenue, pending, cancelled, checkedIn };
  }, [bookings]);

  const copy = viewCopy[view];

  return (
    <main className="space-y-6 pb-10">
      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-cyan-700">{copy.eyebrow}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">{copy.title}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{copy.description}</p>
          </div>
          <span className="w-fit rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
            {loadState === 'loading' ? 'Syncing backend' : loadState === 'error' ? 'Backend unavailable' : 'Live backend data'}
          </span>
        </div>
      </section>

      {loadState === 'error' && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Could not load admin data. Start the backend on http://localhost:4000 and refresh this page.
        </div>
      )}

      {view === 'flights' && <FlightsView flights={flights} />}
      {view === 'bookings' && <BookingsView bookings={bookings} />}
      {view === 'passengers' && <PeopleView users={users} title="Passengers" />}
      {view === 'check-in' && <CheckInView bookings={bookings} checkedIn={stats.checkedIn} pending={stats.pending} />}
      {view === 'payments' && <PaymentsView bookings={bookings} revenue={stats.revenue} pending={stats.pending} />}
      {view === 'reports' && <ReportsView flights={flights} bookings={bookings} users={users} revenue={stats.revenue} cancelled={stats.cancelled} />}
      {view === 'users' && <PeopleView users={users} title="Users" />}
      {view === 'profile' && <ProfileView users={users} />}
      {view === 'settings' && <SettingsView />}
    </main>
  );
}

function FlightsView({ flights }: { flights: Row[] }) {
  return (
    <Panel title="Flight Inventory" detail={`${flights.length} routes loaded`}>
      <DataTable
        emptyTitle="No flights found"
        emptyDetail="The backend returned no flight records."
        headers={['Flight', 'Route', 'Departure', 'Fare', 'Status']}
        rows={flights.map((flight, index) => [
          <NameCell
            key="flight"
            title={readText(flight, ['airline', 'company', 'name'], 'Flight')}
            detail={readText(flight, ['flightNumber', 'flight_no', 'code'], `FL-${index + 1}`)}
          />,
          `${readText(flight, ['from', 'origin'], 'Origin')} to ${readText(flight, ['to', 'destination'], 'Destination')}`,
          readText(flight, ['timetable', 'departure', 'departureTime', 'departureAt'], 'TBA'),
          readText(flight, ['price', 'fare', 'cost'], 'TBA'),
          <StatusPill key="status" status={getStatus(flight)} />,
        ])}
      />
    </Panel>
  );
}

function BookingsView({ bookings }: { bookings: Row[] }) {
  return (
    <Panel title="Booking Records" detail={`${bookings.length} records loaded`}>
      <DataTable
        emptyTitle="No bookings found"
        emptyDetail="Customer reservations will appear here after checkout."
        headers={['Passenger', 'Flight', 'Route', 'Seat', 'Status']}
        rows={bookings.map((booking, index) => [
          <NameCell
            key="passenger"
            title={readText(booking, ['passengerName', 'name', 'customerName', 'email'], 'Passenger')}
            detail={readText(booking, ['bookingId', '_id', 'id'], `BK-${index + 1}`)}
          />,
          readText(booking, ['flightNumber', 'flight', 'flightId'], 'Flight pending'),
          `${readText(booking, ['from', 'origin'], 'Origin')} to ${readText(booking, ['to', 'destination'], 'Destination')}`,
          readText(booking, ['seat', 'seatNumber', 'class'], 'Seat TBA'),
          <StatusPill key="status" status={getStatus(booking)} />,
        ])}
      />
    </Panel>
  );
}

function PeopleView({ users, title }: { users: Row[]; title: string }) {
  return (
    <Panel title={`${title} Directory`} detail={`${users.length} accounts loaded`}>
      <DataTable
        emptyTitle={`No ${title.toLowerCase()} found`}
        emptyDetail="Registered accounts from the backend will appear here."
        headers={['Name', 'Email', 'Mobile', 'Role', 'Joined']}
        rows={users.map((user, index) => [
          <NameCell key="name" title={readText(user, ['name'], 'Unnamed user')} detail={readText(user, ['_id', 'id'], `USR-${index + 1}`)} />,
          readText(user, ['email'], 'No email'),
          readText(user, ['mobile', 'phone'], 'No mobile'),
          <StatusPill key="role" status={readText(user, ['role'], 'user')} />,
          formatDate(readText(user, ['createdAt', 'updatedAt'], '')),
        ])}
      />
    </Panel>
  );
}

function CheckInView({ bookings, checkedIn, pending }: { bookings: Row[]; checkedIn: number; pending: number }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      <div className="grid gap-4">
        <SummaryTile label="Ready for boarding" value={checkedIn} />
        <SummaryTile label="Needs attention" value={pending} />
      </div>
      <BookingsView bookings={bookings} />
    </div>
  );
}

function PaymentsView({ bookings, revenue, pending }: { bookings: Row[]; revenue: number; pending: number }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <SummaryTile label="Collected revenue" value={formatMoney(revenue)} />
        <SummaryTile label="Pending payments" value={pending} />
      </div>
      <Panel title="Payment Ledger" detail="Amounts are read from total, amount, price, or fare fields.">
        <DataTable
          emptyTitle="No payments found"
          emptyDetail="Bookings with payment amounts will appear here."
          headers={['Booking', 'Passenger', 'Amount', 'Method', 'Status']}
          rows={bookings.map((booking, index) => [
            readText(booking, ['bookingId', '_id', 'id'], `BK-${index + 1}`),
            readText(booking, ['passengerName', 'name', 'customerName', 'email'], 'Passenger'),
            formatMoney(readNumber(booking, ['total', 'amount', 'price', 'fare'])),
            readText(booking, ['paymentMethod', 'method'], 'Not recorded'),
            <StatusPill key="status" status={getStatus(booking)} />,
          ])}
        />
      </Panel>
    </div>
  );
}

function ReportsView({ flights, bookings, users, revenue, cancelled }: { flights: Row[]; bookings: Row[]; users: Row[]; revenue: number; cancelled: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryTile label="Flights" value={flights.length} />
      <SummaryTile label="Bookings" value={bookings.length} />
      <SummaryTile label="Passengers" value={users.length} />
      <SummaryTile label="Revenue" value={formatMoney(revenue)} />
      <div className="sm:col-span-2 xl:col-span-4">
        <Panel title="Risk Snapshot" detail="Quick operating signals from live records.">
          <div className="grid gap-3 sm:grid-cols-3">
            <SummaryTile label="Cancelled bookings" value={cancelled} compact />
            <SummaryTile label="Average fare" value={formatMoney(bookings.length ? revenue / bookings.length : 0)} compact />
            <SummaryTile label="Load ratio" value={`${bookings.length ? Math.round((bookings.length / Math.max(flights.length, 1)) * 100) : 0}%`} compact />
          </div>
        </Panel>
      </div>
    </div>
  );
}

function ProfileView({ users }: { users: Row[] }) {
  const admin = users.find((user) => readText(user, ['role'], '').toLowerCase() === 'admin') || users[0] || {};

  return (
    <Panel title="Admin Profile" detail="Profile details are read from the users collection.">
      <div className="grid gap-4 sm:grid-cols-2">
        <SummaryTile label="Name" value={readText(admin, ['name'], 'Admin')} compact />
        <SummaryTile label="Email" value={readText(admin, ['email'], 'No email')} compact />
        <SummaryTile label="Mobile" value={readText(admin, ['mobile'], 'No mobile')} compact />
        <SummaryTile label="Role" value={readText(admin, ['role'], 'admin')} compact />
      </div>
    </Panel>
  );
}

function SettingsView() {
  return (
    <Panel title="System Settings" detail="Runtime values currently used by the admin frontend.">
      <div className="grid gap-4 sm:grid-cols-2">
        <SummaryTile label="Backend URL" value="http://localhost:4000" compact />
        <SummaryTile label="Data source" value="MongoDB collections" compact />
        <SummaryTile label="Admin mode" value="Read-only dashboard" compact />
        <SummaryTile label="Frontend route" value="/admin" compact />
      </div>
    </Panel>
  );
}

function Panel({ title, detail, children }: { title: string; detail: string; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex flex-col gap-1 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-slate-950">{title}</h2>
        <p className="text-sm text-slate-500">{detail}</p>
      </div>
      {children}
    </section>
  );
}

function DataTable({ headers, rows, emptyTitle, emptyDetail }: { headers: string[]; rows: React.ReactNode[][]; emptyTitle: string; emptyDetail: string }) {
  if (!rows.length) return <EmptyState title={emptyTitle} detail={emptyDetail} />;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-5 py-3 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-slate-50">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-5 py-4 text-slate-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NameCell({ title, detail }: { title: string; detail: string }) {
  return (
    <div>
      <div className="font-medium text-slate-950">{title}</div>
      <div className="mt-0.5 max-w-64 truncate text-xs text-slate-500">{detail}</div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusClass(status)}`}>{status}</span>;
}

function SummaryTile({ label, value, compact = false }: { label: string; value: string | number; compact?: boolean }) {
  return (
    <div className={`rounded-lg border border-slate-200 bg-white ${compact ? 'p-4' : 'p-5'}`}>
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className="mt-2 break-words text-2xl font-semibold tracking-normal text-slate-950">{value}</div>
    </div>
  );
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="px-5 py-12 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-500">0</div>
      <h3 className="mt-3 text-sm font-semibold text-slate-950">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">{detail}</p>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not recorded';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
