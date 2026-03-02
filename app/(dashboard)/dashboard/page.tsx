import Logout from "@/components/Auth/Logout";
import Stats from "@/components/Commons/Stats";
import InstituteList from "@/components/Dashboard/SuperAdmin/InstituteList";
import RevenueChart from "@/components/Dashboard/SuperAdmin/MonthlyRevenueChart";
import RevenueByPlanChart from "@/components/Dashboard/SuperAdmin/RevenueByPlanChart";
import RevenueTrendChart from "@/components/Dashboard/SuperAdmin/RevenueTrendChart";
import SubscriptionStatus from "@/components/Dashboard/SuperAdmin/SubscriptionStatus";
import TopRevenueInstitutesChart from "@/components/Dashboard/SuperAdmin/TopRevenueInstitutesChart";
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
      <InstituteList />
      <Logout />
    </div>
  );
}
