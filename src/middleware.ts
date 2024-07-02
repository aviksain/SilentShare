import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/signin', '/signup', '/', '/verify/:path*'],
};

export async function middleware(request: NextRequest) {
  try {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXT_AUTH_SECRET 
    });
    const url = request.nextUrl;

    if (token && 
       (url.pathname.startsWith('/signin') || 
        url.pathname.startsWith('/signup') || 
        url.pathname.startsWith('/verify') || 
        url.pathname === '/')
    ) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (!token && url.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Error in middleware:', error);
    return NextResponse.redirect(new URL('/error', request.url));
  }
}
