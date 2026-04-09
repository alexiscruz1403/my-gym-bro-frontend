import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/register', '/auth'];
const PROTECTED_PREFIX = ['/dashboard', '/workout', '/history', '/feed', '/profile'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read the httpOnly access token cookie set by the backend.
  // The cookie name must match the backend configuration.
  const cookieName = process.env.NEXT_PUBLIC_ACCESS_TOKEN_COOKIE ?? 'access_token';
  const accessToken = request.cookies.get(cookieName)?.value;

  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  // Authenticated user trying to access auth pages
  // Allow /auth/callback through so the OAuth handler can process tokens
  if (isPublicRoute && accessToken && !pathname.startsWith('/auth/callback')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
