import Script from 'next/script';

export default function BookingSteps() {
  const steps = [
    {
      title: '1. Discover Your Ideal Yoga Teacher',
      desc: 'As a long-time yoga practitioner in Chiang Mai, I’ve tried many teachers. I’ve hand-picked only those who offer exceptional guidance and create meaningful experiences. Browse our curated list and find the teacher who resonates with you.',
    },
    {
      title: '2. Schedule Your Private Session',
      desc: 'Booking is simple and flexible. Pick a time and location that suit your lifestyle—studio, home, or park—and secure your personalized yoga session. This process was designed to save you time so you can focus on your practice.',
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
