import type { Metadata } from 'next';
import ContactPage from './ContactPage';

export const metadata: Metadata = {
  title: 'Contact Us | OneClass Yoga Chiang Mai',
  description:
    'Have questions about private yoga sessions, sharing classes with a friend, or bundle pricing in Chiang Mai? Reach out to OneClass Yoga through our contact form and we’ll respond quickly.',
  openGraph: {
    title: 'Contact Us | OneClass Yoga Chiang Mai',
    description:
      'Get in touch with OneClass Yoga for private sessions, friend-sharing options, or class bundles in Chiang Mai. Fill out our contact form and we’ll get back to you promptly.',
    url: 'https://oneclass.yoga/contact',
    siteName: 'OneClass Yoga',
    images: [
      {
        url: 'https://oneclass.yoga/logos/contact-og-image.png',
        width: 1200,
        height: 630,
        alt: 'Contact OneClass Yoga in Chiang Mai',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | OneClass Yoga Chiang Mai',
    description:
      'Reach out to OneClass Yoga in Chiang Mai for private sessions, sharing with a friend, or bundle options. Fill out our contact form to get in touch.',
    images: ['https://oneclass.yoga/logos/contact-og-image.png'],
  },
};

export default function ContactLayout() {
  return <ContactPage />;
}
