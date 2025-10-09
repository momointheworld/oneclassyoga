// src/app/booking/checkout/page.tsx
import { Suspense } from 'react';
import CheckoutClient from './CheckoutClient';

export default function CheckoutPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600">Preparing your checkout...</p>
          </div>
        }
      >
        <CheckoutClient />
      </Suspense>
    </div>
  );
}
