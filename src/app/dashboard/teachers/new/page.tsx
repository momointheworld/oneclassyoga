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
  strengthsOptions,
} from '@/lib/constants';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/supabaseClient';
import TipTapEditor from '@/components/TipTapEditor';
import { BreadcrumbTrail } from '@/components/BreadCrumbTrail';
import { TeacherRates } from '@/types/teacher';

export default function NewTeacherPage() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [styles, setStyles] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [strengths, setStrengths] = useState<Record<string, string[]>>({});
  const [videoUrl, setVideoUrl] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [buttonLoading, setButtonLoading] = useState(false);
  const router = useRouter();
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const supabase = createClient();
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
      rates: rates,
      stripe_product_id: stripeProductId,
      strengths,
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
                          const updated = (strengths[category] ?? []).filter(
                            (s) => s !== strength
                          );
                          const newStrengths = { ...strengths };
                          if (updated.length > 0)
                            newStrengths[category] = updated;
                          else delete newStrengths[category]; // remove empty category
                          setStrengths(newStrengths);
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

        {/* // inside your form, for example after rates or before submit button */}
        <div>
          <p className="font-semibold mb-2">Stripe Product ID</p>
          <Input
            placeholder="Enter Stripe Product ID"
            value={stripeProductId}
            onChange={(e) => setStripeProductId(e.target.value)}
            required
          />
        </div>

        {/* Rates */}
        <div className="space-y-4">
          <p className="font-semibold mb-2">Rates (฿)</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Single Session
              </label>
              <Input
                type="text"
                min={0}
                value={rates.single || 0}
                onChange={(e) =>
                  setRates({
                    ...rates,
                    single: e.target.value ? parseInt(e.target.value) : null,
                  })
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
                value={rates.bundle3 || 0}
                onChange={(e) =>
                  setRates({
                    ...rates,
                    bundle3: e.target.value ? parseInt(e.target.value) : null,
                  })
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
                value={rates.bundle6 ?? 0}
                onChange={(e) =>
                  setRates({
                    ...rates,
                    bundle6: e.target.value ? parseInt(e.target.value) : null,
                  })
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
                value={rates.extra.single || 0}
                onChange={(e) =>
                  setRates({
                    ...rates,
                    extra: {
                      ...rates.extra,
                      single: parseInt(e.target.value) || null,
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
                value={rates.extra.bundle3 || 0}
                onChange={(e) =>
                  setRates({
                    ...rates,
                    extra: {
                      ...rates.extra,
                      bundle3: parseInt(e.target.value) || null,
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
                value={rates.extra.bundle6 || 0}
                onChange={(e) =>
                  setRates({
                    ...rates,
                    extra: {
                      ...rates.extra,
                      bundle6: parseInt(e.target.value) || null,
                    },
                  })
                }
              />
            </div>
          </div>
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
