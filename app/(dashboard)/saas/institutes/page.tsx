"use client";

import { SaaSInstitutesDashboard } from "@/modules/super-admin";
import { WithPermission } from "@/shared_components/Auth/WithPermission";
import { PERMISSIONS } from "@/constants/permission.constants";

function Page() {
  return <SaaSInstitutesDashboard />;
}

export default WithPermission(Page, {
  permission: PERMISSIONS.SAAS.INSTITUTE_VIEW_ALL,
  redirectTo: "/dashboard",
});