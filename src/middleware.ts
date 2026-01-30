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

  // 1. Define segments that need Auth
  const needsAuth =
    pathname.includes('/dashboard') || pathname.includes('/community');
  const isAuthPage = pathname.includes('/login') || pathname.includes('/auth');

  // 2. Run the intlMiddleware first for everything except actual auth/api internals
  // This ensures /en/community stays /en/community
  const response = intlMiddleware(req);

  // 3. Handle Supabase Auth (Protection Logic)
  if (needsAuth || isAuthPage) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => req.cookies.getAll(),
          setAll: (cookies) => {
            cookies.forEach(
              ({ name, value, options }) =>
                response.cookies.set(name, value, options), // Use the 'response' from intlMiddleware!
            );
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (needsAuth) {
      const githubId = user?.identities?.find(
        (id) => id.provider === 'github',
      )?.id;
      // If no user, or wrong user, redirect to login
      if (!user || githubId !== process.env.GITHUB_ALLOWED_ID) {
        // Important: Redirect to the localized login if possible
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    // 1. Match the root
    '/',
    // 2. Match paths starting with your locales
    '/(en|zh)/:path*',
    // 3. Match everything ELSE, but REMOVE community from the exclusion list
    // Only keep internal things like api, _next, and static files (.*\\..*)
    '/((?!api|_next|_vercel|dashboard|auth|login|.*\\..*).*)',
  ],
};
