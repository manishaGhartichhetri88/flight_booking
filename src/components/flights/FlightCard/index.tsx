import Image from 'next/image';
import Link from 'next/link';
import Card from '../../ui/Card';
import { CARD_VARIANTS, type CardVariant } from '@/styles/palette';
import type { Flight } from '@/types/flight';

interface FlightCardProps {
  flight: Flight;
}

export default function FlightCard({ flight }: FlightCardProps) {
  const variants = Object.values(CARD_VARIANTS) as CardVariant[];
  const num = parseInt(flight.id.replace(/\D/g, ''), 10) || 0;
  const variant = (variants[num % variants.length] ?? 'teal') as CardVariant;

  return (
    <Link href={`/flight/${flight.id}`} className="group block">
      <Card
        variant={variant}
        title={flight.airline}
        description={flight.timetable}
        className="overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-2xl"
      >
        <div className="relative h-64 w-full">
          <Image
            src={flight.image}
            alt={`${flight.airline} route image`}
            fill
            className="object-cover"
            priority={false}
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/60 to-transparent p-6 text-white">
            <p className="text-sm uppercase tracking-[0.35em]">{flight.from} → {flight.to}</p>
            <h2 className="mt-2 text-3xl font-semibold">{flight.price}</h2>
          </div>
        </div>
        <div className="space-y-4 p-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium">{flight.airline}</p>
            <p className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">{flight.stops}</p>
          </div>
          <p className="text-lg font-semibold">{flight.timetable}</p>
          <p className="text-sm leading-6 opacity-90">{flight.description}</p>
          <div className="flex flex-wrap gap-3 text-xs">
            <span className="rounded-full bg-white/20 px-3 py-1">{flight.duration}</span>
            <span className="rounded-full bg-white/20 px-3 py-1">{flight.rating} ★</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
