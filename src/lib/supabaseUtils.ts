import { supabase } from '@/lib/supabaseClient';

export async function uploadTeacherImage(file: File, path: string) {
  const { error } = await supabase.storage.from('teachers').upload(path, file, {
    cacheControl: '3600',
    upsert: true,
  });

  if (error) throw error;

  // get public URL
  const { data } = supabase.storage.from('teachers').getPublicUrl(path);
  return data.publicUrl;
}
