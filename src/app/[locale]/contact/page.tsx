import type { Metadata } from 'next';
import ContactPage from './ContactPage';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Contact.metadata');

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: 'https://oneclass.yoga/contact',
      siteName: 'OneClass Yoga',
      images: [
        {
          url: '/images/ogs/contact-og.jpeg',
          width: 1200,
          height: 630,
          alt: t('ogAlt'),
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default function ContactLayout() {
  return <ContactPage />;
}
