'use client';

import { SetStateAction, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/supabaseClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  levelOptions,
  strengthsOptions,
  styleOptions,
  timeSlotOptions,
  weekly_schedule,
} from '@/lib/constants';
import ImageUpload from '@/components/ImageUpload';
import { Label } from '@radix-ui/react-label';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import TipTapEditor from '@/components/TipTapEditor';
import { BreadcrumbTrail } from '@/components/BreadCrumbTrail';
import { TeacherRates } from '@/types/teacher';

export default function EditTeacherProfilePage() {
  const router = useRouter();
  const params = useParams() as { slug: string };
  const supabase = createClient();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [zhBio, setZhBio] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [levels, setLevels] = useState<string[]>([]);
  const [styles, setStyles] = useState<string[]>([]);
  const [strengths, setStrengths] = useState<Record<string, string[]>>({});
  const [profilePhoto, setProfilePhoto] = useState('');
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [stripeProductId, setStripeProductId] = useState('');
  const [weeklySchedule, setWeeklySchedule] = useState<{
    [key: string]: string[];
  }>(weekly_schedule);
  const [rates, setRates] = useState<TeacherRates>({
    single: null,
    bundle3: null,
    bundle6: null,
    extra: {
      single: null,
      bundle3: null,
      bundle6: null,
    },
  });
  const dayOrder = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

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
        setZhBio(data.bio_zh || '');
        setVideoUrl(data.videoUrl || '');
        setLevels(data.levels || []);
        setStyles(data.styles || []);
        setStrengths(data.strengths || {});
        setProfilePhoto(data.photo || '');
        setGalleryUrls(data.gallery || []);
        setIsActive(data.isActive ?? true);
        setIsFeatured(data.isFeatured ?? false);
        setUpdatedAt(data.updatedAt || null);
        setWeeklySchedule({
          ...weekly_schedule, // template with all days
          ...(data.weekly_schedule || {}), // overwrite with saved teacher slots
        });
        setRates(data.rates);
        setStripeProductId(data.stripe_product_id);
      }

      setLoading(false);
    };

    fetchTeacher();
  }, [params.slug, supabase]);

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

    // 1. Prepare payload (matching your DB column names)
    const payload = {
      name,
      bio,
      bio_zh: zhBio,
      videoUrl,
      levels,
      isActive,
      isFeatured,
      styles,
      strengths,
      photo: profilePhoto,
      gallery: galleryUrls,
      weekly_schedule: weeklySchedule,
      stripe_product_id: stripeProductId,
      rates: rates,
    };

    try {
      // 2. Call the PATCH API
      const response = await fetch(`/api/teachers/${teacherId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // 1. Check if the response actually has content
      const contentType = response.headers.get('content-type');

      if (!response.ok) {
        // If it's JSON, parse the error; otherwise, use text
        const errorMsg = contentType?.includes('application/json')
          ? (await response.json()).error
          : await response.text();

        throw new Error(errorMsg || 'Server error');
      }

      // 2. Safely parse the success data
      const result = contentType?.includes('application/json')
        ? await response.json()
        : {};

      console.log('Update success:', result);

      router.push(`/dashboard/teachers/`);
      router.refresh(); // Forces Next.js to clear cache and show fresh data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Update failed:', err.message);
      alert(`Error: ${err.message}`);
    } finally {
      setButtonLoading(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-8">
      <BreadcrumbTrail
        items={[
          { label: 'Home', href: '/' },
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Teachers', href: '/dashboard/teachers' },
          { label: `${name}` }, // no href = current page
        ]}
      />
      <h1 className="text-3xl font-bold mb-4">Edit Teacher</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled
        />
        <Label className="block mb-2">
          Bio (English)
          <TipTapEditor
            initialContent={bio}
            onChange={(html: SetStateAction<string>) => setBio(html)}
          />
        </Label>
        <Label className="block mb-2">
          Bio (Chinese)
          <TipTapEditor
            initialContent={zhBio}
            onChange={(html: SetStateAction<string>) => setZhBio(html)}
          />
        </Label>

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
        <div className="border bg-gray-100 p-2">
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

        {/* Strength Checkboxes */}
        <div className="border p-2 bg-gray-100">
          <p className="font-semibold mb-2">Strengths</p>

          {Object.entries(strengthsOptions).map(([category, options]) => (
            <div key={category} className="mb-4">
              <p className="font-medium">{category}</p>
              <div className="grid grid-cols-2 gap-3">
                {options.map((strength) => (
                  <label key={strength} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={strength}
                      checked={strengths[category]?.includes(strength) ?? false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setStrengths({
                            ...strengths,
                            [category]: [
                              ...(strengths[category] ?? []),
                              strength,
                            ],
                          });
                        } else {
                          setStrengths({
                            ...strengths,
                            [category]:
                              strengths[category]?.filter(
                                (s) => s !== strength,
                              ) ?? [],
                          });
                        }
                      }}
                    />
                    {strength}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* weekly schedule */}
        <div>
          <p className="font-semibold mb-2">Weekly Schedule</p>
          {dayOrder.map((day) => (
            <div key={day} className="mb-4 border p-3 rounded-lg">
              <p className="font-medium mb-1">{day}</p>
              <div className="grid grid-cols-2 gap-2">
                {timeSlotOptions.map((timeSlot) => (
                  <label key={timeSlot} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={timeSlot}
                      checked={weeklySchedule[day]?.includes(timeSlot) || false}
                      onChange={(e) => {
                        const newSlots = e.target.checked
                          ? [...(weeklySchedule[day] || []), timeSlot]
                          : (weeklySchedule[day] || []).filter(
                              (s) => s !== timeSlot,
                            );

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

        {/* stripe product id */}
        <section>
          <Label className="block mb-2">
            Stripe Product ID
            <Input
              placeholder="stripe product id"
              value={stripeProductId}
              onChange={(e) => setStripeProductId(e.target.value)}
            />
          </Label>
        </section>

        {/* Rates */}
        <section>
          <p className="font-semibold mb-2">Rates (฿)</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Single Session
              </label>
              <Input
                type="text"
                min={0}
                value={rates.single ?? ''}
                onChange={(e) =>
                  setRates({ ...rates, single: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                3-Session Bundle
              </label>
              <Input
                type="text"
                min={0}
                value={rates.bundle3 ?? ''}
                onChange={(e) =>
                  setRates({ ...rates, bundle3: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                6-Session Bundle
              </label>
              <Input
                type="text"
                min={0}
                value={rates.bundle6 ?? ''}
                onChange={(e) =>
                  setRates({ ...rates, bundle6: parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </div>

          <p className="font-semibold mt-4 mb-2">Extra Participant Rates (฿)</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Single Session Extra
              </label>
              <Input
                type="text"
                min={0}
                value={rates.extra.single ?? ''}
                onChange={(e) =>
                  setRates({
                    ...rates,
                    extra: {
                      ...rates.extra,
                      single: parseInt(e.target.value) || 0,
                    },
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                3-Session Bundle Extra
              </label>
              <Input
                type="text"
                min={0}
                value={rates.extra.bundle3 ?? ''}
                onChange={(e) =>
                  setRates({
                    ...rates,
                    extra: {
                      ...rates.extra,
                      bundle3: parseInt(e.target.value) || 0,
                    },
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                6-Session Bundle Extra
              </label>
              <Input
                type="text"
                min={0}
                value={rates.extra.bundle6 ?? ''}
                onChange={(e) =>
                  setRates({
                    ...rates,
                    extra: {
                      ...rates.extra,
                      bundle6: parseInt(e.target.value) || 0,
                    },
                  })
                }
              />
            </div>
          </div>
        </section>

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
                    await fetch('/api/delete-image', {
                      method: 'POST',
                      body: JSON.stringify({ publicUrl: profilePhoto }),
                      headers: { 'Content-Type': 'application/json' },
                    });

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
              onUpload={async ([publicUrl]) => {
                if (profilePhoto) {
                  await fetch('/api/delete-image', {
                    method: 'POST',
                    body: JSON.stringify({ publicUrl: profilePhoto }),
                    headers: { 'Content-Type': 'application/json' },
                  });
                }

                await supabase
                  .from('teachers')
                  .update({ photo: publicUrl })
                  .eq('id', teacherId);

                setProfilePhoto(publicUrl);
              }}
            />
          </div>
        </section>

        {/* GALLERY UPLOAD */}
        <section>
          <p className="font-semibold mb-2">Gallery Photos</p>

          <div className="flex flex-wrap gap-4 mb-2">
            {galleryUrls.map((url, idx) => (
              <div
                key={`${url}-${idx}`}
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
                    await fetch('/api/delete-image', {
                      method: 'POST',
                      body: JSON.stringify({ publicUrl: url }),
                      headers: { 'Content-Type': 'application/json' },
                    });

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
            onUpload={async (uploadedUrls) => {
              const updated = [...galleryUrls, ...uploadedUrls];
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
        <div className="flex justify-between mt-6">
          <Button
            variant="default"
            type="button"
            disabled={buttonLoading}
            onClick={() => router.push(`/dashboard/teachers/`)}
            className="bg-gray-500 mt-4 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            type="submit"
            disabled={buttonLoading}
            className="bg-blue-500 mt-4 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
        </div>
      </form>
    </main>
  );
}
