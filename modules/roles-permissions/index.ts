// Public API Barrel Export for Roles & Permissions Module

export { default as RolesDashboard } from "./pages/RolesDashboard";
export { default as RoleCard } from "./components/RoleCard";
export { default as PermissionMatrix } from "./components/PermissionMatrix";
export { default as CreateRoleDrawer } from "./components/CreateRoleDrawer";
export { default as DeleteRoleDrawer } from "./components/DeleteRoleDrawer";

export * from "./hooks/useRolesPermissions";
export * from "./api/rolesPermissions.service";
export * from "./types/rolesPermissions.types";
export * from "./constants/rolesPermissions.constants";
export * from "./lib/rolesPermissions.utils";
