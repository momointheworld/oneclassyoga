// app/booking/success/page.tsx
import { Suspense } from 'react';
import BookingSuccessClient from './BookingSuccessClient';

export const metadata = {
  title: 'Booking Confirmed | OneClass Yoga',
  description:
    'Your yoga class booking is confirmed! Check your class details and contact us for any questions.',
};

export default function BookingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Redirecting...</p>
        </div>
      }
    >
      <BookingSuccessClient />
    </Suspense>
  );
}
