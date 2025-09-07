import Script from 'next/script';

export default function BookingSteps() {
  const steps = [
    {
      title: '1. Pick Your Ideal Yoga Teacher',
      desc: 'I’ve personally handpicked experienced yoga teachers in Chiang Mai who offer exceptional guidance and create meaningful experiences. Browse our curated list to find the teacher who resonates with you.',
    },
    {
      title: '2. Schedule Your First Private Session',
      desc: 'Booking is simple and flexible. Select a time that fits your schedule, and your session will take place at our studio—no extra fuss. You can also share the class with a friend for a more enjoyable experience and savings.',
    },

    {
      title: '3. Experience Your 1-on-1 Yoga Class',
      desc: 'Step into your private session and enjoy guidance tailored to your level, goals, and needs. Each teacher brings their expertise and passion, ensuring you feel supported, challenged, and inspired throughout your practice.',
    },
  ];
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Book a Private Yoga Class in Chiang Mai',
    description:
      'Follow these personalized steps to book a private yoga session with carefully selected, certified instructors in Chiang Mai.',
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      text: step.desc,
    })),
  };

  return (
    <>
      <div className="grid gap-8 md:grid-cols-3">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="p-6 bg-white rounded-2xl shadow border border-gray-100 text-left"
          >
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-600">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* SEO Schema Markup */}
      <Script
        id="howto-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
