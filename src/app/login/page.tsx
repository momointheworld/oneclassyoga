'use client';
import { supabase } from '@/lib/supabaseClient';

export default function DashboardLoginPage() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: 'http://localhost:3000/dashboard',
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Admin Login</h1>
      <button
        onClick={handleLogin}
        className="bg-black text-white py-2 px-4 rounded"
      >
        Sign in with GitHub
      </button>
    </div>
  );
}
