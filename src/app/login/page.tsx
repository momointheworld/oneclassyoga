'use client';
import { useState } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';

export default function DashboardLoginPage() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'message' in error) {
        setErrorMsg((error as { message: string }).message);
      } else {
        setErrorMsg('An unknown error occurred.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Admin Login</h1>
      <button
        onClick={handleLogin}
        disabled={loading}
        className="bg-black text-white py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'Redirecting...' : 'Sign in with GitHub'}
      </button>
      {errorMsg && <p className="text-red-500 mt-2">{errorMsg}</p>}
    </div>
  );
}
