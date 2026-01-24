'use client';

import Script from 'next/script';
import { useTranslations } from 'next-intl';

export default function BookingSteps() {
  const t = useTranslations('Home.Process');

  // We define the keys to iterate through the translations
  const stepKeys = ['step1', 'step2', 'step3'] as const;

  const steps = stepKeys.map((key) => ({
    title: t(`steps.${key}.title`),
    desc: t(`steps.${key}.desc`),
  }));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: t('schema.name'),
    description: t('schema.description'),
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
            className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-8 bg-emerald-50 text-emerald-600 rounded-full flex items-center border border-emerald-100 justify-center font-bold mb-4">
              {idx + 1}
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 min-h-[3.5rem] flex h-15">
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
