import Card from '@/components/ui/Card';
import FlightCard from '@/components/flights/FlightCard';

async function fetchFlights(type?: 'international' | 'domestic') {
  const params = new URLSearchParams();
  params.set('originCountry', 'NP');
  if (type) params.set('type', type);
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/flights?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data as any[];
}

export default async function NepalDeparturesPage() {
  const international = await fetchFlights('international');
  const domestic = await fetchFlights('domestic');

  return (
    <main className="min-h-screen px-6 py-10 lg:px-16">
      <div className="mx-auto max-w-6xl space-y-8">
        <Card variant="ocean" title="Departures from Nepal — International" description="Flights departing Kathmandu to international destinations">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {international.map((f: any) => (
              <FlightCard key={f.id} flight={f} />
            ))}
          </div>
        </Card>

        <Card variant="teal" title="Departures from Nepal — Domestic" description="Domestic connections within Nepal">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {domestic.map((f: any) => (
              <FlightCard key={f.id} flight={f} />
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}
