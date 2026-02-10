import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/supabaseServer';
import { LogOut } from 'lucide-react'; // example icon for logout
import Link from 'next/link';

// A simple logout function as server action (optional)
async function logout() {
  'use server';
  const supabase = createClient();
  await (await supabase).auth.signOut();
  redirect('/login');
}

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  // Redirect if no user or unauthorized GitHub user
  const githubIdentity = user?.identities?.find(
    (id) => id.provider === 'github',
  );
  const githubUserId = githubIdentity?.id;
  const allowedGithubId = process.env.NEXT_PUBLIC_GITHUB_ALLOWED_ID;

  if (!user || githubUserId !== allowedGithubId) {
    redirect('/login');
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Welcome to your Dashboard, {user.email}
      </h1>

      {/* Logout button */}
      <form action={logout} className="mb-6">
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 border rounded bg-orange-600 text-white hover:bg-orange-700"
        >
          <LogOut size={18} />
          Log out
        </button>
      </form>

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
