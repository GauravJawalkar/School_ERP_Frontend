import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { tryRefreshAccessToken } from './lib/helpers/refreshAccessToken';

const PUBLIC_ROUTES = ["/", "/login", "/forgot-password", "/reset-password"];
const SUPER_ADMIN_ONLY_ROUTES = ["/saas", "/saas/institutes", "/saas/billing", "/saas/settings"];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const loginUrl = new URL("/login", request.url);

    // 1. Let public routes through
    const isPublic = PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));
    if (isPublic) return NextResponse.next();

    const token = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    // 2. No refresh token at all → must login
    if (!refreshToken) {
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 3. Access token missing but refresh token exists → try to refresh
    if (!token && refreshToken) {
        const newAccessToken = await tryRefreshAccessToken(refreshToken);

        if (newAccessToken) {
            // If Successfully refreshed — set new cookie and continue
            const nextResponse = NextResponse.next();
            nextResponse.cookies.set("accessToken", newAccessToken, {
                httpOnly: true,
                sameSite: "lax",
                secure: false,
                maxAge: 2 * 60,//2 minutes for testing
            });
            return nextResponse;
        }

        // Refresh failed → go to login
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 4. Decode token for routing decisions (no verify, backend does that)
    try {
        const payload = JSON.parse(Buffer.from(token!.split(".")[1], "base64").toString());

        const now = Math.floor(Date.now() / 1000);

        // 5. Token expired → try refresh before giving up
        if (payload.exp && payload.exp < now) {
            const newAccessToken = await tryRefreshAccessToken(refreshToken);

            if (newAccessToken) {
                const nextResponse = NextResponse.next();
                nextResponse.cookies.set("accessToken", newAccessToken, {
                    httpOnly: true,
                    sameSite: "lax",
                    secure: false,
                    maxAge: 2 * 60,
                });
                return nextResponse;
            }

            // Both expired → logout
            const response = NextResponse.redirect(new URL("/login", request.url));
            response.cookies.delete("accessToken");
            loginUrl.searchParams.set("callbackUrl", pathname);
            return response;
        }

        // 6. Protect SUPER_ADMIN only routes
        const isSuperAdminRoute = SUPER_ADMIN_ONLY_ROUTES.some(
            (route) => pathname === route || pathname.startsWith(route + "/")
        );

        if (isSuperAdminRoute) {
            const roles: string[] = payload.roles ?? [];
            if (!roles.includes("SUPER_ADMIN")) {
                return NextResponse.redirect(new URL("/dashboard", request.url));
            }
        }

        return NextResponse.next();

    } catch {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("accessToken");
        return response;
    }
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)",],
};