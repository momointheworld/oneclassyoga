// app/teacher/[slug]/page.tsx (Server Component)
import { notFound } from 'next/navigation';
import TeacherProfileClient from './TeacherProfileClient';
import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/supabaseServer';

// Helper to strip HTML tags
function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, '');
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const supabase = createClient();
  const { slug } = await params;

  const { data: teacher } = await (await supabase)
    .from('teachers')
    .select('name, styles, bio')
    .eq('slug', slug)
    .single();

  if (!teacher) {
    return {
      title: 'Yoga Teacher Not Found | OneClass Yoga',
      description:
        'This yoga teacher profile could not be found in Chiang Mai.',
    };
  }

  const plainBio = teacher.bio ? stripHtml(teacher.bio) : '';
  const description =
    plainBio.slice(0, 150) ||
    `Learn yoga in Chiang Mai with ${teacher.name}, specializing in ${teacher.styles?.join(
      ', '
    )}. Offering private & small group (1–5 people) classes.`;

  return {
    title: `${teacher.name} | Experienced Private Yoga Teacher in Chiang Mai`,
    description,
  };
}

export default async function TeacherProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createClient();

  // Fetch teacher data
  const { data: teacher, error } = await (await supabase)
    .from('teachers')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !teacher) {
    return notFound();
  }

  return <TeacherProfileClient teacher={teacher} booking_type="single" />;
}
