"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      router.push('/profile');
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  const passwordsMatch = password && confirm && password === confirm;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name) return setError('Please enter your name');
    if (!email) return setError('Please enter your email');
    // Nepal phone validation: require exactly 10 digits (local format)
    const digits = (mobile || '').replace(/\D/g, '');
    if (!digits || digits.length !== 10) return setError('Please enter a valid 10-digit Nepal mobile number');
    const normalizedMobile = digits; // store as plain 10-digit number
    if (!password) return setError('Please choose a password');
    if (!passwordsMatch) return setError('Passwords do not match');
    setLoading(true);
    try {
      const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(api + '/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, mobile: normalizedMobile }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(j.message || j.error || 'Registration failed');
        setLoading(false);
        return;
      }
      // success: show message and allow user to go to login
      setLoading(false);
      try {
        sessionStorage.setItem('registeredCredentials', JSON.stringify({ email, password }));
        sessionStorage.setItem('registeredProfile', JSON.stringify({ name, email, mobile: normalizedMobile }));
      } catch (e) {}
      setShowSuccess(true);
    } catch (e) {
      setLoading(false);
      setError('Registration failed');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-6 py-10 lg:px-16 flex items-center">
      <div className="mx-auto w-full max-w-3xl rounded-3xl bg-white shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:block bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400 p-8 text-white">
          <h2 className="text-2xl font-bold">Join FlyAway</h2>
          <p className="mt-4 text-sm opacity-90">Create an account to unlock member-only offers and faster booking.</p>
        </div>

        <div className="p-8">
          <h1 className="text-2xl font-semibold text-slate-900">Create account</h1>
          <p className="mt-2 text-sm text-slate-600">Quick sign up — it only takes a minute.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:ring-2 focus:ring-pink-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Mobile number</label>
              <input value={mobile} onChange={(e) => setMobile(e.target.value)} type="tel" placeholder="+977 98xxxxxxxx" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:ring-2 focus:ring-pink-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:ring-2 focus:ring-pink-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:ring-2 focus:ring-pink-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Confirm password</label>
              <input value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:ring-2 focus:ring-pink-200" />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button type="submit" disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 px-4 py-3 text-sm font-semibold text-white shadow hover:opacity-95 disabled:opacity-60">
              {loading ? 'Creating...' : 'Register'}
            </button>
          </form>

          {showSuccess && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/40" onClick={() => setShowSuccess(false)} />
              <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
                <h2 className="text-lg font-semibold">Registration successful</h2>
                <p className="mt-2 text-sm text-slate-600">Your account has been created. Click below to sign in.</p>
                <div className="mt-4 flex justify-end gap-2">
                  <button onClick={() => setShowSuccess(false)} className="rounded-2xl border px-3 py-2">Close</button>
                  <button onClick={() => router.push('/login')} className="rounded-2xl bg-pink-500 px-3 py-2 text-white">Go to sign in</button>
                </div>
              </div>
            </div>
          )}

          <p className="mt-4 text-sm text-slate-600">
            Already have an account? <Link href="/login" className="font-semibold text-pink-600 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
