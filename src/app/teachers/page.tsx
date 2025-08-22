import React from 'react';
import TeacherCard from '@/components/TeacherCard';
import { createClient } from '@supabase/supabase-js';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title:
    'Chiang Mai Yoga Teachers | Private & Small Group Classes (1–5 People)',
  description:
    'Meet trusted yoga teachers in Chiang Mai. Offering private and small group classes (1–5 people) for travelers, expats, and locals—personalized yoga for all levels.',
};

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Teacher = {
  id: number;
  name: string;
  photo: string | null;
  styles: string[];
  levels: string[];
  slug: string;
  bio: string | null;
  isFeatured: boolean;
};

export default async function TeachersPage() {
  const { data: teachers, error } = await supabase
    .from('teachers')
    .select('id, name, slug, photo, styles, levels, bio,  isFeatured')
    .eq('isActive', true);

  if (error) {
    throw new Error(error.message);
  }

  const sortedTeachers = teachers.slice().sort((a, b) => {
    return (b.isFeatured === true ? 1 : 0) - (a.isFeatured === true ? 1 : 0);
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-16 flex-grow">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Chiang Mai Yoga Teachers: Private & Small Group Classes
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTeachers.map((teacher: Teacher) => (
          <TeacherCard
            key={teacher.id}
            teacher={{
              id: teacher.id,
              name: teacher.name,
              slug: teacher.name.toLowerCase().replace(/\s+/g, '-'),
              photo: teacher.photo || '/placeholder.png',
              bio: teacher.bio || '',
              styles: teacher.styles,
              levels: teacher.levels,
              isFeatured: teacher.isFeatured,
            }}
          />
        ))}
      </div>
    </main>
  );
}
