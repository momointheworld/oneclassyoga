import React from 'react';
import TeacherCard from '@/components/TeacherCard';
import { createClient } from '@supabase/supabase-js';
import { Metadata } from 'next';
import { TeacherRates } from '@/types/teacher';

export const metadata: Metadata = {
  title: 'Chiang Mai Yoga Teachers | Private 1-on-1 Classes',
  description:
    'Meet trusted yoga teachers in Chiang Mai. Offering private 1-on-1 yoga classes for travelers, expats, and locals—personalized yoga for all levels. Option to share a session with a friend.',
  openGraph: {
    title: 'Chiang Mai Yoga Teachers | Private 1-on-1 Classes',
    description:
      'Discover top yoga teachers in Chiang Mai. Book private 1-on-1 classes tailored to your level and schedule, with the option to share the session with a friend.',
    url: 'https://oneclass.yoga',
    siteName: 'OneClass Yoga',
    images: [
      {
        url: 'https://oneclass.yoga/logos/teachers-og-image.png',
        width: 1200,
        height: 630,
        alt: 'Private yoga classes in Chiang Mai with experienced teachers',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chiang Mai Yoga Teachers | Private 1-on-1 Classes',
    description:
      'Discover top yoga teachers in Chiang Mai. Book private 1-on-1 classes tailored to your level and schedule, with the option to share the session with a friend.',
    images: ['https://oneclass.yoga/logos/teachers-og-image.png'],
  },
};

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Teacher = {
  id: number;
  name: string;
  photo: string | null;
  strengths: Record<string, string[]>;
  rates: TeacherRates;
  slug: string;
  bio: string | null;
  isFeatured: boolean;
};

export const revalidate = 60; // cache for 60 seconds

export default async function TeachersPage() {
  const { data: sortedTeachers, error } = await supabase
    .from('teachers')
    .select('id, name, slug, photo, strengths, rates, bio, isFeatured')
    .eq('isActive', true)
    .order('isFeatured', { ascending: false })
    .order('id', { ascending: false }); // fallback ordering

  if (error) {
    throw new Error(error.message);
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-16 flex-grow">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Chiang Mai Yoga Teachers: Private Classes
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
              slug: teacher.name.toLowerCase().replace(/\s+/g, '-'),
              photo: teacher.photo || '/placeholder.png',
              bio: teacher.bio || '',
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
