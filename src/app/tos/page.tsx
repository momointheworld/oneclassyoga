import { PageContainer } from '@/components/PageContainer';

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

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Cancellations and Refunds
      </h2>
      <p className="mb-4">
        Cancellation policies may vary. Please check the specific terms for your
        booking. Refunds, if applicable, will be processed according to these
        policies.
      </p>

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
