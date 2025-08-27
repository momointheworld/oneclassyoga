// app/pricing/page.tsx

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/PageContainer';

export const metadata = {
  title: 'Yoga Pricing in Chiang Mai | Private Classes & Bundles',
  description:
    'Explore flexible yoga pricing in Chiang Mai. Book single sessions or bundles with up to 3 different teachers. Transparent rates, no hidden fees, perfect for individuals, friends, or family.',
  openGraph: {
    title: 'Yoga Pricing in Chiang Mai | Private Classes & Bundles',
    description:
      'Flexible and transparent yoga pricing in Chiang Mai. Choose single sessions or bundles, explore up to 3 different teachers, and enjoy private classes tailored to your needs.',
    url: 'https://oneclass.yoga/pricing',
    siteName: 'OneClass Yoga',
    images: [
      {
        url: 'https://oneclass.yoga/images/logos/pricing-og-image.png',
        width: 1200,
        height: 630,
        alt: 'Yoga Pricing in Chiang Mai',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yoga Pricing in Chiang Mai | Private Classes & Bundles',
    description:
      'Flexible yoga pricing in Chiang Mai. Single sessions or bundles with up to 3 different teachers. Transparent rates, no hidden fees.',
    images: ['https://oneclass.yoga/images/logos/pricing-og-image.png'],
  },
};

export const revalidate = 60;

export default function PricingPage() {
  return (
    <PageContainer>
      <div className="min-h-screen px-4 flex flex-col items-center bg-white text-gray-900">
        {/* Hero Section */}
        <h1 className="text-3xl sm:text-3xl font-bold mb-4 text-center">
          Transparent & Flexible Yoga Pricing in Chiang Mai
        </h1>
        <p className="text-lg sm:text-xl mb-8 text-center max-w-2xl text-gray-700">
          Enjoy private yoga sessions tailored to your schedule, your level, and
          your goals—no hidden fees, no surprises. Perfect for individuals,
          friends, or family.
        </p>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
          {/* Single Session */}
          <div className="flex flex-col justify-between border rounded-xl p-6 shadow text-center hover:shadow-lg transition">
            <div>
              <h2 className="text-xl font-semibold mb-2">Single Session</h2>
              <p className="text-2xl font-bold mb-2">฿1,250</p>
              <p className="mb-6 text-sm text-gray-700">
                Pick your preferred teacher, choose the perfect date and time,
                and bring up to 5 participants. Add extra friends for just ฿250
                each—great for sharing the experience with loved ones!
              </p>
            </div>
            <div className="flex justify-center">
              <Link href="/teachers" passHref>
                <Button
                  variant="default"
                  className="bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-emerald-700 transition"
                >
                  Pick a Teacher Now
                </Button>
              </Link>
            </div>
          </div>

          {/* 5-Session Bundle */}
          <div className="flex flex-col justify-between border rounded-xl p-6 shadow text-center bg-blue-50 hover:shadow-lg transition">
            <div>
              <h2 className="text-xl font-semibold mb-2">5-Session Bundle</h2>
              <p className="text-2xl font-bold mb-2">฿6,000</p>
              <p className="mb-6 text-sm text-gray-700">
                Stay consistent and <strong>save ฿250</strong> compared to
                single sessions. Choose up to{' '}
                <strong>3 different teachers</strong> to experience a variety of
                styles and find your perfect fit. Schedule your sessions
                directly with your teachers for maximum flexibility.
              </p>
            </div>
            <div className="flex justify-center">
              <Link
                href={{
                  pathname: '/booking/checkout',
                  query: {
                    priceId: process.env.NEXT_STRIPE_BUNDLE5_PRICE_ID,
                    booking_type: 'bundle',
                  },
                }}
                passHref
              >
                <Button
                  variant="default"
                  className="bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-orange-700 transition"
                >
                  Checkout
                </Button>
              </Link>
            </div>
          </div>

          {/* 10-Session Bundle */}
          <div className="flex flex-col justify-between border rounded-xl p-6 shadow text-center hover:shadow-lg transition">
            <div>
              <h2 className="text-xl font-semibold mb-2">10-Session Bundle</h2>
              <p className="text-2xl font-bold mb-2">฿11,700</p>
              <p className="mb-6 text-sm text-gray-700">
                Commit to your long-term well-being and{' '}
                <strong>save ฿800</strong> compared to single sessions. Choose
                up to <strong>3 different teachers</strong> to explore a range
                of teaching styles and build a dynamic, personalized yoga
                practice.
              </p>
            </div>
            <div className="flex justify-center">
              <Link
                href={{
                  pathname: '/booking/checkout',
                  query: {
                    priceId: process.env.NEXT_STRIPE_BUNDLE10_PRICE_ID,
                    booking_type: 'bundle',
                  },
                }}
                passHref
              >
                <Button
                  variant="default"
                  className="bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-orange-700 transition"
                >
                  Checkout
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ / Contact */}
        <div className="mt-10 text-center">
          <p className="text-md text-gray-700">
            Have questions about our classes or pricing?{' '}
            <Link
              href="/contact"
              className="text-emerald-600 font-medium hover:underline"
            >
              Contact us
            </Link>{' '}
            anytime.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
