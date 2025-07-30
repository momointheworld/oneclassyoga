'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { deleteTeacherImage } from '@/utils/supabase/supabaseUtils';

interface DeleteImageProps {
  publicUrl: string;
  bucket?: string;
  onDeleted?: () => void;
}

export default function DeleteImage({
  publicUrl,
  bucket = 'teachers',
  onDeleted,
}: DeleteImageProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteTeacherImage(publicUrl);
      onDeleted?.();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };
  return (
    <Button
      variant="destructive"
      className="text-white bg-red-500 hover:bg-red-600"
      onClick={handleDelete}
      disabled={deleting}
    >
      {deleting ? 'Deleting...' : 'Delete Image'}
    </Button>
  );
}
