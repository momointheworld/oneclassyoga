import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const POST = async (req: Request) => {
  try {
    console.log('Upload API called');

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const contentType = req.headers.get('content-type') || '';
    console.log('Content-Type:', contentType);

    const formData = await req.formData();

    // Log all keys/values in formData to inspect
    console.log('FormData entries:');
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(
          `  ${key}: File { name: ${value.name}, size: ${value.size}, type: ${value.type} }`
        );
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }

    const file = formData.get('file');
    const folder = formData.get('folder') as string;
    const slug = formData.get('slug') as string;

    if (!file || !folder || !slug) {
      console.warn('Missing file, folder, or slug:', { file, folder, slug });
      return NextResponse.json(
        { error: 'Missing file, folder, or slug' },
        { status: 400 }
      );
    }

    if (!(file instanceof File) || typeof file.name !== 'string') {
      console.warn('Invalid file:', file);
      return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
    }

    function getFormattedTimestamp() {
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');

      const year = now.getFullYear();
      const month = pad(now.getMonth() + 1);
      const day = pad(now.getDate());
      const hours = pad(now.getHours());
      const minutes = pad(now.getMinutes());
      const seconds = pad(now.getSeconds());

      return `${year}${month}${day}-${hours}${minutes}${seconds}`;
    }

    const timestamp = getFormattedTimestamp();
    const sanitizedOriginalName = file.name.replace(/\s+/g, '-').toLowerCase();
    const uniqueName = `${slug}-${timestamp}-${sanitizedOriginalName}`;
    const filePath = `${folder}/${slug}/${uniqueName}`;
    const bucket = 'teachers';

    console.log('Uploading file:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      filePath,
      bucket,
    });

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    console.log('Public URL:', publicUrlData.publicUrl);

    return NextResponse.json({ publicUrl: publicUrlData.publicUrl });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
