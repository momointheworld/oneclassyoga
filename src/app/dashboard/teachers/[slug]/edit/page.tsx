'use client';

import { SetStateAction, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { levelOptions, styleOptions, timeSlotOptions } from '@/lib/constants';
import { deleteTeacherImage } from '@/lib/supabaseUtils';
import ImageUpload from '@/components/ImageUpload';
import { Label } from '@radix-ui/react-label';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import TeacherBioEditor from '@/components/TeacherBioEditor';

export default function EditTeacherProfilePage() {
  const router = useRouter();
  const params = useParams() as { slug: string };

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [levels, setLevels] = useState<string[]>([]);
  const [styles, setStyles] = useState<string[]>([]);
  const [profilePhoto, setProfilePhoto] = useState('');
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  useEffect(() => {
    const fetchTeacher = async () => {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('slug', params.slug)
        .single();

      if (error) {
        console.error('Fetch error:', error.message);
      } else {
        setTeacherId(data.id);
        setName(data.name || '');
        setBio(data.bio || '');
        setVideoUrl(data.videoUrl || '');
        setLevels(data.levels || []);
        setStyles(data.styles || []);
        setProfilePhoto(data.photo || '');
        setGalleryUrls(data.gallery || []);
        setIsActive(data.isActive ?? true); // Default to true if null
        setIsFeatured(data.isFeatured ?? false); // Default to false if null
        setUpdatedAt(data.updatedAt || null);
        setTimeSlots(data.timeSlots || []); // Initialize time slots
      }

      setLoading(false);
    };

    fetchTeacher();
  }, [params.slug]);

  function formatToBangkokTime(utcTimestamp: string) {
    const date = new Date(utcTimestamp);
    return date.toLocaleString('en-US', {
      timeZone: 'Asia/Bangkok', // Bangkok is UTC+7
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherId) return;
    setButtonLoading(true);

    const { error } = await supabase
      .from('teachers')
      .update({
        name,
        bio,
        slug: params.slug,
        videoUrl,
        levels,
        isActive,
        isFeatured,
        styles,
        photo: profilePhoto,
        gallery: galleryUrls,
        updatedAt: new Date().toISOString(),
        timeSlots,
      })
      .eq('id', teacherId);

    if (error) {
      console.error('Update failed:', error.message);
      setButtonLoading(false);
    } else {
      router.push(`/dashboard/teachers/`);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Edit Teacher</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled
        />

        <TeacherBioEditor
          initialContent={bio}
          onChange={(html: SetStateAction<string>) => setBio(html)}
        />

        <Label className="block mb-2">
          Video URL
          <Input
            placeholder="Optional YouTube Video URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </Label>

        {/* Levels Checkboxes */}
        <div>
          <p className="font-semibold mb-2">Levels</p>
          <div className="flex flex-wrap gap-3">
            {levelOptions.map((level) => (
              <label key={level} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={level}
                  checked={levels.includes(level)}
                  onChange={(e) => {
                    if (e.target.checked) setLevels([...levels, level]);
                    else setLevels(levels.filter((l) => l !== level));
                  }}
                />
                {level}
              </label>
            ))}
          </div>
        </div>

        {/* Styles Checkboxes */}
        <div>
          <p className="font-semibold mb-2">Styles</p>
          <div className="grid grid-cols-2 gap-3">
            {styleOptions.map((style) => (
              <label key={style} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={style}
                  checked={styles.includes(style)}
                  onChange={(e) => {
                    if (e.target.checked) setStyles([...styles, style]);
                    else setStyles(styles.filter((s) => s !== style));
                  }}
                />
                {style}
              </label>
            ))}
          </div>
        </div>

        {/* Styles Checkboxes */}
        <div>
          <p className="font-semibold mb-2">Styles</p>
          <div className="grid grid-cols-2 gap-3">
            {timeSlotOptions.map((timeSlot) => (
              <label key={timeSlot} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={timeSlot}
                  checked={timeSlots.includes(timeSlot)}
                  onChange={(e) => {
                    if (e.target.checked)
                      setTimeSlots([...timeSlots, timeSlot]);
                    else setTimeSlots(timeSlots.filter((s) => s !== timeSlot));
                  }}
                />
                {timeSlot}
              </label>
            ))}
          </div>
        </div>

        {/* PROFILE PHOTO UPLOAD */}
        <section>
          <div>
            <p className="font-semibold mb-2">Profile Photo</p>

            {profilePhoto && (
              <div className="relative w-32 h-32 mb-4">
                <Image
                  src={profilePhoto}
                  alt="Profile"
                  width={120}
                  height={120}
                  className="w-32 h-32 object-cover rounded"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="absolute top-1 right-1 text-xs bg-red-600 text-white hover:bg-red-700 rounded-md"
                  onClick={async () => {
                    await deleteTeacherImage(profilePhoto);
                    setProfilePhoto('');
                    await supabase
                      .from('teachers')
                      .update({ photo: null })
                      .eq('id', teacherId);
                  }}
                >
                  ×
                </Button>
              </div>
            )}

            <ImageUpload
              slug={params.slug}
              folder="profile-pics"
              multiple={false}
              onUpload={async ([url]) => {
                // If there was an existing photo, delete it first to avoid orphan files
                if (profilePhoto) {
                  await deleteTeacherImage(profilePhoto);
                }
                await supabase
                  .from('teachers')
                  .update({ photo: url })
                  .eq('id', teacherId);

                setProfilePhoto(url);

                await supabase
                  .from('teachers')
                  .update({ photo: url })
                  .eq('id', teacherId);
              }}
            />
          </div>
        </section>

        {/* GALLERY UPLOAD */}
        <section>
          <p className="font-semibold mb-2">Gallery Photos</p>

          <div className="flex flex-wrap gap-4 mb-2">
            {galleryUrls.map((url) => (
              <div
                key={url}
                className="relative w-28 h-28 rounded overflow-hidden"
              >
                <Image
                  src={url}
                  width={120}
                  height={120}
                  alt="Gallery"
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="absolute top-1 right-1 text-xs bg-red-600 text-white hover:bg-red-700 rounded-md"
                  onClick={async () => {
                    await deleteTeacherImage(url);
                    const updated = galleryUrls.filter((img) => img !== url);
                    setGalleryUrls(updated);
                    await supabase
                      .from('teachers')
                      .update({ gallery: updated })
                      .eq('id', teacherId);
                  }}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>

          <ImageUpload
            slug={params.slug}
            folder="gallery"
            multiple={true}
            onUpload={async (newUrls) => {
              const updated = [...galleryUrls, ...newUrls];
              setGalleryUrls(updated);
              await supabase
                .from('teachers')
                .update({ gallery: updated })
                .eq('id', teacherId);
            }}
          />
        </section>

        <div>
          Updated At: {updatedAt ? formatToBangkokTime(updatedAt) : 'N/A'}
          {/* Active Checkbox */}
          <div className="flex items-center space-x-2 mt-5">
            <input
              type="checkbox"
              id="is-active"
              checked={isActive} // Use 'checked' instead of 'value' for checkboxes
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="is-active"
              className="ml-2 block text-sm text-gray-900"
            >
              Is Active
            </label>
          </div>
          {/* Featured Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is-featured"
              checked={isFeatured} // Use 'checked' instead of 'value' for checkboxes
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="is-featured"
              className="ml-2 block text-sm text-gray-900"
            >
              Is Featured
            </label>
          </div>
        </div>

        <Button
          variant="default"
          type="submit"
          disabled={buttonLoading}
          className="bg-blue-500 mt-4 w-full text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {buttonLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </div>
          ) : (
            'Save Teacher'
          )}
        </Button>
      </form>
    </main>
  );
}
