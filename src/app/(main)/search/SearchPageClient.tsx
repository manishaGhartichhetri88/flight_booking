"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Fuse from 'fuse.js';
import type { Flight } from '@/types/flight';
import Card from '@/components/ui/Card';
import { flights } from '@/lib/flights';
import FlightCard from '@/components/flights/FlightCard';
import useDebounce from '@/lib/useDebounce';
import { createFuse, highlightMatch } from '@/lib/search';

const PAGE_SIZE = 6;

export default function SearchPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialFrom = searchParams.get('from') ?? '';
  const initialTo = searchParams.get('to') ?? '';
  const initialQ = searchParams.get('q') ?? '';

  const [q, setQ] = useState(initialQ);
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [pageLimit, setPageLimit] = useState(PAGE_SIZE);
  const [nepalFilter, setNepalFilter] = useState<'all' | 'international' | 'domestic'>('all');

  const debouncedQ = useDebounce(q, 250);
  const debouncedFrom = useDebounce(from, 250);
  const debouncedTo = useDebounce(to, 250);

  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    const qs = params.toString();
    router.replace(`/search${qs ? `?${qs}` : ''}`);
  }, [q, from, to, router]);

  const fuse = useMemo(() => createFuse(flights), []);

  const fuzzyResults = useMemo(() => {
    const term = debouncedQ.trim();
    if (!term && !debouncedFrom && !debouncedTo && nepalFilter === 'all') return flights;

    let list = flights.filter((f) => {
      if (debouncedFrom && !f.from.toLowerCase().includes(debouncedFrom.toLowerCase())) return false;
      if (debouncedTo && !f.to.toLowerCase().includes(debouncedTo.toLowerCase())) return false;
      return true;
    });

    if (nepalFilter !== 'all') {
      const nepalCities = ['kathmandu', 'pokhara', 'biratnagar', 'nepalgunj', 'bhairahawa'];
      if (nepalFilter === 'international') {
        list = list.filter((f) => f.originCountry === 'NP' && !nepalCities.some((c) => f.to.toLowerCase().includes(c)));
      } else if (nepalFilter === 'domestic') {
        list = list.filter((f) => f.originCountry === 'NP' && nepalCities.some((c) => f.to.toLowerCase().includes(c)));
      }
    }

    if (!term) return list;

    try {
      const r = new Fuse(list, { keys: ['airline', 'from', 'to', 'description'], threshold: 0.4 });
      return r.search(term).map((s: any) => (s as any).item as Flight);
    } catch (e) {
      return list.filter((f) => {
        const t = term.toLowerCase();
        return (
          f.airline.toLowerCase().includes(t) ||
          f.from.toLowerCase().includes(t) ||
          f.to.toLowerCase().includes(t) ||
          f.description.toLowerCase().includes(t)
        );
      });
    }
  }, [debouncedQ, debouncedFrom, debouncedTo, nepalFilter]);

  const results = fuzzyResults.slice(0, pageLimit);

  const suggestions = useMemo(() => {
    const term = debouncedQ.trim().toLowerCase();
    if (!term) return [];
    const set = new Set<string>();
    for (const f of flights) {
      if (f.airline.toLowerCase().includes(term)) set.add(f.airline);
      if (f.from.toLowerCase().includes(term)) set.add(f.from);
      if (f.to.toLowerCase().includes(term)) set.add(f.to);
    }
    return Array.from(set).slice(0, 6);
  }, [debouncedQ]);

  return (
    <main className="min-h-screen px-6 py-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <Card variant="sunset" title="Search flights" description="Find flights by destination, airline, or keyword">
          <div className="grid gap-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <input
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="From (city or airport)"
                  className="w-full rounded-xl p-3"
                />
              </div>
              <div className="relative flex-1">
                <input
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="To (city or airport)"
                  className="w-full rounded-xl p-3"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700">Nepal departures:</label>
              <select value={nepalFilter} onChange={(e) => setNepalFilter(e.target.value as any)} className="rounded-lg p-2">
                <option value="all">All</option>
                <option value="international">International from Nepal</option>
                <option value="domestic">Domestic (Nepal)</option>
              </select>
            </div>
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by airline, description, or keyword"
                className="w-full rounded-xl p-3"
              />
              {suggestions.length > 0 && (
                <div className="absolute left-0 top-full z-10 mt-2 w-full rounded-xl bg-white/90 p-2 shadow-lg">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => setQ(s)}
                      className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-slate-100"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="mb-3 text-sm text-slate-700">Results — {fuzzyResults.length} flights</p>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((f: Flight) => (
                  <div key={f.id}>
                    <FlightCard flight={f} />
                    <div className="mt-2 text-sm text-slate-700">
                      <div>
                        <span className="font-medium">Route: </span>{' '}
                        {typeof highlightMatch(f.from, debouncedQ) === 'string' ? highlightMatch(f.from, debouncedQ) : highlightMatch(f.from, debouncedQ)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {fuzzyResults.length > results.length && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => setPageLimit((p) => p + PAGE_SIZE)}
                    className="rounded-xl bg-slate-900/90 px-6 py-2 text-white"
                  >
                    Load more
                  </button>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
