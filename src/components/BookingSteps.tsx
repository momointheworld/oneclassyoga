import Script from 'next/script';

export default function BookingSteps() {
  const steps = [
    {
      title: 'Pick your path',
      desc: 'Browse the programs I’ve put together based on each teacher’s specific strengths. Whether it’s inversions or foundations, pick the one that matches what you want to learn.',
    },
    {
      title: 'Book your teacher',
      desc: 'Each program is tied to its specialist teacher. Go straight to their calendar to book your first private session. You can also bring a friend to share the practice and the cost.',
    },
    {
      title: 'Practice one-on-one',
      desc: 'Meet for 90-minute sessions tailored entirely to your body. Because it is one-on-one, you actually learn the skill and progress instead of just following a random group flow.',
    },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Book a Yoga Program in Chiang Mai',
    description:
      'Follow these steps to select a structured yoga program and book private sessions with expert instructors in Chiang Mai.',
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
            className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100  flex flex-col items-center text-center hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center border justify-center font-bold mb-4">
              {idx + 1}
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 h-15">
              {step.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
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
