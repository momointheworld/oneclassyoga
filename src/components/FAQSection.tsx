import Link from 'next/link';
import Script from 'next/script';

export default function FAQSection() {
  const faqs = [
    {
      q: 'Are these programs suitable for beginners?',
      aDisplay:
        'Absolutely. We have programs specifically designed for foundations (Yoga Foundations Intensive), while our more technical programs like "The Art of Inversion" are tailored for those looking to progress. Your teacher adapts every session within the program to your specific level and pace.',
      aSchema:
        'Absolutely. We have programs specifically designed for foundations, while technical programs are for progression. Teachers adapt every session to your specific level and pace.',
    },
    {
      q: 'Where do the program sessions take place?',
      aDisplay: (
        <>
          All sessions are held at our{' '}
          <Link
            href="/location"
            className="text-emerald-600 underline font-medium"
          >
            Old Town studio
          </Link>{' '}
          in Chiang Mai. It’s a dedicated, quiet space designed for focused,
          private practice, ensuring you get the most out of your structured
          program.
        </>
      ),
      aSchema:
        'All sessions are held at our Old Town studio in Chiang Mai, a dedicated space for focused private practice.',
    },
    {
      q: 'How are the teachers for these programs selected?',
      aDisplay:
        'Every teacher is handpicked based on their technical expertise and ability to teach structured curriculums. They are all certified professionals with deep experience in their specific niche, ensuring that your program is safe, progressive, and effective.',
      aSchema:
        'Teachers are handpicked based on technical expertise and ability to teach structured curriculums. All are certified professionals with deep experience.',
    },
    {
      q: 'Can I share a program with a friend?',
      aDisplay:
        'Yes! You can book any program and bring a friend to join you. It’s a great way to stay motivated and share the cost. There is only a small additional fee per session for the extra person, which you can select during the booking process.',
      aSchema:
        'Yes, you can share any program with a friend for a small additional fee per session, selectable during booking.',
    },
    {
      q: 'How far in advance should I book my program?',
      aDisplay:
        'Programs can be booked 7 to 30 days in advance. Since these are multi-session paths, booking ahead ensures your preferred teacher and our studio space are available for your entire journey.',
      aSchema:
        'Programs can be booked 7 to 30 days in advance to ensure teacher and studio availability for the multi-session path.',
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
      <div className="mt-12 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center text-gray-900">
          Common Questions
        </h2>
        <div className="space-y-8">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="group border-b border-gray-100 pb-6 last:border-0"
            >
              <h3 className="font-bold text-lg text-gray-900 flex items-start gap-3">
                <span className="text-emerald-500 text-xl font-serif">Q.</span>
                {faq.q}
              </h3>
              <div className="text-gray-600 mt-3 pl-8 leading-relaxed">
                {faq.aDisplay}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-400 text-sm">
          <span className="block sm:inline">
            Still curious about our programs?
          </span>{' '}
          <span className="block sm:inline">
            Join the conversation in our{' '}
            <Link
              href="/community?category=Q%26A"
              className="text-emerald-600 underline font-medium hover:text-emerald-700"
            >
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
