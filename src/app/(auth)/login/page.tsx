"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) return setError('Please enter your email');
    if (!password) return setError('Please enter your password');
    setLoading(true);
    try {
      const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(api + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(j.message || j.error || 'Invalid credentials');
        setLoading(false);
        return;
      }
      if (j.token) {
        localStorage.setItem('token', j.token);
        if (j.user) localStorage.setItem('me', JSON.stringify(j.user));
        // notify navbar/other windows
        window.dispatchEvent(new Event('authChanged'));
      }
      setLoading(false);
      router.push('/');
    } catch (e) {
      setLoading(false);
      setError('Sign in failed');
    }
  };

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      router.push('/profile');
    } else {
      // Load pre-filled credentials if user just registered
      try {
        const saved = sessionStorage.getItem('registeredCredentials');
        if (saved) {
          const obj = JSON.parse(saved);
          if (obj.email) setEmail(obj.email);
          if (obj.password) setPassword(obj.password);
          sessionStorage.removeItem('registeredCredentials');
        }
      } catch (e) {}
      setAuthChecked(true);
    }
  }, [router]);

  // Show loading state while checking authentication
  if (!authChecked) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </main>
    );
  }

  // Redirect authenticated users (this will push to profile)
  if (isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-6 py-10 lg:px-16 flex items-center">
      <div className="mx-auto w-full max-w-3xl rounded-3xl bg-white shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:block bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-full bg-white/20 p-2">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M2 12l18-8-8 18-4-8-6-2z" fill="white" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold">FlyAway</h2>
              <p className="text-sm opacity-90">Flights made vibrant</p>
            </div>
          </div>
          <p className="mt-6 text-sm opacity-90">Welcome back — sign in to manage bookings, payments and more.</p>
        </div>

        <div className="p-8">
          <h1 className="text-2xl font-semibold text-slate-900">LOG IN</h1>
          <p className="mt-2 text-sm text-slate-600">Enter your details to LOG IN.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:ring-2 focus:ring-indigo-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="mt-2 relative">
                <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 outline-none transition focus:ring-2 focus:ring-indigo-200" />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-600">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 rounded border-slate-300" />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-sm font-medium text-indigo-600 hover:underline">Forgot password?</Link>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button type="submit" disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-4 py-3 text-sm font-semibold text-white shadow hover:opacity-95 disabled:opacity-60">
              {loading ? 'Logging in...' : 'LOG IN'}
            </button>
          </form>

          <p className="mt-4 text-sm text-slate-600">
            New here? <Link href="/register" className="font-semibold text-indigo-600 hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
