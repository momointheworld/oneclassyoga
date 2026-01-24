import ProgramsPageClient from './ProgramPageClient';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Focused Private Programs | Chiang Mai Yoga',
  description:
    'Stop doing random classes and start making progress. One-on-one yoga programs in Chiang Mai designed to help you master specific skills like inversions and foundations.',
  openGraph: {
    title: 'Focused Private Yoga Programs in Chiang Mai',
    description:
      'Master specific yoga skills with 1-on-1 programs built around the unique strengths of Chiang Mai’s best teachers.',
    url: 'https://oneclass.yoga/programs',
    siteName: 'OneClass Yoga',
    images: [
      {
        url: '/images/ogs/programs-og.jpeg',
        width: 1200,
        height: 630,
        alt: 'Focused private yoga programs in Chiang Mai',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Focused Private Programs | Chiang Mai Yoga',
    description:
      'Personalized 1-on-1 paths to master your yoga practice. Built for real progress, not just random flows.',
    images: ['/images/ogs/programs-og.jpeg'],
  },
};

export default function ProgramsPage() {
  return <ProgramsPageClient />;
}
