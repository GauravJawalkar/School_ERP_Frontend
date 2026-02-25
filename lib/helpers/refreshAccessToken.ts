import { BASE_URL } from "@/constants/constants";
import axios from "axios";

export async function tryRefreshAccessToken(refreshToken: string): Promise<string | null> {
    try {
        const response = await axios.post(
            `${BASE_URL}/auth/refreshToken`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                },
            }
        );

        if (response.data?.status === 200 && response.data?.accessToken) {
            return response.data.accessToken;
        }

        return null;
    } catch {
        return null;
    }
}