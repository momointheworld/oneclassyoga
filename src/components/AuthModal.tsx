'use client';

import { useState, FormEvent } from 'react';
import { createClient } from '@/utils/supabase/supabaseClient';
import type { Provider, User } from '@supabase/supabase-js';

const supabase = createClient();

interface AuthModalProps {
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

export default function AuthModal({ onClose, onAuthSuccess }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  function validatePassword(pw: string) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(pw);
    const hasLowerCase = /[a-z]/.test(pw);
    const hasNumber = /[0-9]/.test(pw);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pw);

    if (pw.length < minLength) return 'Password must be at least 8 characters.';
    if (!hasUpperCase)
      return 'Password must contain at least one uppercase letter.';
    if (!hasLowerCase)
      return 'Password must contain at least one lowercase letter.';
    if (!hasNumber) return 'Password must contain at least one number.';
    if (!hasSpecialChar)
      return 'Password must contain at least one special character.';
    return null;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      if (mode === 'signup') {
        if (!userName.trim()) {
          setErrorMessage('Username is required.');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMessage('Passwords do not match.');
          setLoading(false);
          return;
        }
        const pwError = validatePassword(password);
        if (pwError) {
          setErrorMessage(pwError);
          setLoading(false);
          return;
        }
        // Sign up and store username in user_metadata
        const { data: authData, error: authError } = await supabase.auth.signUp(
          {
            email,
            password,
            options: {
              data: { username: userName }, // store in metadata
            },
          }
        );

        if (authError) {
          setErrorMessage(authError.message);
          setLoading(false);
          return;
        }

        if (authData.user) {
          setWarningMessage(
            'Please check your email to confirm your account before logging in.'
          );
          setMode('login');
          setLoading(false);
          return;
        }
      } else {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMessage(error.message);
          setLoading(false);
          return;
        }

        if (data.user) {
          // Check if email verified
          if (!data.user.email_confirmed_at) {
            setErrorMessage('Please verify your email before logging in.');
            await supabase.auth.signOut(); // clear session if any
            setLoading(false);
            return;
          }

          // Check if profile exists in users table
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profileError && profileError.code === 'PGRST116') {
            // No profile found, create one
            const { error: insertError } = await supabase.from('users').insert([
              {
                id: data.user.id,
                username: data.user.user_metadata?.username || userName,
                avatar_url: null,
              },
            ]);

            if (insertError) {
              setErrorMessage('Failed to create user profile.');
              setLoading(false);
              return;
            }
          } else if (profileError) {
            setErrorMessage('Failed to fetch user profile.');
            setLoading(false);
            return;
          }

          onAuthSuccess(data.user);
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  async function handleOAuthLogin(provider: Provider) {
    setLoading(true);
    setErrorMessage(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/community/callback`,
      },
    });

    setLoading(false);
    if (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-xl font-bold mb-4">
          {mode === 'login' ? 'Log in' : 'Sign up'}
        </h2>

        {warningMessage && (
          <p className="text-yellow-600 text-sm mb-2">{warningMessage}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {mode === 'signup' && (
            <input
              type="text"
              placeholder="User Name"
              className="w-full border p-2 rounded"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          )}

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {mode === 'signup' && (
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full border p-2 rounded"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}

          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}

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
