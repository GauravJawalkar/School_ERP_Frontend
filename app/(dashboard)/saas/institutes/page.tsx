"use client";

import { SaaSInstitutesDashboard } from "@/modules/super-admin";
import { WithPermission } from "@/components/Auth/WithPermission";
import { PERMISSIONS } from "@/constants/permission.constants";

function Page() {
  return <SaaSInstitutesDashboard />;
}

export default WithPermission(Page, {
  permission: PERMISSIONS.SAAS.SETTINGS_MANAGE,
  redirectTo: "/dashboard",
});