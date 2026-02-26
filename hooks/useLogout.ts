"use client"

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export function useLogout() {
    const { clearAuth } = useAuthStore();
    const router = useRouter();

    const logout = () => {
        clearAuth();
        router.replace('/login');
    }
    return { logout };
}