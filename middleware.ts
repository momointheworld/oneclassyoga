import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const githubIdentity = user?.identities?.find(
    (id) => id.provider === 'github'
  );
  const githubUserId = githubIdentity?.id;
  const allowedGithubId = process.env.GITHUB_ALLOWED_ID;

  console.log('User:', user);
  console.log('GitHub ID:', githubUserId);
  console.log('Allowed ID:', allowedGithubId);

  if (!user || githubUserId !== allowedGithubId) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
