// app/community/page.tsx (server component)

import CommunityPageClient from './CommunityPageClient';

import { createClient } from '@/utils/supabase/supabaseServer';

export default async function CommunityPage() {
  const supabase = createClient();

  // Get logged-in user (server side)
  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  // Get posts (server side)
  const { data: posts, error } = await (await supabase)
    .from('posts')
    .select('id, title, content, slug, user_name, user_id, created_at')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return <CommunityPageClient user={user} posts={posts || []} />;
}
