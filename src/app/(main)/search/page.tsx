import React, { Suspense } from 'react';
import SearchPageClient from './SearchPageClient';

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen px-6 py-10 lg:px-16">Loading search...</div>}>
      <SearchPageClient />
    </Suspense>
  );
}
