export interface Passenger {
  name: string;
  email?: string;
  phone?: string;
}

export interface BookingPayload {
  flightId: string;
  passengers: Passenger[];
  seat?: string;
}

export interface BookingRecord {
  bookingId: string;
  passengers: Passenger[];
  flightId: string;
  flightNumber?: string;
  from: string;
  to: string;
  departureAt: string;
  arrivalAt?: string;
  seat?: string;
  gate?: string;
  status: string;
  createdAt: string;
}
