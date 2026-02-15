import { NextRequest, NextResponse } from "next/server";

export const proxy = async (request: NextRequest) => {

    const path = request.nextUrl.pathname

    const isPublicPath = path === '/login' || path === '/signup' || path === '/'

    const token = request.cookies.get('token')?.value

    // Redirect logic
    if (isPublicPath && token) {
        // If user is logged in and tries to access login/signup, redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (!isPublicPath && !token) {
        // If user is not logged in and tries to access protected route, redirect to login
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()

}
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/",
        "/login",
        "/signup",
        "/dashboard",
        "/scan",
        '/((?!api|_next/static|_next/image|favicon.ico).*)',

    ],
}

