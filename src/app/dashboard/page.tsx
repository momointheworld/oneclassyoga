import { createServerClient } from '@supabase/ssr';
import { Link } from 'lucide-react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: async () => (await cookies()).getAll(),
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log('=== USER INFO ===');
  console.log(user);
  console.log('=== EXPECTED ADMIN EMAIL ===');
  console.log(process.env.DASHBOARD_LOGIN_EMAIL);

  const allowedEmail = process.env.DASHBOARD_LOGIN_EMAIL;

  if (!user || user.email !== allowedEmail) {
    console.log(
      'Redirecting to /login because user is missing or not authorized'
    );

    redirect('/login');
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Welcome to your Dashboard, {user.email}
      </h1>

      {/* <LogoutButton /> */}

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
