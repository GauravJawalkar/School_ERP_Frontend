"use client";

import { SaaSBillingPage } from "@/modules/super-admin";
import { WithPermission } from "@/shared_components/Auth/WithPermission";
import { PERMISSIONS } from "@/constants/permission.constants";

function Page() {
  return <SaaSBillingPage />;
}

export default WithPermission(Page, {
  permission: PERMISSIONS.SAAS.BILLING_VIEW,
  redirectTo: "/dashboard",
});