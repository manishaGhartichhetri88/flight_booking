import Card from '../../ui/Card';

export default function Hero() {
  return (
    <section className="grid gap-8 rounded-[2rem] bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] md:grid-cols-[1.1fr_0.9fr]">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-sky-500">Ready to travel</p>
        <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">Find the best flights with confidence.</h2>
        <p className="mt-4 text-slate-600">Search destinations, compare offers, and book fast using our smart flight booking platform.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Card variant="teal" title="Easy booking" description="Instant flight comparison" />
          <Card variant="sunset" title="Secure checkout" description="Safe payment flow" />
        </div>
      </div>
      <div className="rounded-[1.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-sky-700 p-6 text-white shadow-xl shadow-slate-900/30">
        <div className="h-full rounded-[1.25rem] bg-slate-950/80 p-6">
          <div className="flex flex-col gap-5">
            <div className="rounded-3xl bg-slate-900/90 p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-sky-300/80">Top destination</p>
              <h3 className="mt-3 text-2xl font-semibold">Los Angeles, USA</h3>
              <p className="mt-2 text-sm text-slate-300">Best fares available today.</p>
            </div>
            <div className="rounded-3xl bg-slate-900/90 p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-sky-300/80">Featured route</p>
              <p className="mt-2 text-3xl font-semibold text-white">NYC → LAX</p>
              <p className="mt-3 text-sm text-slate-300">Non-stop service with premium support.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
