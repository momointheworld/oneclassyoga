// app/teacher/[slug]/page.tsx (Server Component)
import { notFound } from 'next/navigation';
import TeacherProfileClient from './TeacherProfileClient';
import { createClient } from '@/utils/supabase/supabaseServer';

export default async function TeacherProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const priceId = process.env.NEXT_STRIPE_SINGLE_PRICE_ID || '';
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

  return (
    <TeacherProfileClient
      teacher={teacher}
      price_id={priceId}
      booking_type="single"
    />
  );
}
