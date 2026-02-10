import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import createIntlMiddleware from 'next-intl/middleware';

// 1. Initialize the next-intl middleware
const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'zh'],
  defaultLocale: 'en',
  localePrefix: 'always',
});
export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // 1. ✅ EXEMPT both /login and /dashboard from localization
  // This ensures they stay at the root /path
  if (
    pathname === '/login' ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/dashboard')
  ) {
    // We don't return NextResponse.next() yet because /dashboard NEEDS Auth.
    // We just skip the intlMiddleware part.
  }

  // 2. Initialize response
  // Only run intl if it's NOT a bypassed route
  const response =
    pathname === '/login' ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/dashboard')
      ? NextResponse.next()
      : intlMiddleware(req);

  // 4. Define segments that need Auth
  const needsAuth =
    pathname.startsWith('/dashboard') || pathname.includes('/community/new');
  const isAuthPage = pathname === '/login' || pathname.startsWith('/auth');

  // 5. Create Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value }) =>
            req.cookies.set(name, value),
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // 6. Check auth status for protected routes
  if (!isAuthPage && needsAuth) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const githubId = user?.identities?.find(
      (id) => id.provider === 'github',
    )?.id;

    if (!user || githubId !== process.env.NEXT_PUBLIC_GITHUB_ALLOWED_ID) {
      return NextResponse.redirect(new URL(`/login`, req.url));
    }
  }

  return response;
}

export const config = {
  // 7. Update matcher to exclude dashboard from the general "catch-all"
  matcher: ['/((?!api|_next|_vercel|login|auth|dashboard|.*\\..*).*)'],
};
