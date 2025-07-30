import Link from 'next/link';
import { supabase } from '@/utils/supabase/supabaseClient';

type Post = {
  id: number;
  slug: string;
  title: string;
  content: string;
};

export default async function CommunityPage() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, title, content')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Community Forum</h1>
      <Link href="/community/new" className="text-blue-600 mb-6 inline-block">
        + Create New Post
      </Link>

      <ul className="space-y-4">
        {posts?.map((post) => (
          <li key={post.id} className="p-4 border rounded hover:shadow">
            <Link
              href={`/community/${post.slug}`}
              className="text-xl font-semibold"
            >
              {post.title}
            </Link>
            <p className="text-gray-600 mt-1 line-clamp-2">{post.content}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
