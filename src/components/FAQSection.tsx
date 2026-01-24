'use client';

import Link from 'next/link';
import Script from 'next/script';
import { useTranslations } from 'next-intl';

export default function FAQSection() {
  const t = useTranslations('Home.FAQ');

  const faqKeys = [
    'beginners',
    'location',
    'selection',
    'friend',
    'timing',
  ] as const;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqKeys.map((key) => ({
      '@type': 'Question',
      name: t(`questions.${key}.q`),
      acceptedAnswer: {
        '@type': 'Answer',
        text: t(`questions.${key}.aSchema`),
      },
    })),
  };

  return (
    <>
      <div className="mt-12 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center text-gray-900">
          {t('title')}
        </h2>
        <div className="space-y-8">
          {faqKeys.map((key) => (
            <div
              key={key}
              className="group border-b border-gray-100 pb-6 last:border-0"
            >
              <h3 className="font-bold text-lg text-gray-900 flex items-start gap-3">
                <span className="text-emerald-500 text-xl font-serif">Q.</span>
                {t(`questions.${key}.q`)}
              </h3>
              <div className="text-gray-600 mt-3 pl-8 leading-relaxed">
                {t.rich(`questions.${key}.a`, {
                  location: (chunks) => (
                    <Link
                      href="/location"
                      className="text-emerald-600 underline font-medium"
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-400 text-sm">
          <span className="block sm:inline">{t('footerText')}</span>{' '}
          <span className="block sm:inline">
            {t.rich('communityLink', {
              link: () => (
                <Link
                  href="/community?category=Q%26A"
                  className="text-emerald-600 underline font-medium hover:text-emerald-700"
                >
                  {t('communityLabel')}
                </Link>
              ),
            })}
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
