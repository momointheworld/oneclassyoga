// app/teacher/[slug]/page.tsx
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
    .select('name, styles, bio, photo')
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
    )}. Offering private 1-on-1 classes.`;

  const imageUrl =
    teacher.photo || 'https://oneclass.yoga/logos/default-teacher-image.png'; // fallback image

  return {
    title: `${teacher.name} | Experienced Private Yoga Teacher in Chiang Mai`,
    description,
    openGraph: {
      title: `${teacher.name} | Experienced Private Yoga Teacher in Chiang Mai`,
      description,
      url: `https://oneclass.yoga/teachers/${slug}`,
      siteName: 'OneClass Yoga',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${teacher.name} - Yoga Teacher in Chiang Mai`,
        },
      ],
      locale: 'en_US',
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${teacher.name} | Private Yoga Teacher in Chiang Mai`,
      description,
      images: [imageUrl],
    },
  };
}

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
      'id, name, slug, bio, photo, gallery, styles, rates, levels, videoUrl, weekly_schedule'
    )
    .eq('slug', slug)
    .single();

  if (error || !teacher) {
    return notFound();
  }

  return <TeacherProfileClient teacher={teacher} />;
}
