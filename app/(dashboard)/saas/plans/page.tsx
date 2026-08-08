"use client";

import { SaaSPlansPage } from "@/modules/super-admin";
import { WithPermission } from "@/components/Auth/WithPermission";
import { PERMISSIONS } from "@/constants/permission.constants";

function Page() {
  return <SaaSPlansPage />;
}

export default WithPermission(Page, {
  permission: PERMISSIONS.SAAS.SUBSCRIPTION_MANAGE,
  redirectTo: "/dashboard",
});
