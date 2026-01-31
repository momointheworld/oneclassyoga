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
    namespace: 'Policies.PrivacyPage.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `https://oneclass.yoga/${locale}/privacy`,
    },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('Policies.PrivacyPage');

  return (
    <PageContainer>
      <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>
      <p className="mb-4">{t('intro')}</p>

      {/* Information We Collect */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">
        {t('sections.collect.title')}
      </h2>
      <p className="mb-4">{t('sections.collect.content')}</p>
      <ul className="list-disc list-inside mb-4">
        {(t.raw('sections.collect.items') as string[]).map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      {/* Usage */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">
        {t('sections.usage.title')}
      </h2>
      <p className="mb-4">{t('sections.usage.content')}</p>
      <ul className="list-disc list-inside mb-4">
        {(t.raw('sections.usage.items') as string[]).map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      {/* Protection */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">
        {t('sections.protection.title')}
      </h2>
      <p className="mb-4">{t('sections.protection.content')}</p>

      {/* Sharing */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">
        {t('sections.sharing.title')}
      </h2>
      <p className="mb-4">{t('sections.sharing.content')}</p>

      {/* Rights */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">
        {t('sections.rights.title')}
      </h2>
      <p className="mb-4">{t('sections.rights.content')}</p>
      <ul className="list-disc list-inside mb-4">
        {(t.raw('sections.rights.items') as string[]).map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      <p className="mb-4">
        {t.rich('sections.rights.footer', {
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

      {/* Changes */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">
        {t('sections.changes.title')}
      </h2>
      <p className="mb-4">{t('sections.changes.content')}</p>

      {/* Contact */}
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
