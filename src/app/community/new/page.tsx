'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import slugify from 'slugify';
import { createClient } from '@/utils/supabase/supabaseClient';
import AuthModal from '@/components/AuthModal';
import type { User } from '@supabase/supabase-js';

const supabase = createClient();

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user || null);
    });
  }, []);

  async function generateUniqueSlug(
    baseSlug: string,
    count: number = 0
  ): Promise<string> {
    const slugToCheck = count === 0 ? baseSlug : `${baseSlug}-${count}`;

    const { data } = await supabase
      .from('posts')
      .select('id')
      .eq('slug', slugToCheck)
      .limit(1)
      .single();

    if (data) {
      return generateUniqueSlug(baseSlug, count + 1);
    }
    return slugToCheck;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setLoading(true);

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

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data.user || null);
            setShowAuthModal(false);
          }}
        />
      )}
    </main>
  );
}
