"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.destinations = exports.flights = void 0;
exports.getFlightById = getFlightById;
exports.flights = [
    {
        id: 'f1',
        airline: 'Skyway Airlines',
        flightNumber: 'SKY 487',
        seatClass: 'Economy',
        baggageAllowance: '1 carry-on + 1 checked bag',
        boardingTime: '07:15',
        boardingZone: 'Zone 2',
        from: 'New York (JFK)',
        to: 'Los Angeles (LAX)',
        departure: 'May 18, 2026 · 08:00',
        arrival: 'May 18, 2026 · 14:15',
        departureTerminal: '4',
        departureGate: '22B',
        arrivalTerminal: '5',
        arrivalGate: '18',
        price: 'Rs 299',
        duration: '6h 15m',
        stops: 'Non-stop',
        timetable: '08:00 - 14:15',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
        originCountry: 'US',
        destinationCountry: 'US',
        description: 'A comfortable coast-to-coast flight with premium snacks and entertainment included.',
        amenities: ['Wi-Fi', 'Meal included', 'Seat selection', 'Priority boarding']
    },
    {
        id: 'f2',
        airline: 'Oceanic Air',
        flightNumber: 'OCA 220',
        seatClass: 'Economy',
        baggageAllowance: '1 carry-on + 1 checked bag',
        boardingTime: '12:40',
        boardingZone: 'Zone 3',
        from: 'London (LHR)',
        to: 'Dubai (DXB)',
        departure: 'June 1, 2026 · 13:20',
        arrival: 'June 1, 2026 · 22:50',
        departureTerminal: '3',
        departureGate: '8',
        arrivalTerminal: '1',
        arrivalGate: '44',
        price: 'Rs 420',
        duration: '7h 30m',
        stops: 'Non-stop',
        timetable: '13:20 - 22:50',
        rating: 4.6,
        // Replaced a 404 Unsplash image URL with a stable alternative
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        originCountry: 'GB',
        destinationCountry: 'AE',
        description: 'Fly in style with extra legroom and an award-winning onboard service.',
        amenities: ['Extra legroom', 'In-flight entertainment', 'Complimentary refreshments']
    },
    {
        id: 'f3',
        airline: 'Aurora Jets',
        flightNumber: 'AUR 101',
        seatClass: 'Premium Economy',
        baggageAllowance: '2 carry-on + 1 checked bag',
        boardingTime: '09:55',
        boardingZone: 'Zone 1',
        from: 'Paris (CDG)',
        to: 'Tokyo (NRT)',
        departure: 'June 15, 2026 · 10:40',
        arrival: 'June 16, 2026 · 06:00',
        departureTerminal: '2',
        departureGate: '5',
        arrivalTerminal: '1',
        arrivalGate: '12',
        price: 'Rs 760',
        duration: '11h 10m',
        stops: '1 stop',
        timetable: '10:40 - 06:00',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80',
        originCountry: 'FR',
        destinationCountry: 'JP',
        description: 'International travel with refined comfort, meals, and seamless connections.',
        amenities: ['Lounge access', 'In-flight dining', 'Checked baggage']
    },
    {
        id: 'f4',
        airline: 'Himalaya Wings',
        flightNumber: 'HIM 900',
        seatClass: 'Economy',
        baggageAllowance: '1 carry-on + 1 checked bag',
        boardingTime: '22:30',
        boardingZone: 'Zone 1',
        from: 'Kathmandu (KTM)',
        to: 'Los Angeles (LAX)',
        departure: 'July 10, 2026 · 02:45',
        arrival: 'July 10, 2026 · 18:00',
        departureTerminal: 'T1',
        departureGate: 'A1',
        arrivalTerminal: '4',
        arrivalGate: '12',
        price: 'Rs 999',
        duration: '17h 15m',
        stops: '1 stop',
        timetable: '02:45 - 18:00',
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1504198458649-3128b932f49b?auto=format&fit=crop&w=1200&q=80',
        description: 'Comfortable international service from Kathmandu to Los Angeles via a short transit.',
        amenities: ['Meal included', 'Extra legroom'],
        originCountry: 'NP',
        destinationCountry: 'US'
    },
    {
        id: 'f5',
        airline: 'Everest Air',
        flightNumber: 'EVA 210',
        seatClass: 'Economy',
        baggageAllowance: '1 carry-on',
        boardingTime: '09:15',
        boardingZone: 'Zone 2',
        from: 'Kathmandu (KTM)',
        to: 'Pokhara (PKR)',
        departure: 'July 11, 2026 · 10:00',
        arrival: 'July 11, 2026 · 10:35',
        departureTerminal: 'Domestic',
        departureGate: 'D3',
        arrivalTerminal: 'Domestic',
        arrivalGate: 'P1',
        price: 'Rs 79',
        duration: '0h 35m',
        stops: 'Non-stop',
        timetable: '10:00 - 10:35',
        rating: 4.2,
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
        description: 'Quick domestic connection between Kathmandu and Pokhara.',
        amenities: ['Carry-on only'],
        originCountry: 'NP',
        destinationCountry: 'NP'
    }
];
function getFlightById(id) {
    return exports.flights.find((flight) => flight.id === id);
}
exports.destinations = [
    {
        name: 'New York',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80'
    },
    {
        name: 'London',
        image: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=900&q=80'
    },
    {
        name: 'Paris',
        image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=900&q=80'
    },
    {
        name: 'Tokyo',
        image: 'https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&w=900&q=80'
    },
    {
        name: 'Kathmandu',
        image: 'https://images.unsplash.com/photo-1505765055589-9a9f67d6a5d3?auto=format&fit=crop&w=900&q=80'
    },
    {
        name: 'Pokhara',
        image: 'https://images.unsplash.com/photo-1508264408153-0c7d3f6b9a7a?auto=format&fit=crop&w=900&q=80'
    },
    {
        name: 'Delhi',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80'
    }
];
