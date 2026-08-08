// Public API Barrel Export for SchoolAdmin Module

// Re-export settings & roles dashboards from modular domains
export { AcademicYearDashboard, InstituteDashboard, SchoolUsersDashboard } from "@/modules/settings";
export { RolesDashboard } from "@/modules/roles-permissions";

// Non-settings Dashboards
export { default as AdmissionsDashboard } from "./pages/AdmissionsDashboard";
export { default as StaffDashboard } from "./pages/StaffDashboard";
export { default as TeachersDashboard } from "./pages/TeachersDashboard";

// Re-export settings components from settings domain
export {
  SchoolsTable,
  SchoolProfileOverview,
  FacultyTable,
  ClassesTable,
  FeesTable,
  AddClassDrawer,
  EditClassDrawer,
  AddSectionDrawer,
  EditSectionDrawer,
  DeleteClassDrawer,
  DeleteSectionDrawer,
  MapClassFeeDrawer,
  AddFeeCategoryDrawer,
  EditClassFeeDrawer,
  DeleteFeeStructureDrawer
} from "@/modules/settings";

export { default as AddSchoolForm } from "@/modules/settings/components/forms/AddSchoolForm";

// Re-export Hooks & Utilities from settings
export {
  useSchoolsList,
  useSchoolDetails,
  useAcademicYears,
  useFeeHeads,
  useSchoolAdminMutations,
  SCHOOL_ADMIN_QUERY_KEYS,
  getMappedSchoolData
} from "@/modules/settings";

// Services & Types
export { schoolAdminService } from "./api/schoolAdmin.service";
export * from "./types/schoolAdmin.types";
export * from "./constants/schoolAdmin.constants";
export * from "./lib/schoolAdmin.utils";
