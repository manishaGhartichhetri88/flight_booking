import { NextResponse } from 'next/server';
import { flights } from '@/lib/flights';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const originCountry = url.searchParams.get('originCountry') ?? undefined;

    const filtered = flights.filter((flight) => {
      if (!originCountry) return true;
      return flight.originCountry?.toLowerCase() === originCountry.toLowerCase();
    });

    return NextResponse.json({ data: filtered });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load flights' }, { status: 500 });
  }
}
