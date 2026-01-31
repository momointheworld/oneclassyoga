// src/app/layout.tsx
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import '@/app/globals.css';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import MainMenu from '@/components/MainMenu';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { Footer } from 'react-day-picker';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  // Replace with your actual production URL
  metadataBase: new URL(
    process.env.NODE_ENV === 'production'
      ? 'https://oneclass.yoga'
      : 'http://localhost:3000',
  ),
  title: {
    default: 'OneClass Yoga Chiang Mai',
    template: '%s | OneClass Yoga Chiang Mai',
  },
  description: 'Private yoga sessions and community in Chiang Mai.',
  openGraph: {
    images: ['/images/ogs/home-og.jpg'],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // Get current locale and messages for the Global Nav
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${GA_ID}');`}
            </Script>
          </>
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Providing messages here allows MainMenu to work on non-locale pages */}
        <NextIntlClientProvider messages={messages} locale={locale}>
          <AnalyticsTracker />
          <div className="flex flex-col min-h-screen">
            <MainMenu />
            <main className="flex-grow">{children}</main>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
