"use client";

import { hasPermission, hasAllPermissions, hasAnyPermission, hasRole, hasAnyRole, hasModuleAccess } from "@/lib/configs/permissions";
import { useAuthStore } from "@/store/authStore";

export function usePermission() {
    const user = useAuthStore((state) => state?.user);

    const permissions: string[] = user?.permissions ?? [];
    const roles: string[] = user?.roles ?? [];
    const isSuperAdmin = roles.includes("SUPER_ADMIN");
    const isSchoolAdmin = roles.includes("SCHOOL_ADMIN");

    return {
        // Core checks
        /** Check a single permission: can("student.view") */
        can: (permission: string) =>
            isSuperAdmin || permissions.includes("*") || hasPermission(permissions, permission),

        /** Check user has ALL permissions: canAll(["fees.view", "fees.collect"]) */
        canAll: (required: string[]) =>
            isSuperAdmin || permissions.includes("*") || hasAllPermissions(permissions, required),

        /** Check user has ANY of the permissions: canAny(["marks.edit", "marks.entry"]) */
        canAny: (required: string[]) =>
            isSuperAdmin || permissions.includes("*") || hasAnyPermission(permissions, required),

        /** Check role: is("SUPER_ADMIN") */
        is: (role: string) =>
            hasRole(roles, role),

        /** Check any of multiple roles: isAny(["PRINCIPAL", "SCHOOL_ADMIN"]) */
        isAny: (required: string[]) =>
            hasAnyRole(roles, required),

        /** Check if user has access to any permission in a module: hasModule("fees") */
        hasModule: (module: string) =>
            isSuperAdmin || permissions.includes("*") || hasModuleAccess(permissions, module),

        // Raw values
        permissions,
        roles,

        // Convenience booleans
        isSuperAdmin,
        isSchoolAdmin,
        isTeacher: roles.includes("TEACHER"),
        isStudent: roles.includes("STUDENT"),
        isParent: roles.includes("PARENT"),
    };
}