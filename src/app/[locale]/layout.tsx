import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import MainMenu from '@/components/MainMenu';
import { Footer } from '@/components/Footer';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import CookieBanner from '@/components/CookieBanner';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!['en', 'zh'].includes(locale)) notFound();

  // Client provider: Pass locale explicitly
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <AnalyticsTracker />
      <div className="flex flex-col min-h-screen">
        <MainMenu />
        <main className="flex-grow">{children}</main>
        <CookieBanner />
        <Footer locale={locale} />
      </div>
    </NextIntlClientProvider>
  );
}
