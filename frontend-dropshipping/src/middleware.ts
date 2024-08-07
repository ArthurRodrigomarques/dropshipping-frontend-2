import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value;
    const url = request.nextUrl.clone();
    const loginURL = new URL('/login', request.nextUrl.origin);
    const unauthorizedURL = new URL('/unauthorized', request.nextUrl.origin);

    const adminPaths = ['/admin', '/admin/adminproducts', "/admin/orders", '/admin/adminproducts/postproduct', "/admin/session/:id"];

    if (!token) {
        // Se não estiver autenticado
        if (adminPaths.includes(request.nextUrl.pathname) || request.nextUrl.pathname === "/cart") {
            return NextResponse.redirect(loginURL);
        }
        if (request.nextUrl.pathname === "/login") {
            return NextResponse.next();
        }
    } else {
        // Se estiver autenticado
        if (request.nextUrl.pathname === "/login") {
            return NextResponse.redirect(new URL('/', request.nextUrl.origin));
        }

        // Verificar se a rota admin é acessível
        if (adminPaths.includes(request.nextUrl.pathname)) {
            const userRoles = getUserRolesFromToken(token);
            if (!userRoles.includes('adm')) {
                return NextResponse.redirect(unauthorizedURL);
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/cart/:path*', '/admin/:path*', '/admin/session/:path*', '/login'],
};

function getUserRolesFromToken(token: string): string[] {
    try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        return decodedToken.roles || [];
    } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        return [];
    }
}
