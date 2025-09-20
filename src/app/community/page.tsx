// app/community/page.tsx
import { Metadata } from 'next';
import CommunityPageClient from './CommunityPageClient';
import { createClient } from '@/utils/supabase/supabaseServer';

export const metadata: Metadata = {
  title: 'Community | OneClass',
  description:
    'Explore curated posts on Q&A, Experiences, Upcoming events, and Random thoughts — shared by OneClass.',
  openGraph: {
    title: 'OneClass Community',
    description:
      'Discover curated posts in Q&A, Experiences, Upcoming events, and Random categories — shared by OneClass.',
    url: 'https://oneromeo.com/community',
    siteName: 'OneClass',
    images: [
      {
        url: 'https://oneromeo.com/logos/og-image.png',
        width: 1200,
        height: 630,
        alt: 'OneClass Community',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OneClass Community',
    description:
      'Curated posts on Q&A, Experiences, Upcoming events, and Random topics — shared by OneClass.',
    images: ['https://oneromeo.com/logos/og-image.png'],
    creator: '@oneromeo',
  },
  alternates: {
    canonical: 'https://oneromeo.com/community',
  },
};

export const revalidate = 30; // cache for 30 seconds

export default async function CommunityPage() {
  const supabase = createClient();

  // Get logged-in user (server side)
  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  // Get posts (server side)
  const { data: posts, error } = await (await supabase)
    .from('posts')
    .select(
      'id, title, content, slug, user_name, user_id, created_at, category'
    )
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return <CommunityPageClient user={user} posts={posts || []} />;
}
