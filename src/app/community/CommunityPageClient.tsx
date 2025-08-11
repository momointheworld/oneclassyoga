'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/supabaseClient';
import AuthModal from '@/components/AuthModal';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/PageContainer';

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
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  const supabase = createClient();

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

    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) {
      // Render a loading or fallback UI to keep server/client consistent
      return <PageContainer>Loading...</PageContainer>;
    }

    return (
      <div className="flex flex-row">
        {user
          ? `👋 Hello, ${user.user_metadata?.user_name || user.email}`
          : 'Welcome!'}
      </div>
    );
  }

  return (
    <PageContainer>
      <header className="mb-4 border-b border-gray-300 pb-4">
        <h1 className="text-4xl font-bold text-gray-900">Community Forum</h1>
      </header>

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
        ) : (
          // Sign in button disabled for now
          <></>
        )}
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

      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post.id} className="p-2 rounded-lg transition">
            <div className="flex justify-between sm:p-2">
              <div className="flex flex-col space-x-3 sm:flex-row sm:justify-start">
                <Link
                  href={`/community/${post.category}`}
                  className="text-md font-semibold text-gray-400 hover:text-gray-600"
                >
                  {`${post.category} ` || 'Uncategorized'}
                </Link>{' '}
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
          </li>
        ))}
      </ul>
    </PageContainer>
  );
}
