import { PageContainer } from '@/components/PageContainer';

export default function PrivacyPage() {
  return (
    <PageContainer>
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

      <p className="mb-4">
        Your privacy is important to us. This Privacy Policy explains how we
        collect, use, and protect your personal information when you use our
        website and services.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Information We Collect
      </h2>
      <p className="mb-4">
        When you book a session or make a purchase, we collect the following
        information:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Email address</li>
        <li>Full name</li>
        <li>Billing address</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        How We Use Your Information
      </h2>
      <p className="mb-4">We use your information to:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Process your payment securely via Stripe</li>
        <li>Schedule and manage your booked sessions</li>
        <li>Send you booking confirmations and related communications</li>
        <li>Provide customer support</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        How We Protect Your Information
      </h2>
      <p className="mb-4">
        We take your privacy seriously and use industry-standard security
        measures to protect your data. All payment processing is handled
        securely by Stripe, a trusted payment processor.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Sharing Your Information
      </h2>
      <p className="mb-4">
        We do not sell, trade, or rent your personal information to others. Your
        data is only shared with trusted third parties necessary to provide our
        services (such as Stripe).
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights</h2>
      <p className="mb-4">You have the right to:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Access your personal information</li>
        <li>Request correction or deletion of your data</li>
        <li>Opt out of marketing communications</li>
      </ul>
      <p className="mb-4">
        To exercise these rights, please{' '}
        <a href="/contact" className="text-emerald-600 underline">
          contact us
        </a>
        .
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Changes to This Policy
      </h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time. We encourage you to
        review it periodically.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
      <p>
        If you have questions or concerns about your privacy, please{' '}
        <a href="/contact" className="text-emerald-600 underline">
          contact us
        </a>
        .
      </p>
    </PageContainer>
  );
}
