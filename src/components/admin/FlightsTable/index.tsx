"use client";

import { useEffect, useState } from 'react';
import { flights as initialFlights } from '@/lib/flights';

type FlightState = Record<string, any> & { status?: 'on-time' | 'delayed' | 'cancelled' };

export default function FlightsTable() {
  const [rows, setRows] = useState<FlightState[]>(() => initialFlights.map((f) => ({ ...f, status: 'on-time' })));

  useEffect(() => {
    const loadFlights = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      try {
        const response = await fetch(`${apiUrl}/flights`);
        if (!response.ok) return;
        const data = await response.json();
        if (Array.isArray(data) && data.length) {
          setRows(
            data.map((flight: any, index: number) => ({
              ...flight,
              id: flight._id || flight.id || `flight-${index + 1}`,
              airline: flight.airline || flight.company || 'Flight',
              flightNumber: flight.flightNumber || flight.flight_no || `FL-${index + 1}`,
              from: flight.from || flight.origin || 'Unknown',
              to: flight.to || flight.destination || 'Unknown',
              timetable: flight.timetable || flight.departure || 'TBA',
              price: flight.price || flight.cost || 'TBA',
              status: 'on-time',
            }))
          );
        }
      } catch (error) {
        console.error('Unable to load flights', error);
      }
    };

    loadFlights();
  }, []);

  const toggleCancel = (id: string) => {
    setRows((r) => r.map((f) => (f.id === id ? { ...f, status: f.status === 'cancelled' ? 'on-time' : 'cancelled' } : f)));
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="text-left text-slate-500">
          <tr>
            <th className="pb-2">Flight</th>
            <th className="pb-2">Route</th>
            <th className="pb-2">Departure</th>
            <th className="pb-2">Price</th>
            <th className="pb-2">Status</th>
            <th className="pb-2">Actions</th>
          </tr>
        </thead>
        <tbody className="text-slate-700">
          {rows.map((f) => (
            <tr key={f.id} className="border-t">
              <td className="py-3">{f.airline} <div className="text-xs text-slate-500">{f.flightNumber}</div></td>
              <td className="py-3">{f.from} → {f.to}</td>
              <td className="py-3">{f.timetable}</td>
              <td className="py-3">{f.price}</td>
              <td className="py-3">
                <span className={`inline-block rounded px-2 py-1 text-xs ${f.status === 'on-time' ? 'bg-emerald-100 text-emerald-700' : f.status === 'delayed' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{f.status}</span>
              </td>
              <td className="py-3">
                <button onClick={() => toggleCancel(f.id)} className="mr-2 rounded bg-slate-100 px-3 py-1 text-xs">{f.status === 'cancelled' ? 'Reinstate' : 'Cancel'}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
