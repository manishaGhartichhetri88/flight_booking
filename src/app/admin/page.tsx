"use client";

import React, { useEffect, useState } from 'react';
import DashboardCard from '@/components/admin/DashboardCard';
import FlightsTable from '@/components/admin/FlightsTable';
import DelaySimulator from '@/components/admin/DelaySimulator';

type Stats = { flights: number; bookings: number; passengers: number; todaysFlights: number; revenue: number; seats: number; cancelled: number };

export default function AdminPage() {
  const [stats, setStats] = useState<Stats>({ flights: 0, bookings: 0, passengers: 0, todaysFlights: 0, revenue: 0, seats: 0, cancelled: 0 });

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    (async () => {
      try {
        const [flightsRes, bookingsRes, usersRes] = await Promise.all([
          fetch(`${api}/flights`).then(r => r.json()).catch(() => []),
          fetch(`${api}/bookings`).then(r => r.json()).catch(() => []),
          fetch(`${api}/users`).then(r => r.json()).catch(() => []),
        ]);
        setStats((s) => ({
          ...s,
          flights: Array.isArray(flightsRes) ? flightsRes.length : 0,
          bookings: Array.isArray(bookingsRes) ? bookingsRes.length : 0,
          passengers: Array.isArray(usersRes) ? usersRes.length : 0,
        }));
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  return (
    <main className="px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <div className="text-sm text-slate-600">Live backend data</div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 mb-6">
        <DashboardCard title="Total Flights" value={stats.flights} color="indigo" />
        <DashboardCard title="Total Bookings" value={stats.bookings} color="emerald" />
        <DashboardCard title="Total Passengers" value={stats.passengers} color="rose" />
        <DashboardCard title="Today's Flights" value={stats.todaysFlights} color="slate" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow col-span-2">
          <h2 className="text-lg font-medium mb-4">Monthly Booking Chart</h2>
          <div className="h-56 bg-slate-50 rounded" />
        </div>

        <div className="rounded-2xl bg-white p-4 shadow">
          <h2 className="text-lg font-medium mb-4">Flight Status</h2>
          <div className="h-56 bg-slate-50 rounded" />
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-4 shadow">
        <h2 className="text-lg font-medium mb-4">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="pb-2">Booking ID</th>
                <th className="pb-2">Passenger</th>
                <th className="pb-2">Flight</th>
                <th className="pb-2">Destination</th>
                <th className="pb-2">Seat</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Date</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              <tr className="border-t">
                <td className="py-3">—</td>
                <td className="py-3">—</td>
                <td className="py-3">—</td>
                <td className="py-3">—</td>
                <td className="py-3">—</td>
                <td className="py-3">—</td>
                <td className="py-3">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
