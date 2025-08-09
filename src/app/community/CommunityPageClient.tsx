'use client';

import Link from 'next/link';
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/supabaseClient';
import AuthModal from '@/components/AuthModal'; // adjust path as needed
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/PageContainer';
import parse from 'html-react-parser';

type Post = {
  id: number;
  title: string;
  content: string;
  slug: string;
  user_id: string;
  user_name: string;
  created_at: Date;
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

  function handleAuthSuccess(newUser: User) {
    setCurrentUser(newUser);
    setShowAuthModal(false);
  }

  return (
    <PageContainer>
      {/* Page title */}
      <header className="mb-4 border-b border-gray-300 pb-4">
        <h1 className="text-4xl font-bold text-gray-900">Community Forum</h1>
      </header>

      {/* Controls: Create New Post + login/welcome/sign out */}
      <div className="flex flex-col items-end space-y-4">
        {/* Profile or Sign In */}
        {currentUser ? (
          <div className="flex flex-row items-center space-x-3">
            <div className="flex flex-row">
              <span>👋 Hello, </span>
              <span className="font-semibold">
                {currentUser.user_metadata?.full_name ||
                  currentUser.email ||
                  'there'}
              </span>
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
          <button
            onClick={() => {
              console.log('Sign in clicked');
              setShowAuthModal(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
          >
            Sign in
          </button>
        )}

        {/* Create New Post */}
        <Link
          href="/community/new"
          className="text-blue-600 hover:text-blue-800 font-semibold mb-5"
        >
          + Create New Post
        </Link>
      </div>

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {/* Posts list */}
      <ul className="space-y-6">
        {posts.map((post) => (
          <li
            key={post.id}
            className="p-6 rounded-lg shadow-sm hover:shadow-md transition"
          >
            <Link
              href={`/community/${post.slug}`}
              className="text-2xl font-semibold text-gray-900 hover:text-gray-600"
            >
              {post.title}
            </Link>
            <p className="text-gray-400">
              by {post.user_name || 'Anonymous'} |{' '}
              {typeof post.created_at === 'string'
                ? new Date(post.created_at).toLocaleDateString()
                : post.created_at instanceof Date
                  ? post.created_at.toLocaleDateString()
                  : 'Invalid date'}
            </p>

            <div className="text-gray-600 mt-2">{parse(post.content)}</div>
          </li>
        ))}
      </ul>
    </PageContainer>
  );
}
