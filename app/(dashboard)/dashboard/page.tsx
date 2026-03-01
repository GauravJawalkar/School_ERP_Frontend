import Logout from "@/components/Auth/Logout";
import Stats from "@/components/Commons/Stats";
import InstituteList from "@/components/Dashboard/SuperAdmin/InstituteList";
import { superAdminDashboardStats } from "@/data/dummySuperAdminStats";

export default function Home() {
  return (
    <div className="space-y-6">
      <Stats dashboardStats={superAdminDashboardStats} />
      <InstituteList />
      <Logout />
    </div>
  );
}
