import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/flight_booking';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Cached connection across hot reloads in development.
 */
const globalAny = global as any;
let cached: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } = globalAny._mongoose || { conn: null, promise: null };
if (!globalAny._mongoose) {
  globalAny._mongoose = cached;
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
