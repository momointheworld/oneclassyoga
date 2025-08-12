import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/supabaseServer';

const ADMIN_UID = process.env.ADMIN_UID!;

async function canManagePost(
  supabase: ReturnType<typeof createClient>,
  postId: string,
  userId: string
) {
  const { data, error } = await (await supabase)
    .from('posts')
    .select('user_id')
    .eq('id', postId)
    .single();

  if (error || !data) {
    console.error('canManagePost: error fetching post or no data', error);
    return false;
  }
  const isOwnerOrAdmin = data.user_id === userId || userId === ADMIN_UID;
  console.log(
    `canManagePost: userId=${userId}, postOwner=${data.user_id}, isOwnerOrAdmin=${isOwnerOrAdmin}`
  );
  return isOwnerOrAdmin;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (!user) {
    console.error('PATCH: Unauthorized - no user in session');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const postId = (await params).id;
  const { title, content, category } = await request.json();

  console.log(`PATCH: userId=${user.id}, postId=${postId}, updateData=`, {
    title,
    content,
    category,
  });

  if (!(await canManagePost(supabase, postId, user.id))) {
    console.error(
      `PATCH: Forbidden - user ${user.id} cannot manage post ${postId}`
    );
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { error } = await (await supabase)
    .from('posts')
    .update({ title, content, category })
    .eq('id', postId);

  if (error) {
    console.error(`PATCH: Error updating post ${postId}:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log(`PATCH: Successfully updated post ${postId}`);

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (!user) {
    console.error('DELETE: Unauthorized - no user in session');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const postId = (await params).id;

  console.log(`DELETE: userId=${user.id}, postId=${postId}`);

  if (!(await canManagePost(supabase, postId, user.id))) {
    console.error(
      `DELETE: Forbidden - user ${user.id} cannot manage post ${postId}`
    );
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { error } = await (await supabase)
    .from('posts')
    .delete()
    .eq('id', postId);

  if (error) {
    console.error(`DELETE: Error deleting post ${postId}:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log(`DELETE: Successfully deleted post ${postId}`);

  return NextResponse.json({ success: true });
}
