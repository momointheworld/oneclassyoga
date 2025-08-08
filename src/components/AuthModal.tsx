'use client';

import { useState, FormEvent } from 'react';
import { createClient } from '@/utils/supabase/supabaseClient';
import type { Provider } from '@supabase/supabase-js';
import { User } from '@supabase/supabase-js';

const supabase = createClient();

interface AuthModalProps {
  onClose: () => void;
  onAuthSuccess: (user: User) => void; // <-- updated here
}

export default function AuthModal({ onClose, onAuthSuccess }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    let result;
    if (mode === 'signup') {
      result = await supabase.auth.signUp({ email, password });
    } else {
      result = await supabase.auth.signInWithPassword({ email, password });
    }

    setLoading(false);

    if (result.error) {
      alert(result.error.message);
    } else {
      onAuthSuccess();
    }
  }

  async function handleOAuthLogin(provider: Provider) {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/community/callback`, // you need to set this in Supabase dashboard
      },
    });
    setLoading(false);

    if (error) {
      alert(error.message);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-xl font-bold mb-4">
          {mode === 'login' ? 'Log in' : 'Sign up'}
        </h2>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            {loading
              ? 'Please wait...'
              : mode === 'login'
                ? 'Log in'
                : 'Sign up'}
          </button>
        </form>

        {/* OAuth Buttons */}
        <div className="mt-6 space-y-2">
          <button
            onClick={() => handleOAuthLogin('google')}
            className="w-full bg-emerald-400 text-white py-2 rounded"
          >
            Continue with Google
          </button>
          <button
            onClick={() => handleOAuthLogin('github')}
            className="w-full bg-gray-400 text-white py-2 rounded"
          >
            Continue with GitHub
          </button>
          <button
            onClick={() => handleOAuthLogin('facebook')}
            className="w-full bg-blue-400 text-white py-2 rounded"
          >
            Continue with Facebook
          </button>
        </div>

        {/* Toggle Login/Signup */}
        <p className="mt-4 text-sm text-center">
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <button
                className="text-blue-600"
                onClick={() => setMode('signup')}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                className="text-blue-600"
                onClick={() => setMode('login')}
              >
                Log in
              </button>
            </>
          )}
        </p>

        {/* Cancel Button */}
        <button
          onClick={onClose}
          className="mt-4 w-full text-gray-500 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
