"use client"

import { usePermission } from "@/hooks/usePermission";
import { ProtectPageOptions } from "@/interfaces/interface";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function WithPermission<T extends object>(Component: React.ComponentType<T>, options: ProtectPageOptions) {
    return function ProtectedPage(props: T) {
        const router = useRouter();
        const user = useAuthStore((state) => state.user);
        const { can, canAny, canAll, is } = usePermission();

        const redirectTo = options.redirectTo ?? "/dashboard";

        const hasAccess =
            (!options.permission || can(options.permission)) &&
            (!options.anyOf || canAny(options.anyOf)) &&
            (!options.allOf || canAll(options.allOf)) &&
            (!options.role || is(options.role));

        useEffect(() => {
            if (user && !hasAccess) {
                router.replace(redirectTo);
            }
        }, [user, hasAccess, router]);

        // Still loading auth state
        if (!user) return <h1>Page Loader</h1>;

        // Access denied
        if (!hasAccess) return <h1>Access Denied</h1>;

        return <Component {...props} />;
    };
}

// ─── USAGE: Wrap your page exports ───────────────────────────
//
//  app/fees/page.tsx
// function FeesPage() {
//   return <div>Fees content...</div>
// }
// export default withPermission(FeesPage, {
//   permission: "fees.view",
// });
//
//  app/reports/financial/page.tsx
// function FinancialReportPage() { ... }
// export default withPermission(FinancialReportPage, {
//   anyOf: ["report.financial", "fees.report"],
// });
//
//  app/saas/page.tsx  (super admin only)
// function SaasPage() { ... }
// export default withPermission(SaasPage, {
//   role: "SUPER_ADMIN",
//   redirectTo: "/dashboard",
// });
