'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { uploadTeacherImage } from '@/utils/supabase/supabaseUtils';

type Props = {
  slug: string;
  folder: 'profile-pics' | 'gallery';
  multiple?: boolean;
  onUpload: (urls: string[]) => void;
};

export default function ImageUpload({
  slug,
  folder,
  multiple = false,
  onUpload,
}: Props) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!files) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        const url = await uploadTeacherImage(file, folder, slug);
        uploadedUrls.push(url);
      } catch (err) {
        console.error('Upload failed:', err);
        setUploading(false);
        return;
      }
    }

    setUploading(false);
    setPreviews(uploadedUrls);
    onUpload(uploadedUrls);
  };

  return (
    <div className="space-y-3">
      <Input
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileChange}
        disabled={uploading}
      />
      <Button
        onClick={handleUpload}
        disabled={!files || uploading}
        variant="default"
        className="w-fit bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? (
          <>
            <Loader2 className="animate-spin w-4 h-4 mr-2" /> Uploading...
          </>
        ) : (
          'Upload'
        )}
      </Button>

      <div className="flex gap-4 flex-wrap mt-2">
        {previews.map((url) => (
          <Image
            key={url}
            src={url}
            alt="Uploaded preview"
            width={120}
            height={120}
            className="rounded-xl border object-cover"
          />
        ))}
      </div>
    </div>
  );
}
