"use client"

import { useAuthStore } from "@/store/authStore"

const Logout = () => {
    const { clearAuth } = useAuthStore();
    return (
        <button onClick={() => clearAuth()}>Logout</button>
    )
}

export default Logout