"use client";

import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setSent(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-6 py-10 lg:px-16 flex items-center">
      <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-slate-900">Forgot password</h1>
        <p className="mt-3 text-slate-600">Enter your email and we’ll send a reset link.</p>

        {sent ? (
          <div className="mt-6 rounded-lg bg-green-50 p-4 text-sm text-green-800">Check your inbox — we sent a reset link if the email exists.</div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:ring-2 focus:ring-indigo-200" />
            </div>
            <button type="submit" disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-4 py-3 text-sm font-semibold text-white shadow disabled:opacity-60">
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
