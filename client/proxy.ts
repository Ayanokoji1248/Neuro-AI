import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Define public vs protected paths
    const isPublicPath = path === '/login' || path === '/signup' || path === '/';
    
    // Check for the token in cookies
    const token = request.cookies.get('token')?.value;

    console.log(`Middleware - Path: ${path}, Token exists: ${!!token}`);

    // Redirect logic
    if (isPublicPath && token) {
        // If user is logged in and tries to access login/signup/home, redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (!isPublicPath && !token) {
        // If user is not logged in and tries to access protected route, redirect to login
        // But exclude static files and api routes (which are handled by matcher but just in case)
        if (!path.startsWith('/api') && !path.startsWith('/_next')) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * 1. /api (API routes)
         * 2. /_next/static (static files)
         * 3. /_next/image (image optimization files)
         * 4. /favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
