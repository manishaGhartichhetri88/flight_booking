'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

export default function PassengerForm({ index, seat }: { index: number; seat?: any }) {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState('Adult');

  const useAccountDetails = async () => {
    try {
      const cached = localStorage.getItem('me');
      if (cached) {
        const u = JSON.parse(cached);
        setName(u.name || '');
        setEmail(u.email || '');
        setPhone(u.phone || '');
        return;
      }
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Sign in to use your account details');
        return;
      }
      const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(api + '/auth/me', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) {
        alert('Unable to fetch account details');
        return;
      }
      const j = await res.json();
      const u = j.user || {};
      setName(u.name || '');
      setEmail(u.email || '');
      setPhone(u.phone || '');
      try { if (u) localStorage.setItem('me', JSON.stringify(u)); } catch(e){}
    } catch (e) {
      alert('Failed to load account details');
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const passenger = { name, email, phone, type };
    try {
      const existingRaw = localStorage.getItem('passengers');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      existing[index] = passenger;
      localStorage.setItem('passengers', JSON.stringify(existing));
      setSubmitted(true);
    } catch (e) {
      console.error(e);
      localStorage.setItem('passengers', JSON.stringify([passenger]));
      setSubmitted(true);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Passenger details {typeof index === 'number' ? `#${index + 1}` : ''}</h2>
          <p className="mt-2 text-sm text-slate-600">Fill in your traveler information to continue.</p>
          {seat && <p className="mt-1 text-sm text-slate-500">Seat: {seat.id || `${seat.row}${seat.column}`}</p>}
        </div>
        <div className="flex items-center gap-3">
          <Button type="button" variant="secondary" onClick={useAccountDetails}>Use my account details</Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-slate-700">
            Full name
            <Input required placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="block text-sm text-slate-700">
            Email address
            <Input type="email" required placeholder="jane@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-slate-700">
            Phone number
            <Input type="tel" required placeholder="+1 555 123 4567" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>
          <label className="block text-sm text-slate-700">
            Passenger type
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              <option>Adult</option>
              <option>Child</option>
              <option>Infant</option>
            </Select>
          </label>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button type="submit">Save passenger details</Button>
          {submitted ? (
            <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">Details saved</span>
          ) : (
            <span className="text-sm text-slate-500">Your details are not yet saved.</span>
          )}
        </div>
      </form>
    </section>
  );
}
