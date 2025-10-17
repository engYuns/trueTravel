import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if user is logged in by looking for a token in cookies
  const isLoggedIn = request.cookies.get('isLoggedIn');
  const { pathname } = request.nextUrl;

  // If user is not logged in and trying to access dashboard, redirect to login
  if (!isLoggedIn && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is logged in and trying to access login, redirect to dashboard
  if (isLoggedIn && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is logged in and on homepage, show option to go to dashboard
  if (isLoggedIn && pathname === '/') {
    // Allow access but we can add a banner or redirect later
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/']
};