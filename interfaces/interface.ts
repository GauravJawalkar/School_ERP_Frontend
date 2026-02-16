export interface User {
    id: number;
    name: string;
    email: string;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}

export type Permission = string;
export type Role = string;