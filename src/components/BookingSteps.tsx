import Script from 'next/script';

export default function BookingSteps() {
  const steps = [
    {
      title: 'Choose the Right Program',
      desc: 'Browse our curated programs designed for specific goals—from mastering inversions to building a solid foundation. Pick the path that matches your current practice level and aspirations.',
    },
    {
      title: 'Select Teacher & Schedule',
      desc: 'Connect with the expert instructor leading your chosen program. Pick a date and time for your first 90-minute session. You can also add a friend to share the practice and the cost.',
    },
    {
      title: 'Begin Your Guided Practice',
      desc: 'Step into our studio for personalized, technical guidance tailored to your body. Each session in your program builds upon the last, ensuring meaningful progress and a safe, inspired practice.',
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
            className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center font-bold mb-4">
              {idx + 1}
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">
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
