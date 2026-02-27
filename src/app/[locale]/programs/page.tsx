import ProgramsPageClient from './ProgramPageClient';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: 'Programs.Metadata' });

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: `https://oneclass.yoga/${locale}/programs`,
      siteName: 'OneClass Yoga',
      images: [
        {
          url: '/images/ogs/programs-og.jpeg',
          width: 1200,
          height: 630,
          alt: t('ogTitle'),
        },
      ],
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('ogTitle'),
      description: t('twitterDescription'),
      images: ['/images/ogs/programs-og.jpeg'],
    },
  };
}

export default function ProgramsPage() {
  return <ProgramsPageClient />;
}
