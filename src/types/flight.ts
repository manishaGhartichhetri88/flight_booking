export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  seatClass: string;
  baggageAllowance: string;
  boardingTime: string;
  boardingZone: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  departureTerminal: string;
  departureGate: string;
  arrivalTerminal: string;
  arrivalGate: string;
  price: string;
  duration: string;
  stops: string;
  timetable: string;
  rating: number;
  image: string;
  description: string;
  amenities: string[];
  /** ISO country code for the origin (e.g., 'NP' for Nepal) */
  originCountry?: string;
  /** ISO country code for the destination (e.g., 'US' for United States) */
  destinationCountry?: string;
  departureAt?: string;
  arrivalAt?: string | null;
  date?: string;
}
