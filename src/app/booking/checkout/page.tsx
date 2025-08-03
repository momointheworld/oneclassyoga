'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const teacherSlug = searchParams.get('teacher');
  const priceId = searchParams.get('priceId');
  const timeSlot = searchParams.get('timeSlot');
  const participants = searchParams.get('participants');
  const booking_type = searchParams.get('booking_type');
  const date = searchParams.get('date');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function createCheckout() {
      if (!booking_type) {
        setError(`Missing: a required field, contact support please`);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/stripe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            priceId,
            teacher_slug: teacherSlug,
            time_slot: timeSlot,
            date,
            participants: parseInt(participants || '1', 10), // Default to 1 if not provided
            booking_type,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Checkout failed');
        }

        const data = await response.json();
        if (!data.url) throw new Error('No checkout URL received');
        window.location.href = data.url;
      } catch (err) {
        console.error('Checkout error:', err);
        setError(err instanceof Error ? err.message : 'Checkout failed');
        setLoading(false);
      }
    }

    createCheckout();
  }, [priceId, teacherSlug, timeSlot, date, participants, booking_type]); // More specific dependencies

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      {loading && !error && (
        <>
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p>Please hold on, we are directing you to our checkout page...</p>
        </>
      )}
      {error && (
        <>
          <p className="text-red-500 max-w-md text-center">{error}</p>
          <Link href="/teachers" className="text-blue-600 hover:underline mt-4">
            Back to Teachers
          </Link>
        </>
      )}
    </div>
  );
}
