// app/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/supabaseClient';

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClient();

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
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const githubIdentity = user?.identities?.find(
        (id) => id.provider === 'github'
      );
      const githubUserId = githubIdentity?.id;
      const allowedGithubId = process.env.NEXT_PUBLIC_GITHUB_ALLOWED_ID;

      if (githubUserId === allowedGithubId) {
        router.replace('/dashboard');
      } else {
        await supabase.auth.signOut();
        router.replace('/login?error=unauthorized');
      }
    };

    handleAuth();
  }, [router, supabase.auth]);

  return <p>Logging you in...</p>;
}
