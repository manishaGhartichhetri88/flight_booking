"use client";

import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminNavbar from '@/components/admin/AdminNavbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AdminNavbar />
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[232px_minmax(0,1fr)]">
        <div className="min-w-0">
          <AdminSidebar />
        </div>

        <div className="min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
