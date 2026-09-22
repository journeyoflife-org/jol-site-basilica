/**
 * Middleware — locale routing.
 *
 * 1. Redirects `/` → `/lt` (default locale).
 * 2. Redirects invalid locale prefixes (e.g. `/fr/about`) to strip the prefix.
 * 3. Lets valid locale-prefixed routes pass through to [locale] segment.
 *
 * Static assets (_next, images, favicon, etc.) are excluded from locale routing.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SUPPORTED_LOCALES } from '@/lib/resolve-locale';

/** Paths that should NOT be locale-prefixed. */
const PUBLIC_PATHS = ['_next', 'favicon', 'images', 'robots.txt', 'sitemap.xml'];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((prefix) => pathname.startsWith(`/${prefix}`));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public assets
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Root → redirect to default locale
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/lt', request.url));
  }

  // Check if path starts with a locale segment
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment) {
    const isLocale = SUPPORTED_LOCALES.includes(firstSegment as 'lt' | 'en' | 'ru');

    if (!isLocale) {
      // No valid locale prefix — redirect to default locale
      return NextResponse.redirect(new URL(`/lt${pathname}`, request.url));
    }
  }

  // Valid locale-prefixed route — pass through to [locale] segment
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api routes (none in this project, but future-proof)
     * - _next/internal (framework)
     * - static files (.svg, .png, etc.)
     */
    '/((?!api|_next|.*\\..*$).*)',
  ],
};
