import Logout from "@/components/Auth/Logout";
import Stats from "@/components/Commons/Stats";
import RevenueChart from "@/components/Dashboards/SuperAdmin/MonthlyRevenueChart";
import RevenueByPlanChart from "@/components/Dashboards/SuperAdmin/RevenueByPlanChart";
import RevenueTrendChart from "@/components/Dashboards/SuperAdmin/RevenueTrendChart";
import SubscriptionStatus from "@/components/Dashboards/SuperAdmin/SubscriptionStatus";
import TopRevenueInstitutesChart from "@/components/Dashboards/SuperAdmin/TopRevenueInstitutesChart";
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
