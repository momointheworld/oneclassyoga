// app/dashboard/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import MainMenu from '@/components/MainMenu';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex flex-col min-h-screen">
        <MainMenu />
        <main className="flex-1">{children}</main>
      </div>
    </NextIntlClientProvider>
  );
}
