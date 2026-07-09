"use client";

import React, { useState } from 'react';

export default function AdminNavbar() {
  const [q, setQ] = useState('');

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-950 text-sm font-semibold text-white lg:hidden">
            AD
          </div>
          <div className="hidden md:block">
            <form onSubmit={(e) => e.preventDefault()} className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search bookings, flights, users..."
                className="w-80 rounded-full border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-200"
              />
            </form>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="rounded-md p-2 hover:bg-slate-100" aria-label="Notifications">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V9A6 6 0 006 9v5.2a2 2 0 01-.6 1.4L4 17h11z"
              />
            </svg>
          </button>

          <button className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-slate-100">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500 text-xs font-semibold text-slate-950">
              AD
            </span>
            <span className="hidden text-sm sm:block">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
}
