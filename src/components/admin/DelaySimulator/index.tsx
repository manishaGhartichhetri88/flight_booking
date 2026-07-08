"use client";

import { useState } from 'react';
import { flights as initialFlights } from '@/lib/flights';

type Booking = { id: string; name: string; flightId: string; seat: string; status?: string };

const mockBookings: Booking[] = [
  { id: 'b1', name: 'John Doe', flightId: 'f4', seat: '12A', status: 'confirmed' },
  { id: 'b2', name: 'Sara Lee', flightId: 'f4', seat: '8C', status: 'confirmed' },
  { id: 'b3', name: 'Amit Kumar', flightId: 'f5', seat: '3B', status: 'confirmed' }
];

export default function DelaySimulator() {
  const [flightId, setFlightId] = useState<string>(initialFlights[0]?.id ?? '');
  const [minutes, setMinutes] = useState<number>(15);
  const [results, setResults] = useState<Booking[] | null>(null);

  const runSimulation = () => {
    const affected = mockBookings.filter((b) => b.flightId === flightId);
    setResults(affected.map((a) => ({ ...a, status: `delayed +${minutes}m` })));
  };

  return (
    <div>
      <div className="flex gap-2">
        <select value={flightId} onChange={(e) => setFlightId(e.target.value)} className="rounded px-3 py-2 border">
          {initialFlights.map((f) => <option key={f.id} value={f.id}>{f.flightNumber} — {f.from} → {f.to}</option>)}
        </select>
        <input type="number" value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} className="w-24 rounded px-3 py-2 border" />
        <button onClick={runSimulation} className="rounded bg-indigo-600 text-white px-4 py-2">Simulate</button>
      </div>

      <div className="mt-4 text-sm">
        <div className="text-slate-600 mb-2">Affected bookings</div>
        {results ? (
          <ul className="space-y-2">
            {results.length ? results.map((r) => (
              <li key={r.id} className="p-3 rounded bg-amber-50">{r.name} — {r.seat} — <span className="font-medium">{r.status}</span></li>
            )) : <div className="text-slate-500">No bookings affected</div>}
          </ul>
        ) : (
          <div className="text-slate-500">Run the simulator to see affected bookings.</div>
        )}
      </div>
    </div>
  );
}
