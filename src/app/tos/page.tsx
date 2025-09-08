import { PageContainer } from '@/components/PageContainer';
import { Metadata } from 'next';

export const cache = 'force-cache';

export const metadata: Metadata = {
  title: 'Terms of Service | OneClass',
  description:
    'Read the Terms of Service for OneClass — including booking, payments, cancellations, rescheduling, class locations, and equipment policies.',
  openGraph: {
    title: 'Terms of Service | OneClass',
    description:
      'Understand our policies on bookings, payments, cancellations, rescheduling, and class locations.',
    url: 'https://oneromeo.com/tos',
    siteName: 'OneClass',
    images: [
      {
        url: 'https://oneromeo.com/logos/og-image.png',
        width: 1200,
        height: 630,
        alt: 'OneClass Terms of Service',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service | OneClass',
    description:
      'Review the OneClass Terms of Service, including booking and cancellation policies.',
    images: ['https://oneromeo.com/images/logos/og-image.png'],
  },
  alternates: {
    canonical: 'https://oneromeo.com/tos',
  },
};

export default function TermsPage() {
  return (
    <PageContainer>
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

      <p className="mb-4">
        Please read these Terms of Service (&quot;Terms&quot;) carefully before
        using our website and services.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Acceptance of Terms</h2>
      <p className="mb-4">
        By accessing or using our services, you agree to be bound by these
        Terms. If you do not agree, please do not use our site.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Booking and Payments</h2>
      <p className="mb-4">
        All bookings and payments are processed securely through Stripe. You
        agree to provide accurate information during checkout.
      </p>
      <p className="mb-4">
        Payment confirmation is required to secure your booking slot. We are not
        responsible for missed sessions due to payment issues.
      </p>
      <p className="mb-4">
        <strong>Studio, yoga mat, and props</strong> are included in your
        payment.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Cancellation and Rescheduling Policy
      </h2>

      <p className="mb-4">
        All bookings are <strong>non-refundable</strong>. However, you may
        reschedule or transfer your class to another person under the conditions
        below.
      </p>

      <ul className="list-disc ml-6 mb-4">
        <li>
          Rescheduling is allowed up to <strong>24 hours before</strong> the
          class.
        </li>
        <li>
          You may transfer your booking to another person with prior notice.
        </li>
        <li>
          <strong>No rescheduling or transfers</strong> are allowed for late
          cancellations, no-shows, or arrivals more than 30 minutes late.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">User Conduct</h2>
      <p className="mb-4">
        You agree to use the services responsibly and respectfully. Any abusive,
        harmful, or illegal behavior may result in termination of service
        without refund.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Limitation of Liability
      </h2>
      <p className="mb-4">
        We provide services &quot;as is&quot; and are not liable for any
        indirect, incidental, or consequential damages arising from your use of
        the site.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to Terms</h2>
      <p className="mb-4">
        We may update these Terms periodically. Continued use of the site after
        changes means you accept the updated Terms.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
      <p>
        If you have questions about these Terms, please{' '}
        <a href="/contact" className="text-emerald-600 underline">
          contact us
        </a>
        .
      </p>
    </PageContainer>
  );
}
