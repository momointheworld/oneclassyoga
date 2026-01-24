// import type { Metadata } from 'next';
// import { Geist, Geist_Mono } from 'next/font/google';
// import Script from 'next/script'; // ✅ import Script for GA
// import '@/app/globals.css';
// import MainMenu from '@/components/MainMenu';
// import { Footer } from '@/components/Footer';
// import AnalyticsTracker from '@/components/AnalyticsTracker';
// import CookieBanner from '@/components/CookieBanner';
// import { getMessages } from 'next-intl/server';

// const geistSans = Geist({
//   variable: '--font-geist-sans',
//   subsets: ['latin'],
// });

// const geistMono = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// });

// export const metadata: Metadata = {
//   metadataBase: new URL('https://oneclass.yoga'),
//   title: {
//     default: 'OneClass Yoga Chiang Mai',
//     template: '%s | OneClass Yoga Chiang Mai',
//   },
//   description:
//     'Discover private and shared yoga sessions in Chiang Mai with experienced teachers. Book classes, explore pricing, and connect with the OneClass Yoga community.',
//   openGraph: {
//     images: ['/images/ogs/home-og.jpg'],
//   },
//   twitter: {
//     images: ['/images/ogs/home-og.jpg'],
//   },
//   icons: {
//     icon: '/favicon.ico',
//     shortcut: '/favicon.ico',
//   },
// };

// export default async function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
// const messages = await getMessages();
//   return (
//     <html lang="en">
//       <head>
//         {/* ✅ Google Analytics Scripts */}
//         {GA_ID && (
//           <>
//             <Script
//               src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
//               strategy="afterInteractive"
//             />
//             <Script id="google-analytics" strategy="afterInteractive">
//               {`
//                 window.dataLayer = window.dataLayer || [];
//                 function gtag(){dataLayer.push(arguments);}
//                 gtag('js', new Date());
//                 gtag('config', '${GA_ID}', {
//                   page_path: window.location.pathname,
//                 });
//               `}
//             </Script>
//           </>
//         )}
//       </head>
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         <AnalyticsTracker /> {/* ✅ add here */}
//         <div className="flex flex-col min-h-screen">
//           <MainMenu />
//           <main className="flex-grow">
//             {children}
//             <CookieBanner />
//           </main>
//           <Footer />
//         </div>
//       </body>
//     </html>
//   );
// }

// src/app/[locale]/layout.tsx
import MainMenu from '@/components/MainMenu';
import { Footer } from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
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

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <div className="flex flex-col min-h-screen">
        <MainMenu />
        <main className="flex-grow">
          {children}
          <CookieBanner />
        </main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
