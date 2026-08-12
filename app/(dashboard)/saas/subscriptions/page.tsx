"use client";

import { SaaSSubscriptionsPage } from "@/modules/super-admin";
import { WithPermission } from "@/shared_components/Auth/WithPermission";
import { PERMISSIONS } from "@/constants/permission.constants";

function Page() {
  return <SaaSSubscriptionsPage />;
}

export default WithPermission(Page, {
  permission: PERMISSIONS.SAAS.SUBSCRIPTION_MANAGE,
  redirectTo: "/dashboard",
});