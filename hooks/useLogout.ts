"use client";

import { useAuthStore } from "@/store/authStore";
import { clearCookies } from "@/lib/helpers/clearCookies";

export function useLogout() {
    const { clearAuth } = useAuthStore();

    const logout = async () => {
        try {
            await clearCookies();
        } catch (e) {
            console.error("Error clearing cookies on logout:", e);
        }
        clearAuth();
        window.location.href = "/login";
    };

    return { logout };
}