'use client';

import { useState, useEffect } from 'react';

interface Seat {
  id: string;
  row: number;
  column: string;
  isAvailable: boolean;
  isSelected: boolean;
  class: 'economy' | 'business' | 'first';
  price: number;
}

interface SeatSelectorProps {
  flightId: string;
  passengerCount: number;
  onSeatsSelect: (seats: Seat[]) => void;
}

const ROWS = 30;
const COLUMNS = ['A', 'B', 'C', 'D', 'E', 'F'];
const BUSINESS_ROWS = 5;

export default function SeatSelector({ flightId, passengerCount, onSeatsSelect }: SeatSelectorProps) {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize seats
    const initSeats: Seat[] = [];
    let seatId = 0;

    for (let row = 1; row <= ROWS; row++) {
      for (const column of COLUMNS) {
        const isBusiness = row <= BUSINESS_ROWS;
        const isAvailable = Math.random() > 0.2; // 80% available

        initSeats.push({
          id: `${row}${column}`,
          row,
          column,
          isAvailable,
          isSelected: false,
          class: isBusiness ? 'business' : 'economy',
          price: isBusiness ? 150 : 50,
        });
        seatId++;
      }
    }

    setSeats(initSeats);
    setLoading(false);
  }, [flightId]);

  const toggleSeat = (seatId: string) => {
    const isCurrentlySelected = selectedSeats.some((s) => s.id === seatId);
    const wouldExceedLimit = !isCurrentlySelected && selectedSeats.length >= passengerCount;

    if (wouldExceedLimit) {
      return;
    }

    setSeats((prevSeats) => {
      const updatedSeats = prevSeats.map((seat) => {
        if (seat.id === seatId && seat.isAvailable) {
          return { ...seat, isSelected: !seat.isSelected };
        }
        return seat;
      });

      // Update selectedSeats based on the new seats state
      const newSelectedSeats = updatedSeats.filter((s) => s.isSelected);
      setSelectedSeats(newSelectedSeats);

      return updatedSeats;
    });
  };

  const clearSelection = () => {
    setSeats((prevSeats) =>
      prevSeats.map((seat) => ({ ...seat, isSelected: false }))
    );
    setSelectedSeats([]);
  };

  const handleConfirm = () => {
    onSeatsSelect(selectedSeats);
  };

  if (loading) {
    return <div className="text-center py-8 text-slate-600">Loading seats...</div>;
  }

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900 mb-2">Select your seats</h2>
      <p className="text-slate-600 mb-6">
        Choose {passengerCount} seat{passengerCount !== 1 ? 's' : ''} for your journey
      </p>

      {/* Seat Legend */}
      <div className="mb-8 flex flex-wrap gap-6">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-slate-200 border border-slate-300" />
          <span className="text-sm text-slate-600">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-slate-400 border border-slate-400" />
          <span className="text-sm text-slate-600">Unavailable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-indigo-600 border border-indigo-600" />
          <span className="text-sm text-slate-600">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-amber-100 border border-amber-300" />
          <span className="text-sm text-slate-600">Business</span>
        </div>
      </div>

      {/* Cockpit */}
      <div className="mb-8 text-center py-3 font-semibold text-slate-600">
        🛩️ COCKPIT
      </div>

      {/* Seats Grid */}
      <div className="mb-8 space-y-2 overflow-x-auto pb-4">
        {Array.from({ length: ROWS }).map((_, rowIdx) => {
          const row = rowIdx + 1;
          return (
            <div key={row} className="flex items-center justify-center gap-2">
              <span className="w-6 text-right text-xs font-medium text-slate-500">{row}</span>
              <div className="flex gap-1">
                {COLUMNS.map((column) => {
                  const seat = seats.find((s) => s.row === row && s.column === column);
                  if (!seat) return null;

                  const isBusiness = seat.class === 'business';
                  const isSelected = selectedSeats.some((s) => s.id === seat.id);

                  return (
                    <button
                      key={seat.id}
                      onClick={() => toggleSeat(seat.id)}
                      disabled={!seat.isAvailable || (isSelected === false && selectedSeats.length >= passengerCount)}
                      className={`
                        h-8 w-8 rounded text-xs font-medium transition
                        ${isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : seat.isAvailable
                            ? isBusiness
                              ? 'bg-amber-100 border border-amber-300 text-slate-900 hover:bg-amber-200'
                              : 'bg-slate-100 border border-slate-300 text-slate-900 hover:bg-slate-200'
                            : 'bg-slate-300 border border-slate-400 text-slate-500 cursor-not-allowed'
                        }
                      `}
                      title={`Seat ${row}${column}${isBusiness ? ' (Business)' : ''} - $${seat.price}`}
                    >
                      {column}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tail */}
      <div className="mb-8 text-center py-3 font-semibold text-slate-600">
        ✈️ TAIL
      </div>

      {/* Selected Seats Summary */}
      {selectedSeats.length > 0 && (
        <div className="mb-6 rounded-2xl bg-indigo-50 p-4 border border-indigo-200">
          <p className="text-sm font-medium text-indigo-900 mb-2">
            Selected seats: <span className="text-lg font-bold">{selectedSeats.map((s) => s.id).join(', ')}</span>
          </p>
          <p className="text-sm text-indigo-700">
            Additional seat fees: <span className="font-semibold">${totalPrice}</span>
          </p>
        </div>
      )}

      {/* Selection Status */}
      <div className="mb-6 rounded-2xl bg-slate-50 p-4 border border-slate-200">
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-slate-900">{selectedSeats.length}</span> of{' '}
          <span className="font-semibold text-slate-900">{passengerCount}</span> seat
          {passengerCount !== 1 ? 's' : ''} selected
        </p>
        <div className="mt-2 h-2 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${(selectedSeats.length / passengerCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={clearSelection}
          className="flex-1 rounded-2xl border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
        >
          Clear selection
        </button>
        <button
          onClick={handleConfirm}
          disabled={selectedSeats.length !== passengerCount}
          className={`
            flex-1 rounded-2xl px-6 py-3 text-sm font-medium text-white transition
            ${selectedSeats.length === passengerCount
              ? 'bg-indigo-600 hover:bg-indigo-700'
              : 'bg-slate-300 cursor-not-allowed'
            }
          `}
        >
          Confirm seats
        </button>
      </div>
    </div>
  );
}
