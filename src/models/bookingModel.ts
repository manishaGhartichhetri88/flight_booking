import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  bookingId: string;
  passengers: Array<Record<string, any>>;
  flightId: string;
  flightNumber?: string;
  from: string;
  to: string;
  departureAt: Date;
  arrivalAt?: Date;
  seat?: string;
  gate?: string;
  status: string;
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>({
  bookingId: { type: String, required: true, unique: true },
  passengers: { type: [Schema.Types.Mixed] as any, default: [] },
  flightId: { type: String, required: true },
  flightNumber: { type: String },
  from: { type: String, required: true },
  to: { type: String, required: true },
  departureAt: { type: Date, required: true },
  arrivalAt: { type: Date },
  seat: { type: String },
  gate: { type: String },
  status: { type: String, default: 'confirmed' },
  createdAt: { type: Date, default: () => new Date() },
});

export default (mongoose.models.Booking as mongoose.Model<IBooking>) || mongoose.model<IBooking>('Booking', BookingSchema);
