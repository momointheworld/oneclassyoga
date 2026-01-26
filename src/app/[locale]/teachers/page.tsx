import React from 'react';
import TeacherCard from '@/components/TeacherCard';
import { createClient } from '@supabase/supabase-js';
import { TeacherRates } from '@/types/teacher';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Teachers.Metadata' });

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: 'https://oneclass.yoga',
      siteName: 'OneClass Yoga',
      images: [
        {
          url: '/images/ogs/teachers-og.jpeg',
          width: 1200,
          height: 630,
          alt: t('ogAlt'),
        },
      ],
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/images/ogs/teachers-og.jpeg'],
    },
  };
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

type Teacher = {
  id: number;
  name: string;
  photo: string | null;
  strengths: Record<string, string[]>;
  rates: TeacherRates;
  slug: string;
  bio: string | null;
  bio_zh: string | null; // Added bio_zh
  isFeatured: boolean;
};

export const revalidate = 60;

export default async function TeachersPage({}: {
  params: Promise<{ locale: string }>;
}) {
  const tUI = await getTranslations('Teachers.UI'); // Access UI labels like "Title"

  const { data: sortedTeachers, error } = await supabase
    .from('teachers')
    .select('id, name, slug, photo, strengths, rates, bio, bio_zh, isFeatured') // Added bio_zh to select
    .eq('isActive', true)
    .order('isFeatured', { ascending: false })
    .order('id', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-16 flex-grow">
      {/* Localized Title */}
      <h1 className="text-3xl font-bold mb-8 text-center">
        {tUI('pageTitle')}
      </h1>

      <div
        className={`gap-6 ${
          sortedTeachers.length < 3
            ? 'flex justify-center flex-wrap'
            : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {sortedTeachers.map((teacher: Teacher) => (
          <TeacherCard
            key={teacher.id}
            teacher={{
              id: teacher.id,
              name: teacher.name,
              // Use the slug from the DB instead of generating it on the fly
              slug: teacher.slug,
              photo: teacher.photo || '/placeholder.png',
              bio: teacher.bio || '',
              bio_zh: teacher.bio_zh || '', // Pass bio_zh to the card
              strengths: teacher.strengths,
              rates: teacher.rates,
              isFeatured: teacher.isFeatured,
            }}
          />
        ))}
      </div>
    </main>
  );
}
