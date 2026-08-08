// Public API Barrel Export for SuperAdmin Module

// Pages
export { SaaSPlansPage } from "./pages/SaaSPlansPage";
export { SaaSSubscriptionsPage } from "./pages/SaaSSubscriptionsPage";
export { SaaSBillingPage } from "./pages/SaaSBillingPage";
export { SaaSInstitutesDashboard } from "./pages/SaaSInstitutesDashboard";
export { SaaSSettingsDashboard } from "./pages/SaaSSettingsDashboard";
export { SchoolDetails } from "./pages/SchoolDetails";
export { EditSchoolDetails } from "./pages/EditSchoolDetails";
export { SubscriptionDashboard } from "./pages/SubscriptionDashboard";
export { SchoolAnalyticsDashboard } from "./pages/SchoolAnalyticsDashboard";

// Components & Tables
export { PlansTable } from "./components/PlansTable";
export { CreatePlanModal } from "./components/CreatePlanModal";
export { SubscriptionsTable } from "./components/SubscriptionsTable";
export { TransactionsTable } from "./components/TransactionsTable";
export { default as SaaSInstitutesTable } from "./components/tables/SaaSInstitutesTable";
export { SchoolAdminsTable } from "./components/tables/SchoolAdminsTable";
export { InstituteTable } from "./components/tables/InstituteTable";
export { ActiveSubscriptionsTable } from "./components/tables/ActiveSubscriptionsTable";

// Charts
export { MonthlyRevenueChart } from "./components/charts/MonthlyRevenueChart";
export { RevenueByPlanChart } from "./components/charts/RevenueByPlanChart";
export { RevenueTrendChart } from "./components/charts/RevenueTrendChart";
export { SubscriptionStatus } from "./components/charts/SubscriptionStatus";
export { TopRevenueInstitutesChart } from "./components/charts/TopRevenueInstitutesChart";

// Analytics
export { AnalyticsStatsGrid } from "./components/analytics/AnalyticsStatsGrid";
export { RegistrationGrowthChart } from "./components/analytics/RegistrationGrowthChart";
export { BoardDistributionChart } from "./components/analytics/BoardDistributionChart";
export { TierMarketShareChart } from "./components/analytics/TierMarketShareChart";
export { TopEnrollmentList } from "./components/analytics/TopEnrollmentList";

// Drawers & Modals
export { default as SaaSChangeTierDrawer } from "./components/drawers/SaaSChangeTierDrawer";
export { default as SaaSQuotaOverrideDrawer } from "./components/drawers/SaaSQuotaOverrideDrawer";
export { default as AddAdminModal } from "./components/drawers/AddAdminModal";

// School Details Section Components
export { SchoolHero } from "./components/school-details/SchoolHero";
export { SchoolStats } from "./components/school-details/SchoolStats";
export { SchoolAdminsSection } from "./components/school-details/SchoolAdminsSection";
export { SchoolSubscriptionSection } from "./components/school-details/SchoolSubscriptionSection";
export { SchoolAcademicsSection } from "./components/school-details/SchoolAcademicsSection";

// Hooks
export {
  useSaaSPlans,
  useSaaSSubscriptions,
  useSaaSTransactions,
  useSaaSMutations,
} from "./hooks/useSaaS";

// Services & Types
export { saasService } from "./api/saas.service";
export * from "./types/saas.types";
export * from "./constants/saas.constants";
