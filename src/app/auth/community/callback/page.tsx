// app/auth/community/callback/page.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/supabaseClient';

export default function AuthCallbackPage() {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(() => {
      router.push('/community/');
    });
  }, [router]);

  return <p>Signing you in...</p>;
}
