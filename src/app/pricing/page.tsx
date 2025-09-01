// app/pricing/page.tsx

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/PageContainer';
import { Badge } from '@/components/ui/badge';

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

const pricingOptions = [
  {
    id: 'single',
    title: 'Single Session',
    description: 'Enjoy a hassle-free yoga session guided by your teacher!',
    friendNote: 'Bring a friend for just +500฿ — mats & props included!',
    price: '2,300 THB',
    badge: null,
    badgeVariant: undefined,
  },
  {
    id: 'bundle5',
    title: 'Bundle of 5',
    description:
      'Save 1,000฿ vs single sessions! Perfect for regular practice.',
    friendNote:
      'Share the joy & save together! Add a friend for only +400฿ per class!',
    price: '9,500 THB',
    badge: 'Most Popular',
    badgeVariant: 'destructive',
  },
  {
    id: 'bundle10',
    title: 'Bundle of 10',
    description: 'Biggest savings — 3,200฿ off singles! Commit to your growth.',
    friendNote: 'Double the fun! Add a friend for just +400฿ per class!',
    price: '18,000 THB',
    badge: 'Best Value',
    badgeVariant: 'secondary',
  },
];

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
          {pricingOptions.map((option) => (
            <div
              key={option.id}
              className={`relative flex flex-col justify-between border rounded-xl p-6 shadow text-center hover:shadow-lg transition ${
                option.id === 'bundle5' ? 'bg-blue-50' : ''
              }`}
            >
              {option.badge && (
                <Badge
                  className={`
        absolute top-2 right-2 text-xs px-2 py-1 rounded-full
        ${option.id === 'bundle5' ? 'bg-orange-500 text-white' : ''}
        ${option.id === 'bundle10' ? 'bg-green-500 text-white' : ''}
        ${option.id === 'single' ? 'bg-gray-300 text-gray-800' : ''}
      `}
                >
                  {option.badge}
                </Badge>
              )}

              <div>
                <h2 className="text-xl font-semibold my-2">{option.title}</h2>
                <p className="text-2xl font-bold mb-2">{option.price}</p>
                <p className="mb-2 text-sm text-gray-700">
                  {option.description}
                </p>
                <p className="text-sm text-gray-500">{option.friendNote}</p>
              </div>

              <div className="flex justify-center mt-4">
                <Link href="/teachers" passHref>
                  <Button
                    variant="default"
                    className={`text-sm font-medium px-4 py-2 rounded-xl transition bg-emerald-600 text-white hover:bg-emerald-700`}
                  >
                    Pick a Teacher Now
                  </Button>
                </Link>
              </div>
            </div>
          ))}
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
