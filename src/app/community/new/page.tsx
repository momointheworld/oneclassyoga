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
  const [errorMEssage, setErrorMessage] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user || null);
    });
  }, [supabase.auth]);

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
          <CategorySelector value={category} onChange={setCategory} />
          {/* <textarea
            placeholder="Content"
            className="w-full border p-3 rounded h-40"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            disabled={loading}
          /> */}
          <TipTapEditor
            initialContent={content}
            onChange={(html: SetStateAction<string>) => setContent(html)}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </form>
        <div className="text-orange-600">
          {errorMEssage && `Failed to post: ${errorMEssage}`}
        </div>

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
      </div>
    </PageContainer>
  );
}
