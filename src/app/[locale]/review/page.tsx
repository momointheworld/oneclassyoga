// src/app/booking/checkout/page.tsx
import { Suspense } from 'react';
import ReviewClient from './ReviewClient';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params; // Await the promise
  const t = await getTranslations({
    locale,
    namespace: 'Review.metaData',
  });

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: 'https://oneclass.yoga/review',
      siteName: 'OneClass Yoga',
      images: [
        {
          url: '/images/ogs/homepage-og.jpeg',
          width: 1200,
          height: 630,
          alt: t('ogAlt'),
        },
      ],
      locale: locale === 'en' ? 'en_US' : locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
    },
  };
}

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
