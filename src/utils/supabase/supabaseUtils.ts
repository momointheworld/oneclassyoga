import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function uploadTeacherImage(
  file: File,
  folder: 'profile-pics' | 'gallery',
  slug: string
): Promise<string> {
  const fileExt = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const fileName = `${slug}-${Date.now()}.${fileExt}`; // Consistent naming for both

  const filePath = `/${folder}/${slug}/${fileName}`;
  const supabase = createClient();

  // For profile pics, first remove any existing files
  if (folder === 'profile-pics') {
    try {
      const { data: existingFiles } = await supabase.storage
        .from('teachers')
        .list(`${folder}/${slug}`);

      if (existingFiles && existingFiles.length > 0) {
        const filesToRemove = existingFiles.map(
          (f) => `${folder}/${slug}/${f.name}`
        );
        await supabase.storage.from('teachers').remove(filesToRemove);
      }
    } catch (error) {
      console.error('Error cleaning old profile pictures:', error);
    }
  }

  // Upload new file
  const { error } = await supabase.storage
    .from('teachers')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) throw error;

  // Get and return public URL
  const { data } = supabase.storage.from('teachers').getPublicUrl(filePath);
  return data.publicUrl;
}

export async function deleteTeacherImage(publicUrl: string) {
  if (!publicUrl) throw new Error('Missing image URL');

  const bucket = 'teachers';
  // Remove query parameters if they exist
  const cleanUrl = publicUrl.split('?')[0];
  const supabase = createClient();

  // More robust path extraction
  const pathParts = cleanUrl.split(`/storage/v1/object/public/${bucket}/`);
  if (pathParts.length < 2) throw new Error('Invalid image URL format');

  const path = pathParts[1];
  if (!path) throw new Error('Failed to extract path from public URL');

  // Only need to call remove() - update() isn't necessary for deletion
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) throw error;

  return { success: true };
}
