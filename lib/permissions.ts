// Core permission utilities - import these everywhere

import { Permission, Role } from "@/interfaces/interface";

// Single permission check 
export function hasPermission(
    userPermissions: Permission[],
    required: Permission
): boolean {
    return userPermissions.includes(required);
}

// Check if user has ALL of the required permissions 
export function hasAllPermissions(
    userPermissions: Permission[],
    required: Permission[]
): boolean {
    return required.every((p) => userPermissions.includes(p));
}

// Check if user has ANY of the required permissions
export function hasAnyPermission(
    userPermissions: Permission[],
    required: Permission[]
): boolean {
    return required.some((p) => userPermissions.includes(p));
}

// Check role 
export function hasRole(userRoles: Role[], required: Role): boolean {
    return userRoles.includes(required);
}

export function hasAnyRole(userRoles: Role[], required: Role[]): boolean {
    return required.some((r) => userRoles.includes(r));
}

// Module-level check (e.g. any "fees.*" permission) 
export function hasModuleAccess(
    userPermissions: Permission[],
    module: string
): boolean {
    return userPermissions.some((p) => p.startsWith(`${module}.`));
}

// Extract module from permission string 
export function getModule(permission: Permission): string {
    return permission.split(".")[0];
}

// Group permissions by module 
export function groupPermissionsByModule(permissions: Permission[]): Record<string, Permission[]> {
    return permissions.reduce((acc, perm) => {
        const module = getModule(perm);
        if (!acc[module]) acc[module] = [];
        acc[module].push(perm);
        return acc;
    }, {} as Record<string, Permission[]>);
}