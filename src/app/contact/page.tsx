import type { Metadata } from 'next';
import ContactPage from './ContactPage';

export const metadata: Metadata = {
  title: 'Contact Us | OneClass Yoga Chiang Mai',
  description:
    'Have questions about private or small group yoga classes in Chiang Mai? Reach out to OneClass Yoga through our contact form and we’ll get back to you quickly.',
  openGraph: {
    title: 'Contact Us | OneClass Yoga Chiang Mai',
    description:
      'Get in touch with OneClass Yoga for questions about private or small group classes in Chiang Mai. Fill out our contact form and we’ll respond promptly.',
    url: 'https://oneclass.yoga/contact', // replace with your actual page URL
    siteName: 'OneClass Yoga',
    images: [
      {
        url: 'https://oneclass.yoga/logos/contact-og-image.png', // social preview image
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
      'Reach out to OneClass Yoga for private or small group yoga classes in Chiang Mai. Fill out our contact form to get in touch.',
    images: ['https://oneclass.yoga/logos/contact-og-image.png'],
  },
};

export default function ContactLayout() {
  return <ContactPage />;
}
