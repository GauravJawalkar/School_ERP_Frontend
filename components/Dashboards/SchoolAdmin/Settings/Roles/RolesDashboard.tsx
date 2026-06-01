"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/interceptors/ApiClient";
import { BASE_URL } from "@/constants/constants";
import { useAuthStore } from "@/store/authStore";
import { Shield, ShieldAlert, ShieldCheck, KeyRound, Plus, Settings, HelpCircle, Lock, Loader2, ArrowRight, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import RoleCard from "./RoleCard";
import PermissionMatrix from "./PermissionMatrix";
import CreateRoleDrawer from "./CreateRoleDrawer";
import DeleteRoleDrawer from "./DeleteRoleDrawer";

export interface Role {
    id: number;
    name: string;
    description: string;
    isSystemRole: boolean;
    permissionsCount: number;
    assignedUsersCount: number;
    permissions: string[];
}

export interface PermissionGroup {
    module: string;
    displayName: string;
    permissions: {
        id: number;
        slug: string;
        description: string;
    }[];
}

export default function RolesDashboard() {
    const queryClient = useQueryClient();
    const [selectedRoleId, setSelectedRoleId] = useState<number>(2); // Default to SCHOOL_ADMIN
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const { user } = useAuthStore();
    const isSuperAdmin = user?.roles?.includes("SUPER_ADMIN") || false;

    // Fetch dynamic roles from the getRolesList backend endpoint
    const { data: dbRoles = [], isLoading } = useQuery<Role[]>({
        queryKey: ["getRolesList"],
        queryFn: async () => {
            const response = await ApiClient.get(`${BASE_URL}/roles/getAllRoles`);
            return response.data?.data || [];
        },
        refetchOnWindowFocus: false,
    });

    // Fetch all available permissions dynamically from database
    const { data: dbPermissions = [], isLoading: isPermsLoading } = useQuery<PermissionGroup[]>({
        queryKey: ["getAllPermissions"],
        queryFn: async () => {
            const response = await ApiClient.get(`${BASE_URL}/roles/getAllPermissions`);
            return response.data?.data || [];
        },
        refetchOnWindowFocus: false,
    });

    const activePermissionsGroups = dbPermissions;
    const [roles, setRoles] = useState<Role[]>([]);
    const [stagedPermissions, setStagedPermissions] = useState<string[]>([]);

    // Synchronize local state with backend roles once loaded
    useEffect(() => {
        if (dbRoles && dbRoles.length > 0) {
            setRoles(dbRoles);

            // Verify if the active selectedRoleId actually exists in the newly fetched database set.
            // If not (e.g. initial render fallback, or role deletion), fallback to first role ID.
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

    // Mutator: Assign Specific Permissions dynamically
    const updatePermissionsMutation = useMutation({
        mutationFn: async (payload: { roleId: number; permissions: number[] }) => {
            const response = await ApiClient.put(`${BASE_URL}/roles/updateRolePermissions`, payload);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Role configurations saved to database!");
            queryClient.invalidateQueries({ queryKey: ["getRolesList"] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to sync role permissions.");
        }
    });

    // Mutator: Create custom or system role dynamically
    const createRoleMutation = useMutation({
        mutationFn: async (payload: { name: string; description: string; isSystemRole: boolean; permissions: number[] }) => {
            const response = await ApiClient.post(`${BASE_URL}/roles/createRole`, payload);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success("Role created successfully in database!");
            queryClient.invalidateQueries({ queryKey: ["getRolesList"] });
            if (data?.data?.id) {
                setSelectedRoleId(data.data.id);
            }
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to create security role.");
        }
    });

    // Mutator: Delete custom or system role dynamically
    const deleteRoleMutation = useMutation({
        mutationFn: async (roleId: number) => {
            const response = await ApiClient.delete(`${BASE_URL}/roles/deleteRole`, {
                data: { roleId }
            });
            return response.data;
        },
        onSuccess: () => {
            toast.success("Role deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["getRolesList"] });
            setSelectedRoleId(2); // Safely fall back to SCHOOL_ADMIN
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to delete role.");
        }
    });

    const handleTogglePermission = (permissionSlug: string) => {
        // Guard system default roles against non-SuperAdmin modification
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

        // Inherit base role's current permissions
        const allFlattened = activePermissionsGroups.flatMap(g => g.permissions);
        const inheritedPermissionIds = baseRole.permissions
            .map(slug => allFlattened.find(p => p.slug === slug)?.id)
            .filter(Boolean) as number[];

        createRoleMutation.mutate({
            name: newRole.name,
            description: newRole.description,
            isSystemRole: isSuperAdmin, // Automatically create as system role if SUPER_ADMIN
            permissions: inheritedPermissionIds
        });

        setIsCreateOpen(false);
    };

    if (isLoading || isPermsLoading || roles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <Loader2 className="animate-spin text-neutral-800" size={24} />
                <p className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400">Loading Access Profiles...</p>
            </div>
        );
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
