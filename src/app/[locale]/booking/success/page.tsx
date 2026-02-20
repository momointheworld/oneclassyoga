// app/booking/success/page.tsx
import { Suspense } from 'react';
import BookingSuccessClient from './BookingSuccessClient';
import { useTranslations } from 'next-intl';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params; // Await the promise
  const t = await getTranslations({
    locale,
    namespace: 'Booking.BookingSuccess.metaData',
  });

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: 'https://oneclass.yoga/booking',
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

export default function BookingSuccessPage() {
  const t = useTranslations('Booking.BookingSuccess');
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">{t('redirecting')}</p>
        </div>
      }
    >
      <BookingSuccessClient />
    </Suspense>
  );
}
