import Link from 'next/link';
import Hero from '@/components/home/Hero';
import SearchBox from '@/components/home/SearchBox';
import Offers from '@/components/home/Offers';
import PopularDestinations from '@/components/home/PopularDestinations';
import Testimonials from '@/components/home/Testimonials';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10 lg:px-16">
      <section className="mx-auto max-w-7xl space-y-10">
        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 p-1 shadow-2xl shadow-slate-950/20">
          <div className="rounded-[1.75rem] bg-slate-950 px-8 py-12 md:px-14 md:py-16">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div className="space-y-6">
                <p className="text-sm uppercase tracking-[0.35em] text-sky-300/80">Book flights with confidence</p>
                <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">Travel smarter with one easy flight booking experience.</h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-300">Compare routes, secure the best fares, and manage your trip from search to confirmation in a modern, responsive booking platform.</p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/flights" className="inline-flex items-center justify-center rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300">
                    Browse flights
                  </Link>
                  <Link href="/contact" className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:border-slate-500">
                    Need help?
                  </Link>
                </div>
              </div>
              <div className="space-y-5 rounded-[1.5rem] bg-slate-900/80 p-8 text-slate-100 shadow-2xl shadow-slate-950/30">
                <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Fast search</p>
                <h2 className="mt-3 text-3xl font-semibold">Plan your next trip in minutes</h2>
                <p className="mt-4 text-sm leading-7 text-slate-300">Start with your route, then add passenger details, pay securely, and receive confirmation instantly.</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-950/90 p-4">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Trusted ratings</p>
                    <p className="mt-2 text-2xl font-semibold text-white">4.8/5</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/90 p-4">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Popular routes</p>
                    <p className="mt-2 text-2xl font-semibold text-white">New York → LAX</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-8">
            <Hero />
            <SearchBox />
            <Offers />
          </div>
          <PopularDestinations />
        </div>

        <Testimonials />
      </section>
    </main>
  );
}
