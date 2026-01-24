// src/app/booking/checkout/page.tsx
import { Suspense } from 'react';
import ReviewClient from './ReviewClient';

export default function ReviewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Loading review...</p>
        </div>
      }
    >
      {' '}
      <ReviewClient />
    </Suspense>
  );
}
