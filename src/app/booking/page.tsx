'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BookingPage() {
  const searchParams = useSearchParams();
  const teacherSlug = searchParams.get('teacher');
  const priceId = searchParams.get('price');
  const date = searchParams.get('date');
  const timeSlot = searchParams.get('timeSlot');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function createCheckout() {
      if (!priceId || !teacherSlug) {
        setError('Missing booking information');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/stripe', {
          // Updated endpoint
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            priceId,
            selectedTeacherSlug: teacherSlug,
            date,
            timeSlot,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create checkout session');
        }

        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
        }
      } catch (err) {
        console.error('Checkout error:', err);
        setError('Failed to initiate booking. Please try again.');
        setLoading(false);
      }
    }

    createCheckout();
  }, [date, priceId, teacherSlug, timeSlot]);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      {loading && (
        <>
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p>Hang on, you are being redirected to the Stripe payment page...</p>
        </>
      )}
      {error && (
        <>
          <p className="text-red-500">{error}</p>
          <Link href="/teachers" className="text-blue-600 hover:underline">
            Back to teachers
          </Link>
        </>
      )}
    </div>
  );
}
