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
        if (!user) {
            return (
                <div className="flex h-64 w-full items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-800" />
                </div>
            );
        }

        // Access denied
        if (!hasAccess) {
            return (
                <div className="flex h-64 w-full flex-col items-center justify-center gap-3 text-center">
                    <div className="rounded-full bg-red-50 p-3 text-red-600">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-neutral-800">Access Restricted</h2>
                    <p className="max-w-md text-sm text-neutral-500">
                        You do not possess the required security permissions to view this resource.
                    </p>
                </div>
            );
        }

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
