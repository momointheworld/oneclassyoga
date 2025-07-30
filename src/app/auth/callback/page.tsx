// app/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/supabaseClient';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        await supabase.auth.signOut();
        return router.replace('/login?error=session');
      }

      const email = session.user.email;
      if (email === process.env.NEXT_PUBLIC_DASHBOARD_LOGIN_EMAIL) {
        router.replace('/dashboard');
      } else {
        await supabase.auth.signOut();
        router.replace('/login?error=unauthorized');
      }
    };

    handleAuth();
  }, [router]);

  return <p>Logging you in...</p>;
}
