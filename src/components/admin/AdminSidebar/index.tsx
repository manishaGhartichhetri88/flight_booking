"use client";

import Link from 'next/link';
import React from 'react';

export default function AdminSidebar() {
  const items = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/flights', label: 'Flights' },
    { href: '/admin/bookings', label: 'Bookings' },
    { href: '/admin/passengers', label: 'Passengers' },
    { href: '/admin/check-in', label: 'Check-In' },
    { href: '/admin/payments', label: 'Payments' },
    { href: '/admin/reports', label: 'Reports' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/profile', label: 'Profile' },
    { href: '/admin/settings', label: 'Settings' },
    { href: '/logout', label: 'Logout' },
  ];

  return (
    <aside className="hidden lg:block w-64">
      <div className="sticky top-6">
        <div className="rounded-2xl bg-white p-4 shadow">
          <h3 className="text-sm font-semibold mb-4">Admin</h3>
          <nav className="space-y-1 text-sm">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded px-3 py-2 hover:bg-slate-50"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
