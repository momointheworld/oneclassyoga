'use client';

import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/supabaseClient';
import { Button } from '@/components/ui/button';
import parse from 'html-react-parser';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';

type Post = {
  id: number;
  title: string;
  content: string;
  slug: string;
  user_id: string;
  user_name: string;
  created_at: Date;
  category: string;
};

type Props = {
  user: User | null;
  posts: Post[];
};
export default function CommunityPageClient({
  user,
  posts,
  locale,
}: Props & { locale: string }) {
  const t = useTranslations('Community');
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const dateLocale = locale === 'zh' ? zhCN : enUS;

  const initialCategory = searchParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialCategory,
  );
  const [visibleCount, setVisibleCount] = useState(20);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (selectedCategory) {
      params.set('category', selectedCategory);
    } else {
      params.delete('category');
    }
    router.replace(`/community?${params.toString()}`, { scroll: false });
  }, [selectedCategory, router]);

  const categories = useMemo(
    () =>
      Array.from(new Set(posts.map((p) => p.category).filter(Boolean))).sort(),
    [posts],
  );

  const filteredPosts = useMemo(
    () =>
      !selectedCategory
        ? posts
        : posts.filter((p) => p.category === selectedCategory),
    [posts, selectedCategory],
  );

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-8 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">{t('ui.title')}</h1>

      {/* Category Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={!selectedCategory ? 'default' : 'outline'}
          onClick={() => setSelectedCategory(null)}
          className="rounded-full"
        >
          {t('ui.allCategories')}
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(cat)}
            className="rounded-full"
          >
            {/* Translate dynamic categories if they exist in JSON, else show raw */}
            {t(`categories.${cat}`, { defaultValue: cat })}
          </Button>
        ))}
      </div>

      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
        <p className="text-gray-700 font-medium">
          {currentUser
            ? t('ui.greeting', {
                name: currentUser.user_metadata?.user_name || currentUser.email,
              })
            : t('ui.welcome')}
        </p>
        {currentUser && (
          <div className="flex gap-4 items-center">
            <Link
              href={`/${locale}/community/new`}
              className="text-emerald-600 hover:text-emerald-700 font-bold text-sm"
            >
              {t('ui.createPost')}
            </Link>
            <Button
              onClick={async () => {
                setIsSigningOut(true);
                await supabase.auth.signOut();
                setCurrentUser(null);
                setIsSigningOut(false);
              }}
              variant="ghost"
              size="sm"
              disabled={isSigningOut}
            >
              {t('ui.signOut')}
            </Button>
          </div>
        )}
      </div>

      {/* Posts List */}
      <ul className="space-y-6">
        {filteredPosts.slice(0, visibleCount).map((post) => (
          <li
            key={post.id}
            className="group border-b border-gray-100 pb-6 transition-all"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => setSelectedCategory(post.category)}
                  className="text-xs font-bold text-emerald-600 uppercase tracking-wider text-left"
                >
                  {t(`categories.${post.category}`, {
                    defaultValue: post.category,
                  })}
                </button>
                <Link
                  href={`/${locale}/community/${post.slug}`}
                  className="text-xl font-bold text-gray-900 group-hover:text-emerald-600"
                >
                  {post.title}
                </Link>
              </div>
              <span className="text-gray-400 text-xs tabular-nums">
                {format(new Date(post.created_at), 'MMM d, yyyy', {
                  locale: dateLocale,
                })}
              </span>
            </div>
            <div className="text-gray-600 text-sm line-clamp-2 prose prose-sm max-w-none">
              {parse(post.content)}
            </div>
          </li>
        ))}
      </ul>

      {visibleCount < filteredPosts.length && (
        <Button
          onClick={() => setVisibleCount((v) => v + 20)}
          variant="outline"
          className="w-full rounded-xl"
        >
          {t('ui.loadMore')}
        </Button>
      )}
    </main>
  );
}
