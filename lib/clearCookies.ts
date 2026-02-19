"use server"
import { cookies } from "next/headers";

export async function clearCookies() {
    // Clear accessToken and refreshToken cookies
    (await cookies()).delete("accessToken");
    (await cookies()).delete("refreshToken");
}