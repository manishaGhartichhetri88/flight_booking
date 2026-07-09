"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function AdminSidebar() {
  const pathname = usePathname();
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
    <aside className="w-full">
      <div className="lg:sticky lg:top-24">
        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
          <h3 className="text-sm font-semibold mb-4">Admin</h3>
          <nav className="grid grid-cols-2 gap-1 text-sm sm:grid-cols-3 lg:grid-cols-1">
            {items.map((item) => {
              const active = item.href === '/admin' ? pathname === item.href : pathname.startsWith(item.href);
              return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-md px-3 py-2 transition ${
                  active ? 'bg-slate-950 font-medium text-white' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                }`}
              >
                {item.label}
              </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
