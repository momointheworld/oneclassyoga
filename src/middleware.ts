//

import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import createIntlMiddleware from 'next-intl/middleware';

// 1. Initialize the next-intl middleware
const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'zh'],
  defaultLocale: 'en',
  localePrefix: 'always', // Keeps the /en/ or /zh/ in the URL
});

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // --- PART A: AUTH PROTECTION ---
  // Only run Supabase logic if we are trying to access a dashboard route
  // We check for both /dashboard and /[locale]/dashboard
  const isDashboard = pathname.includes('/dashboard');

  if (isDashboard) {
    const res = NextResponse.next();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => req.cookies.getAll(),
          setAll: (cookies) => {
            cookies.forEach(({ name, value, options }) => {
              res.cookies.set(name, value, options);
            });
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();
    const githubIdentity = user?.identities?.find(
      (id) => id.provider === 'github',
    );
    const githubUserId = githubIdentity?.id;
    const allowedGithubId = process.env.GITHUB_ALLOWED_ID;

    // Redirect if not logged in or not allowed
    if (!user || githubUserId !== allowedGithubId) {
      // Note: You might need to adjust the redirect URL to /[locale]/login
      // if your login page is localized
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // --- PART B: INTERNATIONALIZATION ---
  // This handles the language prefixes for all routes
  return intlMiddleware(req);
}

export const config = {
  // Combine both matchers:
  // 1. The next-intl matcher for prefixes
  // 2. Your existing dashboard matcher
  matcher: [
    '/',
    '/(zh|en)/:path*',
    '/dashboard/:path*',
    // Skip all internal paths (_next, api, static files, etc.)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
