import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('tpm_auth_session');

  let isAuthenticated = false;
  if (sessionCookie?.value) {
    try {
      const decoded = decodeURIComponent(sessionCookie.value);
      const parsed = JSON.parse(decoded);
      if (parsed && (parsed.username || parsed.role)) {
        isAuthenticated = true;
      }
    } catch {
      try {
        const parsed = JSON.parse(sessionCookie.value);
        if (parsed && (parsed.username || parsed.role)) {
          isAuthenticated = true;
        }
      } catch {
        isAuthenticated = false;
      }
    }
  }

  // 1. Guard Dashboard: Non-login persons CANNOT see the dashboard (redirect to /login)
  if (!isAuthenticated && pathname === '/') {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Guard Login: Logged-in persons CANNOT see the /login page (redirect to /)
  if (isAuthenticated && pathname === '/login') {
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login'],
};
