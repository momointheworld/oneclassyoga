'use client';

import Link from 'next/link';
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/supabaseClient';
import AuthModal from '@/components/AuthModal'; // adjust path as needed

const supabase = createClient();

type Post = {
  id: number;
  title: string;
  content: string;
  slug: string;
};

type Props = {
  user: User | null;
  posts: Post[];
};

export default function CommunityPageClient({ user, posts }: Props) {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

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
    <main className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 border-b border-gray-300 pb-4">
        <h1 className="text-4xl font-bold text-gray-900">Community Forum</h1>

        {currentUser ? (
          <div className="flex items-center space-x-4">
            <div className="text-gray-700 text-lg">
              👋 Hello,{' '}
              <span className="font-semibold">
                {currentUser.user_metadata?.full_name ||
                  currentUser.email ||
                  'there'}
              </span>
              ! Welcome back.
            </div>
            <button
              onClick={signOut}
              disabled={isSigningOut}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition disabled:opacity-50"
            >
              {isSigningOut ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
          >
            Sign in
          </button>
        )}
      </header>

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {/* Create Post link */}
      <Link
        href="/community/new"
        className="text-blue-600 hover:text-blue-800 mb-6 inline-block font-semibold"
      >
        + Create New Post
      </Link>

      {/* Posts list */}
      <ul className="space-y-6">
        {posts.map((post) => (
          <li
            key={post.id}
            className="p-6 border rounded-lg shadow-sm hover:shadow-md transition"
          >
            <Link
              href={`/community/${post.slug}`}
              className="text-2xl font-semibold text-gray-900 hover:text-blue-600"
            >
              {post.title}
            </Link>
            <p className="text-gray-600 mt-2 line-clamp-2">{post.content}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
