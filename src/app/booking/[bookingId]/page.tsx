import connectToDatabase from '@/lib/mongo';
import Booking from '@/models/bookingModel';
import BoardingPassCard from '@/components/BoardingPassCard';

interface Params {
  params: { bookingId: string };
}

export default async function BookingPage({ params }: Params) {
  const { bookingId } = params;
  await connectToDatabase();
  const booking = await Booking.findOne({ bookingId }).lean();
  if (!booking) return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="p-6 bg-white rounded shadow">Booking not found</div>
    </main>
  );

  // Pass booking to client component as serialized JSON
  const bookingJson = JSON.parse(JSON.stringify(booking));

  return (
    <main className="min-h-screen px-6 py-10 lg:px-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold mb-6">Digital Boarding Pass</h1>
        {/* BoardingPassCard is a client component so dynamic behavior like printing works */}
        {/* @ts-ignore */}
        <BoardingPassCard booking={bookingJson} />
      </div>
    </main>
  );
}
