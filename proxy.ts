import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

//  Routes that don't need authentication 
const PUBLIC_ROUTES = [
    "/",
    "/login",
    "/forgot-password",
    "/reset-password",
];

//  Routes only SUPER_ADMIN can access 
// (Fine-grained permission checks happen inside the page itself,
//  middleware only handles coarse role-based route blocking)
const SUPER_ADMIN_ONLY_ROUTES = [
    "/saas",
    "/saas/institutes",
    "/saas/billing",
    "/saas/settings",
];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Let public routes through 
    const isPublic = PUBLIC_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(route + "/")
    );
    if (isPublic) return NextResponse.next();

    //  2. Check for access token in cookies 
    // NOTE: For this to work, you need to also save the accessToken
    // as a cookie (httpOnly recommended) when login succeeds.
    // Your Zustand store uses localStorage, so set a parallel cookie.
    const token = request.cookies.get("accessToken")?.value;

    if (!token) {
        // No token → redirect to login, preserving where they wanted to go
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    //  3. Decode JWT payload (no verify — that's the backend's job) 
    // We just need the payload for routing decisions
    try {
        const payload = JSON.parse(
            Buffer.from(token.split(".")[1], "base64").toString()
        );

        //  4. Check token expiry 
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
            // Token expired → clear cookie and redirect to login
            const response = NextResponse.redirect(new URL("/login", request.url));
            response.cookies.delete("accessToken");
            return response;
        }

        //  5. Protect SUPER_ADMIN only routes 
        const isSuperAdminRoute = SUPER_ADMIN_ONLY_ROUTES.some(
            (route) => pathname === route || pathname.startsWith(route + "/")
        );

        if (isSuperAdminRoute) {
            const roles: string[] = payload.roles ?? [];
            if (!roles.includes("SUPER_ADMIN")) {
                return NextResponse.redirect(new URL("/dashboard", request.url));
            }
        }

        //  6. All checks passed 
        return NextResponse.next();

    } catch {
        // Malformed token → send to login
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("accessToken");
        return response;
    }
}

//  Tell Next.js which routes to run middleware on 
export const config = {
    matcher: [
        /*
         * Match all paths EXCEPT:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico
         * - public folder files
         */
        "/((?!_next/static|_next/image|favicon.ico|public/).*)",
    ],
};