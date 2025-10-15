import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/app/globals.css';
import MainMenu from '@/components/MainMenu';
import { Footer } from '@/components/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://oneclass.yoga'),
  title: {
    default: 'OneClass Yoga Chiang Mai',
    template: '%s | OneClass Yoga Chiang Mai',
  },
  description:
    'Discover private and shared yoga sessions in Chiang Mai with experienced teachers. Book classes, explore pricing, and connect with the OneClass Yoga community.',
  openGraph: {
    images: ['/images/ogs/home-og.jpg'],
  },
  twitter: {
    images: ['/images/ogs/home-og.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex flex-col min-h-screen">
          <MainMenu />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
