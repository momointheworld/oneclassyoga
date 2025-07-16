import React from 'react';
import { prisma } from '@/lib/prisma';
import TeacherCard from '@/components/TeacherCard';

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
  email: string | null;
  phone: string | null;
  lineId: string | null;
};

export default async function TeachersPage() {
  const teachers = await prisma.teacher.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      photo: true,
      styles: true,
      levels: true,
      rate: true,
      bio: true,
      gallery: true,
      videoUrl: true,
      email: true,
      phone: true,
      lineId: true,
    },
  });

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
              email: teacher.email || '',
              phone: teacher.phone || '',
              lineId: teacher.lineId || '',
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
