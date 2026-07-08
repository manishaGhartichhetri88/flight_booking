export default function Offers() {
  return (
    <section className="rounded-[2rem] bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Limited-time offers</h2>
          <p className="mt-2 text-sm text-slate-600">Save on select routes today.</p>
        </div>
        <div className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">Up to 30% off</div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl bg-slate-50 p-6">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">New York → LAX</p>
          <p className="mt-3 text-xl font-semibold text-slate-900">From Rs 299</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-6">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">London → Dubai</p>
          <p className="mt-3 text-xl font-semibold text-slate-900">From Rs 420</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-6">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Paris → Tokyo</p>
          <p className="mt-3 text-xl font-semibold text-slate-900">From Rs 760</p>
        </div>
      </div>
    </section>
  );
}
