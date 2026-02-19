"use client"


// The MAIN hook you'll use in every component and page.
// Reads directly from your Zustand authStorage.

import { hasPermission, hasAllPermissions, hasAnyPermission, hasRole, hasAnyRole, hasModuleAccess } from "@/lib/permissions";
import { useAuthStore } from "@/store/authStore";

export function usePermission() {
    // ── Pull directly from your Zustand store ─────────────────
    const user = useAuthStore((state) => state?.user);

    const permissions: string[] = user?.permissions ?? [];
    const roles: string[] = user?.roles ?? [];

    return {
        // Core checks

        /** Check a single permission: can("student.view") */
        can: (permission: string) =>
            hasPermission(permissions, permission),

        /** Check user has ALL permissions: canAll(["fees.view", "fees.collect"]) */
        canAll: (required: string[]) =>
            hasAllPermissions(permissions, required),

        /** Check user has ANY of the permissions: canAny(["marks.edit", "marks.entry"]) */
        canAny: (required: string[]) =>
            hasAnyPermission(permissions, required),

        /** Check role: is("SUPER_ADMIN") */
        is: (role: string) =>
            hasRole(roles, role),

        /** Check any of multiple roles: isAny(["PRINCIPAL", "SCHOOL_ADMIN"]) */
        isAny: (required: string[]) =>
            hasAnyRole(roles, required),

        /** Check if user has access to any permission in a module: hasModule("fees") */
        hasModule: (module: string) =>
            hasModuleAccess(permissions, module),

        // ── Raw values (useful for conditional rendering logic) ──
        permissions,
        roles,

        // ── Convenience booleans for common patterns ─────────────
        isSuperAdmin: roles.includes("SUPER_ADMIN"),
        isSchoolAdmin: roles.includes("SCHOOL_ADMIN"),
        isTeacher: roles.includes("TEACHER"),
        isStudent: roles.includes("STUDENT"),
        isParent: roles.includes("PARENT"),
    };
}