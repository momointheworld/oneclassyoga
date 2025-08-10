import { createClient } from '@/utils/supabase/supabaseServer';
import { notFound } from 'next/navigation';
import parse from 'html-react-parser';
import { PageContainer } from '@/components/PageContainer';

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createClient();

  // Fetch post by slug
  const { data: post, error: postError } = await (await supabase)
    .from('posts')
    .select('id, title, content, user_name')
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
    <PageContainer>
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div className="mb-8 tiptap prose max-w-none"> {parse(post.content)}</div>

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
    </PageContainer>
  );
}
