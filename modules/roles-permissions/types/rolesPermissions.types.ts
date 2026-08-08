export interface Role {
    id: number;
    name: string;
    description: string;
    isSystemRole: boolean;
    permissionsCount: number;
    assignedUsersCount: number;
    permissions: string[];
}

export interface Permission {
    id: number;
    slug: string;
    description: string;
}

export interface PermissionGroup {
    module: string;
    displayName: string;
    permissions: Permission[];
}

export interface CreateRolePayload {
    name: string;
    description: string;
    isSystemRole: boolean;
    permissions: number[];
}

export interface UpdateRolePermissionsPayload {
    roleId: number;
    permissions: number[];
}
