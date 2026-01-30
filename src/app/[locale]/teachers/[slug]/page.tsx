// app/teacher/[slug]/page.tsx
import TeacherProfileClient from './TeacherProfileClient';
import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/supabaseServer';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const supabase = createClient();
  const { slug } = await params;

  // Initialize translations
  const t = await getTranslations('Teachers.TeacherProfile.metadata');

  const { data: teacher } = await (await supabase)
    .from('teachers')
    .select('name, photo, strengths')
    .eq('slug', slug)
    .single();

  if (!teacher) {
    return {
      title: t('notFoundTitle'),
      description: t('notFoundDescription'),
    };
  }

  // Extract strengths for movement, or default to empty array
  const movementStrengths = teacher.strengths?.['Movement']?.join(', ') || '';

  return {
    // Inject dynamic data into the translation template
    title: t('title', { name: teacher.name }),
    description: t('description', {
      name: teacher.name,
      strengths: movementStrengths,
    }),
    openGraph: {
      title: t('title', { name: teacher.name }),
      description: t('description', {
        name: teacher.name,
        strengths: movementStrengths,
      }),
      images: [
        {
          url: teacher.photo || '/images/default-teacher.jpg',
          width: 1200,
          height: 630,
          alt: t('ogAlt', { name: teacher.name }),
        },
      ],
    },
  };
}

export const revalidate = 60; // cache for 60 seconds

export default async function TeacherProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createClient();

  const { data: teacher, error } = await (await supabase)
    .from('teachers')
    .select(
      'id, name, slug, bio, isFeatured, photo, gallery, styles, strengths, rates, levels, videoUrl, weekly_schedule',
    )
    .eq('slug', slug)
    .eq('isActive', true)
    .single();

  if (error || !teacher) {
    redirect('/teachers');
  }

  return <TeacherProfileClient teacher={teacher} />;
}
