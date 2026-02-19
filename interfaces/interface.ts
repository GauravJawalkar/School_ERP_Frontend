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

export interface CanAccessProps {
    children: React.ReactNode;

    /** Require a single permission */
    permission?: string;

    /** Require ALL of these permissions */
    allOf?: string[];

    /** Require ANY of these permissions */
    anyOf?: string[];

    /** Require this role */
    role?: string;

    /** Require ANY of these roles */
    anyRole?: string[];

    /** Require access to this module (any permission in module) */
    module?: string;

    /** What to render if access is denied (default: null) */
    fallback?: React.ReactNode;
}

export interface ProtectPageOptions {
    /** Require this permission to view the page */
    permission?: string;

    /** Require ANY of these permissions */
    anyOf?: string[];

    /** Require ALL of these permissions */
    allOf?: string[];

    /** Require this role */
    role?: string;

    /** Where to redirect if denied (default: "/dashboard") */
    redirectTo?: string;
}