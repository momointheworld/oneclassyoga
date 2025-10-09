// src/app/booking/checkout/page.tsx
import { Suspense } from 'react';
import AddBookingClient from './AddBookingClient';

export default function AddBookingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Loading...</p>
        </div>
      }
    >
      {' '}
      <AddBookingClient />
    </Suspense>
  );
}
