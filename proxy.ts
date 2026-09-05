import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { tryRefreshAccessToken } from './lib/helpers/refreshAccessToken';

const PUBLIC_ROUTES = ["/login", "/forgot-password", "/reset-password"];
const SUPER_ADMIN_ONLY_ROUTES = ["/saas", "/saas/institutes", "/saas/billing", "/saas/settings", "/saas/plans", "/saas/subscriptions"];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const loginUrl = new URL("/login", request.url);

    const token = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    // 1. Root route "/" handling
    if (pathname === "/") {
        if (token || refreshToken) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        return NextResponse.redirect(loginUrl);
    }

    // 2. Public auth routes (/login, /forgot-password, /reset-password) -> Always allow
    const isPublic = PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));
    if (isPublic) {
        return NextResponse.next();
    }

    // 3. No refresh token and no access token on protected routes -> must login
    if (!refreshToken && !token) {
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 4. Access token missing but refresh token exists -> try to refresh
    if (!token && refreshToken) {
        const newAccessToken = await tryRefreshAccessToken(refreshToken);

        if (newAccessToken) {
            const nextResponse = NextResponse.next();
            nextResponse.cookies.set("accessToken", newAccessToken, {
                httpOnly: true,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24, // 1 day
            });
            return nextResponse;
        }

        loginUrl.searchParams.set("callbackUrl", pathname);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        return response;
    }

    // 5. Decode token for routing decisions
    try {
        const payloadBase64 = token!.split(".")[1];
        if (!payloadBase64) {
            throw new Error("Invalid token format");
        }
        const payload = JSON.parse(Buffer.from(payloadBase64, "base64").toString());
        const now = Math.floor(Date.now() / 1000);

        // 6. Token expired -> try refresh
        if (payload.exp && payload.exp < now) {
            if (refreshToken) {
                const newAccessToken = await tryRefreshAccessToken(refreshToken);

                if (newAccessToken) {
                    const nextResponse = NextResponse.next();
                    nextResponse.cookies.set("accessToken", newAccessToken, {
                        httpOnly: true,
                        sameSite: "lax",
                        secure: process.env.NODE_ENV === "production",
                        maxAge: 60 * 60 * 24,
                    });
                    return nextResponse;
                }
            }

            const response = NextResponse.redirect(loginUrl);
            response.cookies.delete("accessToken");
            response.cookies.delete("refreshToken");
            loginUrl.searchParams.set("callbackUrl", pathname);
            return response;
        }

        // 7. Protect SUPER_ADMIN only routes
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
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        return response;
    }
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};