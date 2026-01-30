import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
    accessToken: string | null;
    user: any | null;
    resetPasswordEmail: string | null;
    setAccessToken: (token: string) => void;
    setUser: (user: any) => void;
    setResetPasswordEmail: (email: string) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => (
            {
                accessToken: null as string | null,
                user: null,
                resetPasswordEmail: null as string | null,
                setAccessToken: (token: string | null) => set({ accessToken: token }),
                setUser: (user) => set({ user }),
                setResetPasswordEmail: (email) => set({ resetPasswordEmail: email }),
                clearAuth: () => set({ accessToken: null, user: null })
            }
        ),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage)
        }
    )
)