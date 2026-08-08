// Export Types
export * from "./types/settings.types";

// Export Services / API
export * from "./api/settings.service";

// Export Hooks
export * from "./hooks/useSchoolAdmin";

// Export Pages
export { default as InstituteDashboard } from "./pages/InstituteDashboard";
export { default as AcademicYearDashboard } from "./pages/AcademicYearDashboard";
export { default as SchoolUsersDashboard } from "./pages/SchoolUsersDashboard";

// Export Components - Institute
export { default as SchoolsTable } from "./components/institute/SchoolsTable";
export { default as SchoolProfileOverview } from "./components/institute/SchoolProfileOverview";
export { default as FacultyTable } from "./components/institute/FacultyTable";
export { default as ClassesTable } from "./components/institute/ClassesTable";
export { default as FeesTable } from "./components/institute/FeesTable";
export { default as AddClassDrawer } from "./components/institute/AddClassDrawer";
export { default as EditClassDrawer } from "./components/institute/EditClassDrawer";
export { default as AddSectionDrawer } from "./components/institute/AddSectionDrawer";
export { default as EditSectionDrawer } from "./components/institute/EditSectionDrawer";
export { default as DeleteClassDrawer } from "./components/institute/DeleteClassDrawer";
export { default as DeleteSectionDrawer } from "./components/institute/DeleteSectionDrawer";
export { default as MapClassFeeDrawer } from "./components/institute/MapClassFeeDrawer";
export { default as AddFeeCategoryDrawer } from "./components/institute/AddFeeCategoryDrawer";
export { default as EditClassFeeDrawer } from "./components/institute/EditClassFeeDrawer";
export { default as DeleteFeeStructureDrawer } from "./components/institute/DeleteFeeStructureDrawer";

// Export Components - Academic Year
export { default as AcademicYearStats } from "./components/academic-year/AcademicYearStats";
export { default as AcademicYearTable } from "./components/academic-year/AcademicYearTable";
export { default as CreateAcademicYearDrawer } from "./components/academic-year/CreateAcademicYearDrawer";

// Export Components - Users
export { default as SchoolUsersStats } from "./components/users/SchoolUsersStats";
export { default as SchoolUsersTable } from "./components/users/SchoolUsersTable";
export { default as SchoolUserDrawer } from "./components/users/SchoolUserDrawer";

// Export Components - Forms
export { default as AddSchoolForm } from "./components/forms/AddSchoolForm";

// Export Utils
export * from "./lib/settings.utils";
