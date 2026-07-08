import { flights } from '@/lib/flights';
import FlightCard from '../FlightCard';

export default function FlightList() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {flights.map((flight) => (
        <FlightCard key={flight.id} flight={flight} />
      ))}
    </div>
  );
}
