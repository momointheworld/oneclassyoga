import { PageContainer } from '@/components/PageContainer';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Location.metadata' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function LocationPage() {
  // Use 'Home.LocationPage' if you nested it inside Home in your request config
  const t = await getTranslations('Location');

  return (
    <PageContainer>
      <h1 className="text-3xl font-bold mb-8 text-center">{t('title')}</h1>

      <div className="space-y-6">
        <p className="text-center">{t('description')}</p>

        {/* Info Card */}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              {t('features.title')}
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {(t.raw('features.items') as string[]).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-center">
          <Image
            src="/images/studio-oneclass.jpg"
            alt={t('images.venueAlt')}
            width={800}
            height={600}
            className="h-auto w-auto rounded-lg shadow-md"
            priority // Good practice for main page images
          />
        </div>

        {/* Address */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold mb-2">{t('address.title')}</h2>
          <p className="text-gray-700">{t('address.text')}</p>
        </div>

        <div className="flex justify-center">
          <Image
            src="/images/location-map.png"
            alt={t('images.mapAlt')}
            width={400}
            height={300}
            className="h-auto rounded-lg shadow-md"
          />
        </div>
      </div>
    </PageContainer>
  );
}
