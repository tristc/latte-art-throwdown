import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Auth routes that should redirect to dashboard if logged in
  const authRoutes = ['/login', '/signup', '/verify'];
  
  // Protected routes that require auth
  const protectedRoutes = ['/dashboard', '/events', '/heats', '/judging', '/brackets', '/photos', '/profile'];

  const isAuthRoute = authRoutes.some(route => req.nextUrl.pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route));

  // Redirect logged-in users away from auth pages
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Redirect non-logged-in users to login
  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icons|sw.js|workbox-*.js).*)',
  ],
};
