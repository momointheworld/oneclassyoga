import { createClient } from '@/utils/supabase/supabaseServer';
import { notFound } from 'next/navigation';
import parse from 'html-react-parser';
import { PageContainer } from '@/components/PageContainer';
import ClientPostActions from '@/actions/ClientPostActions';
import { BreadcrumbTrail } from '@/components/BreadCrumbTrail';

const ADMIN_UID = process.env.ADMIN_UID!;

async function canManagePost(
  supabase: ReturnType<typeof createClient>,
  postId: number,
  userId: string
) {
  const { data, error } = await (await supabase)
    .from('posts')
    .select('user_id')
    .eq('id', postId)
    .single();

  if (error || !data) return false;
  return data.user_id === userId || userId === ADMIN_UID;
}
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  const userId = user?.id || null;

  const { slug } = await params;
  const { data: post, error: postError } = await (await supabase)
    .from('posts')
    .select('id, title, content, user_id, user_name, category')
    .eq('slug', slug)
    .single();

  if (postError || !post) notFound();

  const canEdit = userId
    ? await canManagePost(supabase, post.id, userId)
    : false;

  return (
    <PageContainer>
      {canEdit ? (
        <>
          <div className="my-5 text-gray-500">
            <BreadcrumbTrail
              items={[
                { label: 'Community', href: '/community' },
                { label: `${slug}` }, // no href = current page
              ]}
            />
          </div>
          <ClientPostActions
            postId={post.id}
            postSlug={slug}
            initialTitle={post.title}
            initialContent={post.content}
            initialCategory={post.category}
          />
        </>
      ) : (
        <>
          <div className="my-5 text-gray-500">
            <BreadcrumbTrail
              items={[
                { label: 'Community', href: '/community' },
                { label: `${slug}` }, // no href = current page
              ]}
            />
          </div>
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <div className="mb-8 tiptap prose max-w-none">
            {parse(post.content)}
          </div>
        </>
      )}
    </PageContainer>
  );
}
