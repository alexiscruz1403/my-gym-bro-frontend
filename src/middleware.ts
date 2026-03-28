import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/register', '/auth'];
const PROTECTED_PREFIX = ['/dashboard', '/workout', '/history', '/feed', '/profile'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read the accessToken from the cookie written by the auth store.
  // localStorage is not accessible in Edge Runtime — the cookie is the
  // only bridge between the client store and the middleware.
  const accessToken = request.cookies.get('gym-planner-access-token')?.value;

  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  const isProtectedRoute = PROTECTED_PREFIX.some((prefix) =>
    pathname.startsWith(prefix),
  );

  // Unauthenticated user trying to access a protected route
  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

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
