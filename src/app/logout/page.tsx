"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.replace('/login');
  }, [router]);

  return (
    <main className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold text-slate-950">Signing out</h1>
      <p className="mt-2 text-sm text-slate-500">Clearing your session and returning to login.</p>
    </main>
  );
}
