'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from '@/components/ImageUpload';

const levelOptions = ['Beginner', 'Intermediate', 'Advanced'];

const styleOptions = [
  'Ashtanga',
  'Hatha',
  'Iyengar',
  'Yin',
  'Restorative',
  'Kundalini',
  'Vinyasa',
  'Bikram',
  'Power',
  'Aerial',
  'Anusara ',
  'Karma',
  'Sivananda',
  'Anusaranga',
];

export default function NewTeacherPage() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [styles, setStyles] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [rate, setRate] = useState<number>(0);
  const [videoUrl, setVideoUrl] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [lineId, setLineId] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // const slug = name.toLowerCase().replace(/\s+/g, '-');

    const res = await fetch('/api/teachers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        bio,
        styles,
        levels,
        rate,
        videoUrl,
        photo: profilePhoto,
        gallery: galleryUrls,
        email,
        phone,
        lineId,
      }),
    });

    if (res.ok) {
      router.push('/dashboard/teachers');
    } else {
      alert('Failed to create teacher.');
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Create New Teacher</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Input
          placeholder="LINE ID"
          value={lineId}
          onChange={(e) => setLineId(e.target.value)}
        />

        <Input
          type="number"
          placeholder="Rate (THB)"
          value={rate.toString()}
          onChange={(e) => setRate(parseFloat(e.target.value))}
        />

        <Input
          placeholder="Optional YouTube Video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />

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
          className="bg-blue-500 mt-4 w-full text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Teacher
        </Button>
      </form>
    </main>
  );
}
