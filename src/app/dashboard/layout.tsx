'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
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
        router.push('/login');
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, [allowedEmail, router]);

  if (loading) return <p>Loading...</p>;

  return <>{children}</>;
}
