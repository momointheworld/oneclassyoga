import React from 'react';
import TeacherCard from '@/components/TeacherCard';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Teacher = {
  id: number;
  name: string;
  photo: string | null;
  styles: string[];
  levels: string[];
  slug: string;
  bio: string | null;
  gallery: string[] | null;
  videoUrl: string | null;
};

export default async function TeachersPage() {
  const { data: teachers, error } = await supabase
    .from('teachers')
    .select('id, name, slug, photo, styles, levels, bio, gallery, videoUrl')
    .eq('isActive', true);

  if (error) {
    throw new Error(error.message);
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Available Yoga Teachers in Chiang Mai
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher: Teacher) => (
          <TeacherCard
            key={teacher.id}
            teacher={{
              id: teacher.id,
              name: teacher.name,
              slug: teacher.name.toLowerCase().replace(/\s+/g, '-'),
              photo: teacher.photo || '/placeholder.png',
              bio: teacher.bio || '',
              gallery: teacher.gallery || [],
              videoUrl: teacher.videoUrl || '',
              styles: teacher.styles,
              levels: teacher.levels,
            }}
          />
        ))}
      </div>
    </main>
  );
}
