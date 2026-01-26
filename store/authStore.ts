import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
    accessToken: string | null;
    user: any | null;
    setAccessToken: (token: string) => void;
    setUser: (user: any) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => (
            {
                accessToken: null as string | null,
                user: null,
                setAccessToken: (token: string | null) => set({ accessToken: token }),
                setUser: (user) => set({ user }),
                clearAuth: () => set({ accessToken: null, user: null })
            }
        ),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage)
        }
    )
)