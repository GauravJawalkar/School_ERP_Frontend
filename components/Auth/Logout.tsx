"use client"

import { useLogout } from "@/hooks/useLogout";

const Logout = () => {
    const { logout } = useLogout();
    return (
        <button onClick={() => logout()}>Logout</button>
    )
}

export default Logout