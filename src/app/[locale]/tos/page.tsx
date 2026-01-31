// src/app/[locale]/tos/page.tsx
import { PageContainer } from '@/components/PageContainer';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export const revalidate = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: 'Policies.TermsPage.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `https://oneclass.yoga/${locale}/tos`,
    },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('Policies.TermsPage');

  return (
    <PageContainer>
      <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>

      <p className="mb-4">{t('intro')}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        {t('sections.acceptance.title')}
      </h2>
      <p className="mb-4">{t('sections.acceptance.content')}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        {t('sections.payments.title')}
      </h2>
      <p className="mb-4">{t('sections.payments.content1')}</p>
      <p className="mb-4">{t('sections.payments.content2')}</p>
      <p className="mb-4">
        <strong>{t('sections.payments.includedBold')}</strong>{' '}
        {t('sections.payments.includedText')}
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        {t('sections.policy.title')}
      </h2>
      <p className="mb-4">
        {t.rich('sections.policy.intro', {
          bold: (chunks) => <strong>{chunks}</strong>,
        })}
      </p>

      <ul className="list-disc ml-6 mb-4">
        <li>
          {t.rich('sections.policy.bullet1', {
            bold: (chunks) => <strong>{chunks}</strong>,
          })}
        </li>
        <li>{t('sections.policy.bullet2')}</li>
        <li>
          <strong>{t('sections.policy.bullet3Bold')}</strong>{' '}
          {t('sections.policy.bullet3Text')}
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        {t('sections.conduct.title')}
      </h2>
      <p className="mb-4">{t('sections.conduct.content')}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        {t('sections.liability.title')}
      </h2>
      <p className="mb-4">{t('sections.liability.content')}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        {t('sections.changes.title')}
      </h2>
      <p className="mb-4">{t('sections.changes.content')}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        {t('sections.contact.title')}
      </h2>
      <p>
        {t.rich('sections.contact.content', {
          link: (chunks) => (
            <Link
              href={`/${locale}/contact`}
              className="text-emerald-600 underline"
            >
              {chunks}
            </Link>
          ),
        })}
      </p>
    </PageContainer>
  );
}
