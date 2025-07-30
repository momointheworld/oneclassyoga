'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import slugify from 'slugify';
import { supabase } from '@/utils/supabase/supabaseClient';

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Generate a slug and ensure uniqueness
  async function generateUniqueSlug(
    baseSlug: string,
    count = 0
  ): Promise<string> {
    const slugToCheck = count === 0 ? baseSlug : `${baseSlug}-${count}`;

    const { data } = await supabase
      .from('posts')
      .select('id')
      .eq('slug', slugToCheck)
      .limit(1)
      .single();

    if (data) {
      // Slug exists, try next count
      return generateUniqueSlug(baseSlug, count + 1);
    }
    return slugToCheck;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert('You must be logged in to post.');
      setLoading(false);
      return;
    }

    const baseSlug = slugify(title, { lower: true, strict: true });

    const uniqueSlug = await generateUniqueSlug(baseSlug);

    const { error } = await supabase.from('posts').insert({
      title,
      content,
      slug: uniqueSlug,
      user_id: user.id,
    });

    setLoading(false);

    if (error) {
      alert('Failed to create post: ' + error.message);
    } else {
      router.push(`/community/${uniqueSlug}`);
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Title"
          className="w-full border p-3 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={loading}
        />
        <textarea
          placeholder="Content"
          className="w-full border p-3 rounded h-40"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </main>
  );
}
