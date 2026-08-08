import Logout from "@/components/Auth/Logout";
import Stats from "@/components/Commons/Stats";
import {
  MonthlyRevenueChart as RevenueChart,
  RevenueByPlanChart,
  RevenueTrendChart,
  SubscriptionStatus,
  TopRevenueInstitutesChart,
} from "@/modules/super-admin";
import { superAdminDashboardStats } from "@/data/dummySuperAdminStats";

export default function Home() {
  return (
    <div className="space-y-6">
      <Stats dashboardStats={superAdminDashboardStats} />
      <div className="grid grid-cols-2 gap-6">
        <RevenueChart />
        <RevenueByPlanChart />
        <SubscriptionStatus />
        <RevenueTrendChart />
      </div>
      <TopRevenueInstitutesChart />
      <Logout />
    </div>
  );
}
