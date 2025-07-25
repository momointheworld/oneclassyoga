'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import LogoutButton from '@/components/LogoutButton';
import Link from 'next/link';

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
        router.push('/dashboard/login');
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, [router, allowedEmail]);

  if (loading)
    return <p className="mt-10 text-center text-gray-500">Loading...</p>;

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Welcome to your Dashboard</h1>

      <LogoutButton />

      <ul className="mt-6 space-y-2 list-disc list-inside text-blue-600">
        <li>
          <Link href="/dashboard/teachers" className="hover:underline">
            Manage Teachers
          </Link>
        </li>
        <li>
          <Link href="/dashboard/bookings" className="hover:underline">
            View Bookings
          </Link>
        </li>
      </ul>
    </main>
  );
}
