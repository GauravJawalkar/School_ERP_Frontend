"use client"

import { usePermission } from "@/hooks/usePermission";
import { CanAccessProps } from "@/interfaces/interface";

export function CanAccess({ children,
    permission,
    allOf,
    anyOf,
    role,
    anyRole,
    module,
    fallback = null }: CanAccessProps) {
    const { can, canAll, canAny, is, isAny, hasModule } = usePermission();

    const hasAccess =
        (!permission || can(permission)) &&
        (!allOf || canAll(allOf)) &&
        (!anyOf || canAny(anyOf)) &&
        (!role || is(role)) &&
        (!anyRole || isAny(anyRole)) &&
        (!module || hasModule(module));

    return hasAccess ? <>{children}</> : <>{fallback}</>;

}


// ─── USAGE EXAMPLES ──────────────────────────────────────────
//
// ── Hide entire section by module ────────────────────────────
// <CanAccess module="fees">
//   <FeesSection />
// </CanAccess>
//
// ── Hide a button by specific permission ─────────────────────
// <CanAccess permission="student.delete">
//   <button>Delete Student</button>
// </CanAccess>
//
// ── Show a fallback if no access ─────────────────────────────
// <CanAccess permission="report.financial" fallback={<p>No access</p>}>
//   <FinancialReport />
// </CanAccess>
//
// ── Require ANY of multiple permissions ──────────────────────
// <CanAccess anyOf={["marks.entry", "marks.edit"]}>
//   <MarksForm />
// </CanAccess>
//
// ── Role-based access ────────────────────────────────────────
// <CanAccess anyRole={["SUPER_ADMIN", "SCHOOL_ADMIN"]}>
//   <AdminSettings />
// </CanAccess>