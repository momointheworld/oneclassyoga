// app/booking/success/page.tsx
import BookingSuccessClient from './BookingSuccessClient';

export const metadata = {
  title: 'Booking Confirmed | OneClass Yoga',
  description:
    'Your yoga class booking is confirmed! Check your class details and contact us for any questions.',
};

export default function BookingSuccessPage() {
  return <BookingSuccessClient />;
}
