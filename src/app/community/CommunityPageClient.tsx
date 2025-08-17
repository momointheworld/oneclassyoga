'use client';

import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/supabaseClient';
import AuthModal from '@/components/AuthModal';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/PageContainer';
import parse from 'html-react-parser';
import SkeletonCard from '@/components/SkeletonCard';

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

export default function CommunityPageClient({ user, posts }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const supabase = createClient();

  const initialCategory = searchParams.get('category');

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialCategory
  );

  const [visibleCount, setVisibleCount] = useState(20);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  const [isLoading, setIsLoading] = useState(false);

  // Update URL when selectedCategory changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (selectedCategory) {
      params.set('category', selectedCategory);
    } else {
      params.delete('category');
    }

    const queryString = params.toString();
    const url = queryString ? `/community?${queryString}` : '/community';

    router.replace(url, { scroll: false });
  }, [selectedCategory, router]);

  // Reset visibleCount on category change
  useEffect(() => {
    setVisibleCount(20);
  }, [selectedCategory]);

  // Unique categories sorted
  const categories = useMemo(
    () =>
      Array.from(new Set(posts.map((p) => p.category).filter(Boolean))).sort(),
    [posts]
  );

  // Filter posts by selectedCategory
  const filteredPosts = useMemo(() => {
    if (!selectedCategory) return posts;
    return posts.filter((post) => post.category === selectedCategory);
  }, [posts, selectedCategory]);

  async function signOut() {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    setCurrentUser(null);
    setIsSigningOut(false);
  }

  const allowedGithubId = process.env.NEXT_PUBLIC_GITHUB_ALLOWED_ID;
  async function handleAuthSuccess(newUser: User) {
    const githubIdentity = newUser.identities?.find(
      (id) => id.provider === 'github'
    );
    const githubUserId = githubIdentity?.id ?? '';

    if (githubUserId === allowedGithubId) {
      setCurrentUser(newUser);
      setShowAuthModal(false);
    } else {
      alert('Access denied: only admin can log in now.');
      await supabase.auth.signOut();
    }
  }

  function FormattedDate({ dateString }: { dateString: string }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;
    return <>{new Date(dateString).toLocaleDateString()}</>;
  }

  function UserGreeting({ user }: { user: User | null }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return <PageContainer>loading...</PageContainer>;
    return (
      <div className="flex flex-row">
        {user
          ? `👋 Hello, ${user.user_metadata?.user_name || user.email}`
          : 'Welcome!'}
      </div>
    );
  }

  const handleCategoryClick = (cat: string | null) => {
    setSelectedCategory(cat);
  };

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Asana Journal</h1>

      {/* Category Buttons */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!selectedCategory ? 'default' : 'outline'}
            onClick={() => handleCategoryClick(null)}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      )}

      <div className="flex flex-col items-end space-y-4">
        {currentUser ? (
          <div className="flex flex-row items-center space-x-3">
            <div className="flex flex-row">
              <UserGreeting user={currentUser} />
            </div>
            <Button
              onClick={signOut}
              variant="outline"
              disabled={isSigningOut}
              className="max-w-xs px-4 py-2 hover:bg-gray-200 text-gray-600 rounded-md transition disabled:opacity-50 sm:w-auto"
            >
              {isSigningOut ? 'Signing out...' : 'Sign out'}
            </Button>
          </div>
        ) : null}
        {currentUser && (
          <Link
            href="/community/new"
            className="text-blue-600 hover:text-blue-800 font-semibold mb-5"
          >
            + Create New Post
          </Link>
        )}
      </div>

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {/* Posts List */}
      {!posts ? (
        <SkeletonCard
          lines={[
            { width: 'w-3/4', height: 'h-6' },
            { width: 'w-full', height: 'h-4' },
            { width: 'w-5/6', height: 'h-4' },
            { width: 'w-2/3', height: 'h-4' },
          ]}
        />
      ) : (
        <ul className="space-y-3">
          {filteredPosts.slice(0, visibleCount).map((post) => (
            <li
              key={post.id}
              className="transition border-b border-gray-200 mb-2"
            >
              <div className="flex justify-between">
                <div className="flex flex-col space-x-3 sm:flex-row sm:justify-start mb-2">
                  <button
                    onClick={() => handleCategoryClick(post.category)}
                    className="text-md font-semibold text-gray-400 hover:text-gray-600 underline text-left"
                  >
                    {post.category || 'Uncategorized'}
                  </button>
                  <Link
                    href={`/community/${post.slug}`}
                    className="text-md font-semibold text-gray-700 hover:text-gray-500"
                  >
                    {post.title}
                  </Link>
                </div>
                <p className="text-gray-400 text-sm">
                  <FormattedDate dateString={post.created_at.toString()} />
                </p>
              </div>
              <div className="text-gray-600 text-sm whitespace-pre-wrap line-clamp-2 break-words prose mb-5 px-5">
                {parse(post.content)}
              </div>
            </li>
          ))}
        </ul>
      )}
      {/* Load More Button */}
      {visibleCount < filteredPosts.length && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={() => setVisibleCount((prev) => prev + 20)}
            variant="outline"
          >
            Load More
          </Button>
        </div>
      )}
    </main>
  );
}
