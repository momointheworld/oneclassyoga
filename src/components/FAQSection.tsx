import Link from 'next/link';
import Script from 'next/script';

export default function FAQSection() {
  const faqs = [
    {
      q: 'Do I need experience for a private yoga class in Chiang Mai?',
      a: 'Not at all! Whether you are a complete beginner or an experienced yogi, our teachers tailor each session to your level and goals. Every instructor here has been selected for their ability to guide students at any stage.',
    },
    {
      q: 'Where are the yoga classes held?',
      a: 'Classes can take place online or in person at a location that suits you in Chiang Mai. Options include a studio, your home, or even a local park—flexible setups that have been tested and recommended by experienced practitioners.',
    },
    {
      q: 'Are your yoga teachers certified?',
      a: 'Yes! All teachers featured here are certified and bring years of experience. Each one has been carefully chosen for their quality of teaching and ability to create meaningful, personalized sessions.',
    },
    {
      q: 'How do I book a private yoga class?',
      a: 'Booking is simple: select a teacher, pick a convenient time, and confirm online. The process is designed to be easy for students while helping local teachers connect with more people.',
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
        text: faq.a,
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
              <p className="text-gray-600 mt-2">- {faq.a}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          Have more questions? Visit our{' '}
          <Link href="/community" className="text-blue-600 underline">
            Community Q&A
          </Link>{' '}
        </p>
      </div>
      {/* SEO FAQ Schema */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
