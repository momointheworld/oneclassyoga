// src/app/[locale]/layout.tsx
import { Footer } from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh' }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!['en', 'zh'].includes(locale)) notFound();

  return (
    <>
      {children}
      <CookieBanner />
    </>
  );
}
