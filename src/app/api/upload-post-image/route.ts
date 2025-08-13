import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const POST = async (req: Request) => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const postId = formData.get('postId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);
    const folder = postId ? `posts/${postId}` : 'uploads';
    const filePath = `${folder}/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from('images')
      .upload(filePath, fileBuffer, { contentType: file.type || undefined });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: publicData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return NextResponse.json({ url: publicData.publicUrl });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
