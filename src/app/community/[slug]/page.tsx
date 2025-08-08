import { createClient } from '@/utils/supabase/supabaseServer';
import { notFound } from 'next/navigation';

const supabase = createClient();

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch post by slug
  const { data: post, error: postError } = await (await supabase)
    .from('posts')
    .select('id, title, content')
    .eq('slug', slug)
    .single();

  if (postError || !post) {
    notFound();
  }

  // Fetch comments by post.id
  const { data: comments, error: commentsError } = await (await supabase)
    .from('comments')
    .select('id, content')
    .eq('post_id', post.id)
    .order('created_at', { ascending: true });

  if (commentsError) throw new Error(commentsError.message);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="mb-8 whitespace-pre-wrap">{post.content}</p>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        {comments?.length ? (
          <ul className="space-y-3">
            {comments.map((comment) => (
              <li key={comment.id} className="border p-3 rounded">
                {comment.content}
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments yet.</p>
        )}
      </section>
    </main>
  );
}
