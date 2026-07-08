const destinations = ['New York', 'London', 'Paris', 'Tokyo', 'Dubai', 'Sydney'];

export default function PopularDestinations() {
  return (
    <section className="rounded-[2rem] bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Popular destinations</h2>
          <p className="mt-2 text-sm text-slate-500">Discover trending routes with great fares.</p>
        </div>
        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Updated daily</span>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {destinations.map((destination) => (
          <div key={destination} className="rounded-[1.5rem] bg-slate-50 p-6 text-center shadow-sm transition hover:-translate-y-1 hover:bg-slate-100">
            <p className="text-lg font-semibold text-slate-900">{destination}</p>
            <p className="mt-2 text-sm text-slate-600">Best deals this week</p>
          </div>
        ))}
      </div>
    </section>
  );
}
