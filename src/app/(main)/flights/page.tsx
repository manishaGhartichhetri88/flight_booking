import FlightList from '@/components/flights/FlightList';
import SearchBox from '@/components/home/SearchBox';

export default function FlightsPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10 lg:px-16">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Flight search</p>
              <h1 className="mt-3 text-4xl font-semibold text-slate-900">Search and compare flights</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">Filter by route, date, and class to find the best option for your trip.</p>
            </div>
            <div className="rounded-3xl bg-slate-50 px-5 py-4 text-slate-700">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Best value</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">Save up to 30%</p>
            </div>
          </div>
        </div>

        <SearchBox />
        <FlightList />
      </div>
    </main>
  );
}
