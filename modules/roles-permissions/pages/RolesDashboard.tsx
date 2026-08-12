"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { ShieldCheck, KeyRound, Plus, Lock, Loader2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "@/shared_components/Commons/LoadingSpinner";

import RoleCard from "../components/RoleCard";
import PermissionMatrix from "../components/PermissionMatrix";
import CreateRoleDrawer from "../components/CreateRoleDrawer";
import DeleteRoleDrawer from "../components/DeleteRoleDrawer";
import { Role, PermissionGroup } from "../types/rolesPermissions.types";
import {
    useRolesList,
    usePermissionsList,
    useRolesPermissionsMutations
} from "../hooks/useRolesPermissions";

export default function RolesDashboard() {
    const [selectedRoleId, setSelectedRoleId] = useState<number>(2); // Default to SCHOOL_ADMIN
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const { user } = useAuthStore();
    const isSuperAdmin = user?.roles?.includes("SUPER_ADMIN") || false;

    const { data: dbRoles = [], isLoading } = useRolesList();
    const { data: dbPermissions = [], isLoading: isPermsLoading } = usePermissionsList();
    const {
        updatePermissionsMutation,
        createRoleMutation,
        deleteRoleMutation
    } = useRolesPermissionsMutations();

    const activePermissionsGroups = dbPermissions;
    const [roles, setRoles] = useState<Role[]>([]);
    const [stagedPermissions, setStagedPermissions] = useState<string[]>([]);

    useEffect(() => {
        if (dbRoles && dbRoles.length > 0) {
            setRoles(dbRoles);

            const exists = dbRoles.some((r) => r.id === selectedRoleId);
            const activeId = exists ? selectedRoleId : dbRoles[0].id;
            setSelectedRoleId(activeId);

            const activeRole = dbRoles.find((r) => r.id === activeId);
            if (activeRole) {
                setStagedPermissions(activeRole.permissions);
            }
        }
    }, [dbRoles]);

    const selectedRole = roles.find((r) => r.id === selectedRoleId) || roles[0];

    const isDirty = selectedRole ? (
        stagedPermissions.length !== selectedRole.permissions.length ||
        !stagedPermissions.every(p => selectedRole.permissions.includes(p))
    ) : false;

    const handleTogglePermission = (permissionSlug: string) => {
        if (selectedRole.isSystemRole && !isSuperAdmin) {
            toast.error("Default system roles are locked. Please provision a Custom Role to customize scopes.", {
                icon: "🔒",
                duration: 4000
            });
            return;
        }

        setStagedPermissions(prev =>
            prev.includes(permissionSlug)
                ? prev.filter((p) => p !== permissionSlug)
                : [...prev, permissionSlug]
        );
    };

    const handleResetPermissions = () => {
        if (selectedRole) {
            setStagedPermissions(selectedRole.permissions);
            toast.success("Pending changes discarded!");
        }
    };

    const handleSavePermissions = () => {
        const allFlattened = activePermissionsGroups.flatMap(g => g.permissions);
        const selectedPermissionIds = stagedPermissions
            .map(slug => allFlattened.find(p => p.slug === slug)?.id)
            .filter(Boolean) as number[];

        updatePermissionsMutation.mutate({
            roleId: selectedRole.id,
            permissions: selectedPermissionIds
        });
    };

    const handleCreateRole = (newRole: { name: string; description: string; baseRoleId: number }) => {
        const baseRole = roles.find(r => r.id === newRole.baseRoleId) || roles[1];

        const allFlattened = activePermissionsGroups.flatMap(g => g.permissions);
        const inheritedPermissionIds = baseRole.permissions
            .map(slug => allFlattened.find(p => p.slug === slug)?.id)
            .filter(Boolean) as number[];

        createRoleMutation.mutate({
            name: newRole.name,
            description: newRole.description,
            isSystemRole: isSuperAdmin,
            permissions: inheritedPermissionIds
        });

        setIsCreateOpen(false);
    };

    if (isLoading || isPermsLoading || roles.length === 0) {
        return <LoadingSpinner message="Loading Access Profiles..." containerHeight="h-[60vh]" />;
    }

    return (
        <div className="pb-12 space-y-8">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-light-border pb-5 gap-4">
                <div>
                    <h1 className="text-xl font-bold text-black flex items-center gap-2">
                        Security Roles & Scopes
                        <ShieldCheck size={18} className="text-black/80" />
                    </h1>
                    <p className="text-xs text-black/50 font-medium">Control fine-grained module access, adjust credentials privileges, and configure role matrices</p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsCreateOpen(true)}
                    className="h-9 px-4 rounded-lg bg-black text-white text-xs font-semibold hover:bg-black/90 transition flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                >
                    <Plus size={14} />
                    Provision Custom Role
                </button>
            </div>

            {/* Core warning info */}
            <div className="p-3 bg-gray-50 border border-light-border rounded-xl flex items-center gap-3 text-xs text-black/70 leading-none">
                <KeyRound size={14} className="text-black/85" />
                <span><strong>Access Sandbox:</strong> Custom administrative modifications apply dynamically across the entire school ecosystem.</span>
            </div>

            {/* Grid of Roles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roles.map((role) => (
                    <RoleCard
                        key={role.id}
                        role={role}
                        isSelected={role.id === selectedRoleId}
                        onSelect={() => {
                            setSelectedRoleId(role.id);
                            setStagedPermissions(role.permissions);
                        }}
                    />
                ))}
            </div>

            {/* Permissions Matrix Title */}
            <div className="border-t border-light-border pt-7">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3">
                    <div className="space-y-1">
                        <span className="text-xs font-medium text-black/45 uppercase tracking-widest block">Permission Matrix Scope</span>
                        <h2 className="text-sm font-semibold text-black flex items-center gap-2">
                            Configuring Privileges for role:
                            <span className="bg-neutral-100 border border-light-border px-2 py-0.5 rounded text-[10px] font-medium text-neutral-800">
                                {selectedRole.name}
                            </span>
                        </h2>
                    </div>

                    {selectedRole.isSystemRole && !isSuperAdmin && (
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full leading-none">
                            <Lock size={11} />
                            System Standard Locked
                        </div>
                    )}

                    {(!selectedRole.isSystemRole || isSuperAdmin) && (
                        <button
                            type="button"
                            onClick={() => setIsDeleteOpen(true)}
                            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 text-xs font-semibold transition cursor-pointer shadow-xs">
                            <Trash2 size={11} />
                            Delete Role
                        </button>
                    )}
                </div>

                {/* Matrix Table */}
                <PermissionMatrix
                    groups={activePermissionsGroups}
                    rolePermissions={selectedRole.permissions}
                    stagedPermissions={stagedPermissions}
                    isLocked={selectedRole.isSystemRole && !isSuperAdmin}
                    onToggle={handleTogglePermission}
                />
            </div>

            {/* Slide over Drawer for Role creation */}
            <CreateRoleDrawer
                isOpen={isCreateOpen}
                roles={roles}
                onClose={() => setIsCreateOpen(false)}
                onSave={handleCreateRole}
            />

            {/* Slide over Drawer for Role deletion */}
            <DeleteRoleDrawer
                isOpen={isDeleteOpen}
                role={selectedRole}
                onClose={() => setIsDeleteOpen(false)}
                onConfirmDelete={(roleId) => {
                    deleteRoleMutation.mutate(roleId, {
                        onSuccess: () => {
                            setIsDeleteOpen(false);
                        }
                    });
                }}
                isPending={deleteRoleMutation.isPending}
            />

            {/* Frosted Floating Save/Discard Actions Bar */}
            {isDirty && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl bg-black text-white px-5 py-3 rounded-xl shadow-2xl flex items-center justify-between border border-neutral-800 z-50 animate-in slide-in-from-bottom-5 duration-300 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-mono font-bold text-neutral-300">
                            {Math.abs(stagedPermissions.length - selectedRole.permissions.length) || "!"}
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-white leading-none">Unsaved Changes staged</p>
                            <p className="text-[9px] text-neutral-400 font-medium mt-0.5">Commit changes to sync database.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            onClick={handleResetPermissions}
                            className="h-7 px-3 rounded-lg border border-neutral-700 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold transition cursor-pointer"
                        >
                            Reset
                        </button>
                        <button
                            type="button"
                            onClick={handleSavePermissions}
                            disabled={updatePermissionsMutation.isPending}
                            className="h-7 px-3.5 rounded-lg bg-white hover:bg-neutral-100 text-black text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                        >
                            {updatePermissionsMutation.isPending ? (
                                <Loader2 size={11} className="animate-spin" />
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
