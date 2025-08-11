'use client';

import { useState, useEffect, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import slugify from 'slugify';
import { createClient } from '@/utils/supabase/supabaseClient';
import AuthModal from '@/components/AuthModal';
import type { User } from '@supabase/supabase-js';
import { PageContainer } from '@/components/PageContainer';
import { BreadcrumbTrail } from '@/components/BreadCrumbTrail';
import { Checkbox } from '@/components/ui/checkbox';
import TipTapEditor from '@/components/TipTapEditor';

const categories = ['Q&A', 'Experiences', 'Events'] as const;

// Replace with your actual allowed GitHub ID
const ALLOWED_GITHUB_ID = process.env.NEXT_PUBLIC_GITHUB_ALLOWED_ID || '';

interface CategorySelectorProps {
  value: string;
  onChange: (category: string) => void;
}

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [category, setCategory] = useState<string | ''>('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user || null);
    });
  }, [supabase.auth]);

  function isUserAllowed(user: User | null) {
    if (!user) return false;
    const githubIdentity = user.identities?.find(
      (id) => id.provider === 'github'
    );
    return githubIdentity?.id === ALLOWED_GITHUB_ID;
  }

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

  function CategorySelector({ value, onChange }: CategorySelectorProps) {
    return (
      <div className="flex flex-col space-y-2">
        <h2>Category:</h2>
        {categories.map((cat) => (
          <label
            key={cat}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <Checkbox
              checked={value === cat}
              onCheckedChange={(checked) => {
                if (checked) {
                  onChange(cat);
                } else {
                  onChange('');
                }
              }}
            />
            <span>{cat}</span>
          </label>
        ))}
      </div>
    );
  }

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!isUserAllowed(user)) {
      alert('Access denied: only admin can create posts.');
      setShowAuthModal(true);
      return;
    }

    if (!category) {
      setErrorMessage('Please select a category');
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
      user_name: user.user_metadata?.user_name || 'Anonymous',
      category,
    });

    setLoading(false);

    if (error) {
      setErrorMessage('Failed to create post: ' + error.message);
    } else {
      router.push(`/community/${uniqueSlug}`);
    }
  }

  const isAllowed = isUserAllowed(user);

  return (
    <PageContainer>
      <div>
        <BreadcrumbTrail
          items={[
            { label: 'Home', href: '/' },
            { label: 'Community', href: '/community' },
            { label: 'New' }, // no href = current page
          ]}
        />
        <h1 className="text-3xl font-bold my-6">Create New Post</h1>

        {!isAllowed && (
          <p className="text-red-600 font-semibold mb-4">
            You must be signed in as admin to create posts.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Title"
            className="w-full border p-3 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading || !isAllowed}
          />
          <CategorySelector value={category} onChange={setCategory} />

          <TipTapEditor
            initialContent={content}
            onChange={(html: SetStateAction<string>) => setContent(html)}
          />
          <button
            type="submit"
            disabled={loading || !isAllowed}
            className="px-6 py-3 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </form>

        <div className="text-orange-600 mt-2">
          {errorMessage && `Failed to post: ${errorMessage}`}
        </div>

        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onAuthSuccess={async () => {
              const { data } = await supabase.auth.getUser();
              const newUser = data.user;

              if (newUser) {
                const githubIdentity = newUser.identities?.find(
                  (id) => id.provider === 'github'
                );
                const githubUserId = githubIdentity?.id ?? '';

                if (githubUserId === ALLOWED_GITHUB_ID) {
                  setUser(newUser);
                  setShowAuthModal(false);
                } else {
                  alert('Access denied: only admin can create posts.');
                  await supabase.auth.signOut();
                }
              }
            }}
          />
        )}
      </div>
    </PageContainer>
  );
}
