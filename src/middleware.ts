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
  // 2. ✅ Run intlMiddleware FIRST and get the response
  const response = intlMiddleware(req);

  const pathname = req.nextUrl.pathname;

  // 3. Extract locale from pathname AFTER intl processing
  const pathnameLocale = pathname.split('/')[1];
  const currentLocale = ['en', 'zh'].includes(pathnameLocale)
    ? pathnameLocale
    : 'en';

  // 4. Define segments that need Auth
  const needsAuth =
    pathname.includes('/dashboard') || pathname.includes('/community');
  const isAuthPage = pathname.includes('/login') || pathname.includes('/auth');

  // 5. Create Supabase client with the response from intlMiddleware
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

    if (!user || githubId !== process.env.GITHUB_ALLOWED_ID) {
      return NextResponse.redirect(new URL(`/${currentLocale}/login`, req.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
