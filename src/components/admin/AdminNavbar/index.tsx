"use client";

import React from 'react';
import { useState } from 'react';
import Link from 'next/link';

export default function AdminNavbar() {
  const [q, setQ] = useState('');

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur px-4 py-3 border-b">
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button className="lg:hidden p-2 rounded-md bg-slate-100">☰</button>
          <div className="hidden md:block">
            <form onSubmit={(e) => e.preventDefault()} className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search bookings, flights, users..."
                className="w-80 rounded-full border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </form>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-md hover:bg-slate-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118.6 14.6L18 14V9a6 6 0 10-12 0v5l-.6.6a2 2 0 01-1.4.6H4v2h11z"/></svg>
          </button>

          <div className="relative">
            <button className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-slate-100">
              <img src="/images/admin-avatar.png" alt="admin" className="h-8 w-8 rounded-full object-cover" />
              <span className="hidden sm:block text-sm">Admin</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
