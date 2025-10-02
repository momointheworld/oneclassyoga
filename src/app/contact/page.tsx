import type { Metadata } from 'next';
import ContactPage from './ContactPage';

export const metadata: Metadata = {
  title: 'Contact Us | OneClass Yoga Chiang Mai',
  description:
    'Have questions about private yoga sessions, sharing classes with a friend, or bundle pricing in Chiang Mai? Reach out to OneClass Yoga through our contact form and we’ll respond quickly.',
};

export default function ContactLayout() {
  return <ContactPage />;
}
