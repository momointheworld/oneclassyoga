'use client';

import { SetStateAction, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ImageUpload from '@/components/ImageUpload';
import {
  styleOptions,
  levelOptions,
  timeSlotOptions,
  weekly_schedule,
} from '@/lib/constants';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/supabaseClient';
import TipTapEditor from '@/components/TipTapEditor';
import { BreadcrumbTrail } from '@/components/BreadCrumbTrail';

export default function NewTeacherPage() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [styles, setStyles] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [buttonLoading, setButtonLoading] = useState(false);
  const router = useRouter();
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const supabase = createClient();
  const [weeklySchedule, setWeeklySchedule] = useState<{
    [key: string]: string[];
  }>(weekly_schedule);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setButtonLoading(true);

    const { error } = await supabase.from('teachers').insert({
      name,
      bio,
      styles,
      levels,
      isActive,
      isFeatured,
      videoUrl,
      photo: profilePhoto,
      gallery: galleryUrls,
      slug: name.toLowerCase().replace(/\s+/g, '-'), // add slug here
      weekly_schedule: weeklySchedule,
    });

    setButtonLoading(false);

    if (error) {
      console.error('Insert failed:', error.message);
      alert('Failed to create teacher.');
    } else {
      router.push('/dashboard/teachers');
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-8">
      <BreadcrumbTrail
        items={[
          { label: 'Home', href: '/' },
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Teachers', href: '/dashboard/teachers' },
          { label: 'New' }, // no href = current page
        ]}
      />
      <h1 className="text-3xl font-bold mb-4">Create New Teacher</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TipTapEditor
          initialContent={bio}
          onChange={(html: SetStateAction<string>) => setBio(html)}
        />
        <Input
          placeholder="Optional YouTube Video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="is-active"
            checked={isActive}
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
        {/* featured check */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="is-featured"
            checked={isFeatured}
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

        {/* Weekly Schedule */}

        <div>
          <p className="font-semibold mb-2">Weekly Schedule</p>
          {Object.entries(weeklySchedule).map(([day, slots]) => (
            <div key={day} className="mb-4 border p-3 rounded-lg">
              <p className="font-medium mb-1">{day}</p>
              <div className="grid grid-cols-2 gap-2">
                {timeSlotOptions.map((timeSlot) => (
                  <label key={timeSlot} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={timeSlot}
                      checked={slots.includes(timeSlot)}
                      onChange={(e) => {
                        const newSlots = e.target.checked
                          ? [...slots, timeSlot]
                          : slots.filter((s) => s !== timeSlot);
                        setWeeklySchedule({
                          ...weeklySchedule,
                          [day]: newSlots,
                        });
                      }}
                    />
                    {timeSlot}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Profile Photo Upload */}
        <div>
          <p className="font-semibold mb-2">Profile Photo</p>
          <ImageUpload
            slug={name.toLowerCase().replace(/\s+/g, '-')}
            folder="profile-pics"
            onUpload={(urls) => setProfilePhoto(urls[0])}
          />
        </div>
        {/* Gallery Upload */}
        <div>
          <p className="font-semibold mb-2">Gallery Photos</p>
          <ImageUpload
            slug={name.toLowerCase().replace(/\s+/g, '-')}
            folder="gallery"
            multiple
            onUpload={setGalleryUrls}
          />
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
