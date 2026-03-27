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

export interface NavItem {
    label: string;
    href: string;
    icon: string; // Lucide icon name
    /** User needs this permission to see this item */
    permission?: string;
    /** User needs access to this module (any perm in module) */
    module?: string;
    /** User needs this role */
    role?: string;
    /** Sub-navigation items */
    children?: NavItem[];
}

export interface NavGroup {
    groupLabel: string;
    items: NavItem[];
}

export interface DashboardStata {
    id: number;
    title: string;
    value: number | string;
    subtitle: string;
    change: number; // percentage change from previous period
    period: string;
}

export interface StatItem {
    label: string;
    value: number;
    percentage?: number;
    type?: "active" | "expired" | "expiring" | "free";
    helper?: string;
};

export interface Action {
    label: string
    icon?: React.ReactNode
    onClick: () => void
    danger?: boolean
}

export interface schoolAdminsApi {
    schoolId: number;
    schoolName: string;
    schoolSlug: string;
    schoolStatus: string;
    affiliationNumber: string;
    schoolInfo: {
        emails: {
            primary: string
        },
        website: string;
        main_phone: string;
        office_hours: {
            sunday: string;
            saturday: string;
            monday_to_friday: string;
        },
        address_details: {
            area: string;
            city: string;
            state: string;
            pincode: string;
            landmark: string;
        }
    };
    admins: [
        {
            userId: string,
            firstName: string,
            lastName: string,
            email: string,
            phone: string,
            isActive: boolean,
            assignedAt: string
        }
    ]
}

export interface TableSkeletonProps {
    rows?: number
    columns?: number
    hasCheckbox?: boolean
    hasActions?: boolean
}

export interface schoolDataApi {
    schoolId: number;
    schoolName: string;
    schoolSlug: string;
    schoolStatus: string;
    affiliationNumber: string;
    schoolInfo: {
        emails: {
            primary: string
        },
        website: string;
        main_phone: string;
        office_hours: {
            sunday: string;
            saturday: string;
            monday_to_friday: string;
        },
        address_details: {
            area: string;
            city: string;
            state: string;
            pincode: string;
            landmark: string;
        }
    };
    totalStudents: number;
    totalStaff: number;
    createdAt: string | Date
}

export interface ErrorFallbackProps {
    refetch: () => void;
    title: string
}