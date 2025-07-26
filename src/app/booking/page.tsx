'use client';
import { useState } from 'react';

export default function BookingPage() {
  const [bookingId, setBookingId] = useState('');
  const [booking, setBooking] = useState<null | {
    id: string;
    date: string;
    time_slot: string;
    teacher_slug: string;
    participants: number;
  }>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Use GET with URL parameters instead of POST
      const res = await fetch(
        `/api/search-booking?session_id=${encodeURIComponent(bookingId.trim())}`
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch booking');
      }

      const data = await res.json();
      setBooking(data.booking);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Check Your Booking</h1>

      <form onSubmit={handleSearch} className="w-full max-w-sm space-y-4">
        <input
          type="text"
          placeholder="Enter Booking ID (session_id)"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
          className="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search Booking'}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {booking && (
        <div className="mt-8 bg-white p-6 rounded shadow w-full max-w-md text-left">
          <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
          <p>
            <span className="font-medium">Teacher:</span>{' '}
            {booking.teacher_slug || 'Unspecified Teacher'}
          </p>
          <p>
            <span className="font-medium">Date:</span>{' '}
            {new Date(booking.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
          <p>
            <span className="font-medium">Time Slot:</span> {booking.time_slot}
          </p>
          <p>
            <span className="font-medium">Participants:</span>{' '}
            {booking.participants}{' '}
            {Number(booking.participants) === 1 ? 'person' : 'people'}
          </p>
        </div>
      )}
    </div>
  );
}
