import { Metadata } from 'next';
import Pricing from './pricing';

export const metadata: Metadata = {
  title: 'Chiang Mai Yoga Classes Pricing | OneClass Yoga',
  description:
    'Compare private 1-on-1 yoga class rates in Chiang Mai. Explore single sessions, bundle options, and experienced yoga teachers. Book your first class online now!',
  openGraph: {
    title: 'Chiang Mai Yoga Classes Pricing | OneClass Yoga',
    description:
      'Compare private 1-on-1 yoga class rates in Chiang Mai. Explore single sessions, bundle options, and experienced yoga teachers. Book your first class online now!',
    url: 'https://oneclass.yoga/pricing',
    siteName: 'OneClass Yoga',
    images: [
      {
        url: 'https://oneclass.yoga/logos/pricing-og-image.png',
        width: 1200,
        height: 630,
        alt: 'Yoga class pricing and packages in Chiang Mai',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chiang Mai Yoga Classes Pricing | OneClass Yoga',
    description:
      'Compare private 1-on-1 yoga class rates in Chiang Mai. Explore single sessions, bundle options, and experienced yoga teachers. Book your first class online now!',
    images: ['https://oneclass.yoga/logos/pricing-og-image.png'],
  },
};

export const revalidate = 60; // cache for 60 seconds

export default function PricingPage() {
  return <Pricing />;
}
