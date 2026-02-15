// src/app/booking/checkout/page.tsx
import { Suspense } from 'react';
import ReviewClient from './ReviewClient';
import { getTranslations } from 'next-intl/server';

export default async function ReviewPage() {
  const t = await getTranslations('Review');
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      }
    >
      {' '}
      <ReviewClient />
    </Suspense>
  );
}
