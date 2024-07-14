import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value;

    const loginURL = new URL('/login', request.url);

    if (!token) {

        if (request.nextUrl.pathname === "/cart") {
            return NextResponse.redirect(loginURL);
        }
        if (request.nextUrl.pathname === "/login") {
            return NextResponse.next();
        }
    } else {

        if (request.nextUrl.pathname === "/login") {
            return NextResponse.redirect("/");
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/cart/:path*',"/admin/:path*" ,'/login']
};
