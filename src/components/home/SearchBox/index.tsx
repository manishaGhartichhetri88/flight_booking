import Link from 'next/link';

export default function SearchBox() {
  return (
    <section className="rounded-[2rem] bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-end">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-slate-700">
            From
            <input className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400" placeholder="New York" />
          </label>
          <label className="block text-sm text-slate-700">
            To
            <input className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400" placeholder="Los Angeles" />
          </label>
        </div>
        <div className="rounded-[1.5rem] bg-slate-950 p-6 text-white shadow-inner shadow-slate-900/10">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Quick search</p>
          <p className="mt-3 text-lg font-semibold">Find the best route in seconds</p>
          <Link href="/flights" className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300">
            Search flights
          </Link>
        </div>
      </div>
    </section>
  );
}
