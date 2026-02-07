import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import '@/app/globals.css';
import { Metadata } from 'next';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
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
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const { locale } = await params;

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
        {children}
      </body>
    </html>
  );
}
