// app/teacher/[slug]/page.tsx (Server Component)
import { notFound } from 'next/navigation';
import TeacherProfileClient from './TeacherProfileClient';
import { createClient } from '@/utils/supabase/supabaseServer';
import { PageContainer } from '@/components/PageContainer';

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
