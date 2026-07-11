import Fuse from 'fuse.js';
import React from 'react';
import type { Flight } from '@/types/flight';

export function createFuse(flights: Flight[]) {
  return new Fuse(flights, {
    keys: ['airline', 'from', 'to', 'description'],
    threshold: 0.35,
    ignoreLocation: true,
  });
}

export function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const q = query.trim().toLowerCase();
  if (!q) return text;
  const idx = text.toLowerCase().indexOf(q);
  if (idx === -1) return text;
  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + q.length);
  const after = text.slice(idx + q.length);

  return React.createElement(
    React.Fragment,
    null,
    before,
    React.createElement(
      'mark',
      { className: 'rounded bg-yellow-200/60 px-0.5' },
      match
    ),
    after
  );
}
