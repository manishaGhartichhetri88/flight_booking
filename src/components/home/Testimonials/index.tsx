const testimonials = [
  {
    name: 'Mia Chen',
    title: 'Travel planner',
    quote: 'Booking my family trip was simple and fast. The flight experience was excellent.',
  },
  {
    name: 'Carlos Rivera',
    title: 'Frequent flyer',
    quote: 'I loved the route suggestions and transparent pricing. Great app!',
  }
];

export default function Testimonials() {
  return (
    <section className="rounded-[2rem] bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">What travelers say</h2>
          <p className="mt-2 text-sm text-slate-500">Real feedback from recent bookings.</p>
        </div>
        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Trusted worldwide</span>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {testimonials.map((item) => (
          <div key={item.name} className="rounded-[1.5rem] bg-slate-50 p-6 shadow-sm">
            <p className="text-slate-600">“{item.quote}”</p>
            <div className="mt-5">
              <p className="font-semibold text-slate-900">{item.name}</p>
              <p className="text-sm text-slate-500">{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
