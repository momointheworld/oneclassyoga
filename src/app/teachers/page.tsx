import React from 'react';
import TeacherCard from '@/components/TeacherCard';
import { supabase } from '@/lib/supabaseClient';

type Teacher = {
  id: number;
  name: string;
  photo: string | null;
  styles: string[];
  levels: string[];
  slug: string;
  rate: number;
  bio: string | null;
  gallery: string[] | null;
  videoUrl: string | null;
};

export default async function TeachersPage() {
  const { data: teachers, error } = await supabase
    .from('teachers')
    .select(
      'id, name, slug, photo, styles, levels, rate, bio, gallery, videoUrl'
    )
    .eq('isActive', true);

  if (error) {
    throw new Error(error.message);
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
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
              rate: teacher.rate,
            }}
          />
        ))}
      </div>
    </main>
  );
}
