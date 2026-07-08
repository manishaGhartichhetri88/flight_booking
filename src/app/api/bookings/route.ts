import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongo';
import Booking from '@/models/bookingModel';
import { v4 as uuidv4 } from 'uuid';

function genBookingRef() {
  const date = new Date();
  const y = date.getFullYear().toString();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const suffix = uuidv4().split('-')[0].toUpperCase();
  return `FLT-${y}${m}${d}-${suffix}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || !body.flightId || !body.passengers) {
      return NextResponse.json({ error: 'flightId and passengers are required' }, { status: 400 });
    }

    await connectToDatabase();

    const bookingId = genBookingRef();

    const bookingDoc = new Booking({
      bookingId,
      passengers: body.passengers,
      flightId: body.flightId,
      flightNumber: body.flightNumber || body.flightId,
      from: body.from || body.origin || 'Unknown',
      to: body.to || body.dest || 'Unknown',
      departureAt: body.departureAt ? new Date(body.departureAt) : new Date(),
      arrivalAt: body.arrivalAt ? new Date(body.arrivalAt) : undefined,
      seat: body.seat || null,
      gate: body.gate || null,
      status: body.status || 'confirmed',
    });

    const saved = await bookingDoc.save();

    return NextResponse.json({ bookingId: saved.bookingId }, { status: 201 });
  } catch (err: any) {
    console.error('Create booking error', err);
    return NextResponse.json({ error: err.message || 'Failed to create booking' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const bookingId = url.searchParams.get('bookingId');
    if (!bookingId) return NextResponse.json({ error: 'bookingId required' }, { status: 400 });

    await connectToDatabase();
    const booking = await Booking.findOne({ bookingId }).lean();
    if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ booking });
  } catch (err: any) {
    console.error('Fetch booking error', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch booking' }, { status: 500 });
  }
}
