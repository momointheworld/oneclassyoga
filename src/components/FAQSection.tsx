import Link from 'next/link';
import Script from 'next/script';

export default function FAQSection() {
  const faqs = [
    {
      q: 'Do I need experience for a private yoga class in Chiang Mai?',
      aDisplay:
        'Not at all! Each teacher offers classes at different levels, and they can adapt the session to your experience and goals. Whether you’re a beginner or an advanced practitioner, you’ll get guidance tailored to you.',
      aSchema:
        'Not at all! Each teacher offers classes at different levels, and they can adapt the session to your experience and goals. Whether you’re a beginner or an advanced practitioner, you’ll get guidance tailored to you.',
    },
    {
      q: 'Where are the yoga classes held?',
      aDisplay: (
        <>
          All classes take place at our{' '}
          <Link href="/location" className="text-blue-600 underline">
            Old Town studio
          </Link>{' '}
          in Chiang Mai. It’s centrally located for easy access, so you don’t
          have to worry about finding a spot. The space is designed to create a
          comfortable and focused environment for your practice.
        </>
      ),
      aSchema:
        'All classes take place at our Old Town studio in Chiang Mai. It’s centrally located for easy access, so you don’t have to worry about finding a spot. The space is designed to create a comfortable and focused environment for your practice.',
    },
    {
      q: 'Are your yoga teachers certified?',
      aDisplay:
        'Yes! All teachers featured here are certified and bring years of experience. Each one has been carefully chosen for their quality of teaching and ability to create meaningful, personalized sessions.',
      aSchema:
        'Yes! All teachers featured here are certified and bring years of experience. Each one has been carefully chosen for their quality of teaching and ability to create meaningful, personalized sessions.',
    },
    {
      q: 'How do I book a private yoga class?',
      aDisplay:
        'Booking is simple: choose a teacher, pick a time, and confirm online. This hassle-free process lets teachers focus on giving you a high-quality, personalized class.',
      aSchema:
        'Booking is simple: choose a teacher, pick a time, and confirm online. This hassle-free process lets teachers focus on giving you a high-quality, personalized class.',
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.aSchema,
      },
    })),
  };

  return (
    <>
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6 text-center">FAQ</h2>
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="pb-4">
              <h3 className="font-semibold text-lg">{faq.q}</h3>
              <p className="text-gray-600 mt-2">- {faq.aDisplay}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          <span className="block sm:inline">Have more questions?</span>{' '}
          <span className="block sm:inline">
            Visit our{' '}
            <Link href="/community" className="text-blue-600 underline">
              Community Q&A
            </Link>
          </span>
        </p>
      </div>

      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
