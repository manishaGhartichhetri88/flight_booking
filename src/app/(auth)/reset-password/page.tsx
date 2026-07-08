"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const getResetErrorMessage = (body: any) => {
    if (body?.error === 'invalid_or_expired_token') {
      return 'This reset link is invalid or has expired. Please request a new password reset link.';
    }

    return body?.message || body?.error || 'Could not reset password';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!token || !email) return setError('Reset link is invalid');
    if (!password) return setError('Please enter a new password');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    if (password !== confirm) return setError('Passwords do not match');

    setLoading(true);
    try {
      const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(api + '/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, password }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(getResetErrorMessage(body));
        return;
      }
      setSuccess(true);
    } catch (e) {
      setError('Could not reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-6 py-10 lg:px-16 flex items-center">
      <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-slate-900">Reset password</h1>
        <p className="mt-3 text-slate-600">Choose a new password for your account.</p>

        {success ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800">Your password has been reset.</div>
            <Link href="/login" className="inline-flex w-full justify-center rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white">
              Go to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">New password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:ring-2 focus:ring-indigo-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Confirm password</label>
              <input value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:ring-2 focus:ring-indigo-200" />
            </div>
            {error && (
              <div className="space-y-2">
                <p className="text-sm text-red-600">{error}</p>
                {error.includes('reset link') && (
                  <Link href="/forgot-password" className="text-sm font-medium text-indigo-600 hover:underline">
                    Request a new reset link
                  </Link>
                )}
              </div>
            )}
            <button type="submit" disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-4 py-3 text-sm font-semibold text-white shadow disabled:opacity-60">
              {loading ? 'Resetting...' : 'Reset password'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-6 py-10 lg:px-16 flex items-center justify-center">
          <p className="text-slate-600">Loading...</p>
        </main>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
