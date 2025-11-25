import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  const path = req.nextUrl.pathname;

  // Protect all admin routes
  if (path.startsWith('/')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/customers/:path*',
    '/employees/:path*',
    '/sessions/:path*',
    '/revenue/:path*',
    '/main/:path*',],
};
