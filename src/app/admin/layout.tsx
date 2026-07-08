"use client";

import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminNavbar from '@/components/admin/AdminNavbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AdminNavbar />
      <div className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-2">
          <AdminSidebar />
        </div>

        <div className="col-span-12 lg:col-span-10">
          {children}
        </div>
      </div>
    </div>
  );
}
