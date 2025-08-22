// app/booking/success/page.tsx
import BookingSuccessClient from './BookingSuccessClient';

export const metadata = {
  title: 'Booking Confirmed | OneClass Yoga',
  description:
    'Your yoga class booking is confirmed! Check your class details and contact us for any questions.',
  openGraph: {
    title: 'Booking Confirmed | OneClass Yoga',
    description:
      'Your yoga class booking is confirmed! Check your class details and contact us for any questions.',
    url: 'https://oneclass.yoga/booking/success',
    type: 'website',
    images: ['https://oneclass.yoga/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Booking Confirmed | OneClass Yoga',
    description:
      'Your yoga class booking is confirmed! Check your class details and contact us for any questions.',
    images: ['https://oneclass.yoga/og-image.png'],
  },
};

export default function BookingSuccessPage() {
  return <BookingSuccessClient />;
}
