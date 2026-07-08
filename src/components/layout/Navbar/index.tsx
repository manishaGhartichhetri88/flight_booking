"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Avatar from '../Avatar';

export default function Navbar() {
  const [user, setUser] = useState<{ name?: string; email?: string; photos?: string[] } | null>(null);
  const router = useRouter();

  const fetchUser = async () => {
    // prefer cached user
    try {
      const cached = localStorage.getItem('me');
      if (cached) {
        setUser(JSON.parse(cached));
        return;
      }
    } catch (e) {}
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(api + '/auth/me', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) {
        setUser(null);
        return;
      }
      const j = await res.json();
      setUser(j.user || null);
      try { if (j.user) localStorage.setItem('me', JSON.stringify(j.user)); } catch(e){}
    } catch (e) {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'token') fetchUser();
    };
    const onAuthChanged = () => fetchUser();
    window.addEventListener('storage', onStorage);
    window.addEventListener('authChanged', onAuthChanged);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('authChanged', onAuthChanged);
    };
  }, []);

  const signOut = () => {
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('authChanged'));
    setUser(null);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-0">
        <Link href="/" className="text-xl font-semibold text-slate-900">FlightBook</Link>
        <div className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium text-slate-700 hover:text-slate-900">Home</Link>
          <Link href="/flights" className="text-sm font-medium text-slate-700 hover:text-slate-900">Flights</Link>
          <Link href="/about" className="text-sm font-medium text-slate-700 hover:text-slate-900">About</Link>
          <Link href="/contact" className="text-sm font-medium text-slate-700 hover:text-slate-900">Contact</Link>
          {user ? (
            <Avatar name={user.name} email={user.email} photo={user.photos?.[0]} size="md" />
          ) : (
            <Link href="/login" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50">Sign in</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
