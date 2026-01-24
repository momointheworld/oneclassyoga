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

  console.log('--- Middleware Request:', pathname);

  // 1. CHECK FOR NON-LOCALIZED ROUTES FIRST
  const isProtected =
    pathname.startsWith('/dashboard') || pathname.startsWith('/community');
  const isAuthPage =
    pathname.startsWith('/login') || pathname.startsWith('/auth');

  if (isProtected || isAuthPage) {
    console.log('-> Path is EXCLUDED from i18n'); // LOG 2
    const res = NextResponse.next();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => req.cookies.getAll(),
          setAll: (cookies) => {
            cookies.forEach(({ name, value, options }) =>
              res.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (isProtected) {
      const githubId = user?.identities?.find(
        (id) => id.provider === 'github',
      )?.id;
      if (!user || githubId !== process.env.GITHUB_ALLOWED_ID) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    // If it's a non-localized route, return 'res' directly and skip intlMiddleware
    return res;
  }
  console.log('-> Path is LOCALIZED, calling intlMiddleware');

  // 2. HANDLE LOCALIZED ROUTES (Home, Programs, etc.)
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    // Match all localized paths
    '/',
    '/(en|zh)/:path*',
    // Match everything ELSE except internal Next.js folders and your excluded routes
    '/((?!api|_next|_vercel|dashboard|auth|login|community|.*\\..*).*)',
  ],
};
