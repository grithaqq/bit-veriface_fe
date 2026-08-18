import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Route yang butuh autentikasi
const PROTECTED_PREFIXES = ['/photographer', '/runner', '/dashboard', '/upload'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Auth Guard ──────────────────────────────────────────────────────────────
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isProtected) {
    const token = request.cookies.get('access_token')?.value;
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── CORS untuk API routes ───────────────────────────────────────────────────
  const response = NextResponse.next();

  if (pathname.startsWith('/api')) {
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: response.headers });
    }
  }

  return response;
}

export const config = {
  matcher: ['/photographer/:path*', '/runner/:path*', '/dashboard/:path*', '/upload/:path*', '/api/:path*'],
};