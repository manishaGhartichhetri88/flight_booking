"use client";

import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="sticky top-6">
      <div className="rounded-2xl bg-white p-4 shadow">
        <h3 className="text-sm font-semibold mb-4">Admin</h3>
        <nav className="space-y-2 text-sm">
          <Link href="/admin" className="block rounded px-3 py-2 hover:bg-slate-50">Dashboard</Link>
          <Link href="/admin/flights" className="block rounded px-3 py-2 hover:bg-slate-50">Flights</Link>
          <Link href="/admin/bookings" className="block rounded px-3 py-2 hover:bg-slate-50">Bookings</Link>
          <Link href="/admin/users" className="block rounded px-3 py-2 hover:bg-slate-50">Users</Link>
          <Link href="/admin/settings" className="block rounded px-3 py-2 hover:bg-slate-50">Settings</Link>
        </nav>
      </div>
    </div>
  );
}
