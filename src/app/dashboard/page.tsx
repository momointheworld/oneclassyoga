'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import LogoutButton from '@/components/LogoutButton';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const allowedEmail = process.env.NEXT_PUBLIC_DASHBOARD_EMAIL;

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user || user.email !== allowedEmail) {
        // Not logged in or not authorized, redirect to login
        router.push('/dashboard/login');
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, [router, allowedEmail]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome to your Dashboard</h1>
      <LogoutButton />
      {/* Your dashboard content */}
    </div>
  );
}
