"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/interceptors/ApiClient";
import { BASE_URL } from "@/constants/constants";
import { CanAccess } from "@/shared_components/Auth/CanAccess";
import { usePermission } from "@/hooks/usePermission";
import { Loader2, Plus, UserCheck, Users, ShieldAlert, RefreshCw, Landmark } from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "@/shared_components/Commons/LoadingSpinner";

import StaffTable from "../components/staff/StaffTable";
import CreateEditStaffDrawer from "../components/staff/CreateEditStaffDrawer";

interface SchoolSummary {
    schoolId: number;
    schoolName: string;
    schoolSlug: string;
    schoolStatus: string;
}

export default function StaffDashboard() {
    const queryClient = useQueryClient();
    const { isSuperAdmin, can } = usePermission();
    const canCreate = can("staff.create");

    // Selected states
    const [selectedSchoolSlug, setSelectedSchoolSlug] = useState<string>("");
    const [selectedSchoolId, setSelectedSchoolId] = useState<number | undefined>(undefined);

    // Slide-over Drawer States
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<any | null>(null);

    // 1. Query: Fetch Schools Directory (Super Admin Only)
    const { data: schools = [], isLoading: isSchoolsLoading } = useQuery<SchoolSummary[]>({
        queryKey: ["getSchoolsSettingsList"],
        queryFn: async () => {
            const response = await ApiClient.get(`${BASE_URL}/institute/allSchools`);
            const rawSchools = response.data?.data || [];
            return rawSchools.map((s: any) => ({
                schoolId: Number(s.id || s.schoolId),
                schoolName: s.schoolName || s.name || "School",
                schoolSlug: s.slug || s.schoolSlug || "",
                schoolStatus: s.status || s.schoolStatus || "ACTIVE"
            }));
        },
        enabled: isSuperAdmin
    });

    // 2. Query: Fetch Roles for Role Assignment Dropdown inside drawer
    const { data: dbRoles = [] } = useQuery({
        queryKey: ["getRolesList"],
        queryFn: async () => {
            const response = await ApiClient.get(`${BASE_URL}/roles/getAllRoles`);
            return response.data?.data || [];
        }
    });

    // 3. Query: Fetch Staff Members list
    const {
        data: staffList = [],
        isLoading: isStaffLoading,
        isRefetching: isStaffRefetching,
        refetch: refetchStaff
    } = useQuery({
        queryKey: ["getStaffList", selectedSchoolId],
        queryFn: async () => {
            let url = `${BASE_URL}/admin/staff`;
            if (isSuperAdmin && selectedSchoolId) {
                url += `?instituteId=${selectedSchoolId}`;
            }
            const response = await ApiClient.get(url);
            return response.data?.data || [];
        },
        enabled: isSuperAdmin ? !!selectedSchoolId : true
    });

    // Mutation: Create New Staff Credentials
    const createStaffMutation = useMutation({
        mutationFn: async (payload: any) => {
            if (isSuperAdmin && selectedSchoolId) {
                payload.instituteId = selectedSchoolId;
            }
            const response = await ApiClient.post(`${BASE_URL}/admin/createStaff`, payload);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Staff profile and security login credentials created!");
            queryClient.invalidateQueries({ queryKey: ["getStaffList"] });
            setIsDrawerOpen(false);
            setSelectedStaff(null);
        },
        onError: (err: any) => {
            const serverMsg = err?.response?.data?.message || "Failed to create staff member.";
            toast.error(serverMsg);
        }
    });

    // Mutation: Update Existing Staff Details
    const updateStaffMutation = useMutation({
        mutationFn: async ({ staffId, payload }: { staffId: number | string; payload: any }) => {
            const response = await ApiClient.put(`${BASE_URL}/admin/updateStaff/${staffId}`, payload);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Staff profile updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["getStaffList"] });
            setIsDrawerOpen(false);
            setSelectedStaff(null);
        },
        onError: (err: any) => {
            const serverMsg = err?.response?.data?.message || "Failed to update staff member.";
            toast.error(serverMsg);
        }
    });

    // Mutation: Update Staff Active / Inactive Status
    const toggleStatusMutation = useMutation({
        mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
            const response = await ApiClient.patch(`${BASE_URL}/institute/updateUserStatus`, {
                userId,
                isActive
            });
            return response.data;
        },
        onSuccess: (_, variables) => {
            toast.success(`Staff account ${variables.isActive ? "reactivated" : "deactivated"} successfully!`);
            queryClient.invalidateQueries({ queryKey: ["getStaffList"] });
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to alter active account status.");
        }
    });

    // Mutation: Delete Staff Member
    const deleteStaffMutation = useMutation({
        mutationFn: async (staffId: number | string) => {
            const response = await ApiClient.delete(`${BASE_URL}/admin/deleteStaff/${staffId}`);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Staff profile permanently deleted!");
            queryClient.invalidateQueries({ queryKey: ["getStaffList"] });
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to delete staff member.");
        }
    });

    const handleCreateOrEditSubmit = (formData: any) => {
        if (selectedStaff) {
            const targetId = (selectedStaff.id && selectedStaff.id > 0) ? selectedStaff.id : selectedStaff.userId;
            updateStaffMutation.mutate({ staffId: targetId, payload: formData });
        } else {
            createStaffMutation.mutate(formData);
        }
    };

    const handleOpenEdit = (staff: any) => {
        setSelectedStaff(staff);
        setIsDrawerOpen(true);
    };

    const handleOpenCreate = () => {
        setSelectedStaff(null);
        setIsDrawerOpen(true);
    };

    const handleToggleStatus = (userId: string, isActive: boolean) => {
        toggleStatusMutation.mutate({ userId, isActive });
    };

    const handleDeleteStaff = (staffId: number | string) => {
        if (window.confirm("Are you sure you want to permanently remove this staff profile?")) {
            deleteStaffMutation.mutate(staffId);
        }
    };

    if (isSuperAdmin && isSchoolsLoading) {
        return <LoadingSpinner message="Querying Campus Directory..." containerHeight="h-[60vh]" />;
    }

    return (
        <CanAccess anyRole={["SUPER_ADMIN", "SCHOOL_ADMIN"]}>
            <div className="pb-12 space-y-7">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-light-border pb-5 gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-black flex items-center gap-2">
                            Staff & HR Directory
                            {isStaffRefetching && <RefreshCw size={14} className="animate-spin text-black/40" />}
                        </h1>
                        <p className="text-xs text-black/50 font-medium">
                            Manage employee directory, assign departmental roles, and maintain payroll banking credentials.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={() => refetchStaff()}
                            className="h-9 px-3 rounded-lg border border-light-border bg-white text-black/70 hover:text-black transition flex items-center justify-center hover:bg-neutral-50 cursor-pointer text-xs font-semibold gap-1.5"
                        >
                            <RefreshCw size={13} className={isStaffRefetching ? "animate-spin" : ""} />
                            Sync Roster
                        </button>

                        {canCreate && (selectedSchoolId || !isSuperAdmin) && (
                            <button
                                type="button"
                                onClick={handleOpenCreate}
                                className="h-9 px-4 rounded-lg bg-black text-white text-xs font-semibold hover:bg-black/90 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                                <Plus size={14} />
                                Add Staff Member
                            </button>
                        )}
                    </div>
                </div>

                {/* School Scope Selector for Super Admins */}
                {isSuperAdmin && (
                    <div className="p-4 bg-white border border-light-border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                        <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-black/45 uppercase tracking-widest block font-mono">Administrative Scope Selector</span>
                            <span className="text-xs font-semibold text-black/70">Select campus location to manage employee directory</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs font-bold text-black/50">Campus:</span>
                            <select
                                value={selectedSchoolSlug}
                                onChange={(e) => {
                                    const slug = e.target.value;
                                    setSelectedSchoolSlug(slug);
                                    if (slug) {
                                        const school = schools.find((s) => s.schoolSlug === slug);
                                        setSelectedSchoolId(school ? school.schoolId : undefined);
                                    } else {
                                        setSelectedSchoolId(undefined);
                                    }
                                }}
                                className="border border-input-border text-xs px-3 py-1.5 outline-none rounded-lg focus:ring-2 focus:ring-black/10 bg-white font-semibold cursor-pointer min-w-60"
                            >
                                <option value="">Select Campus Location</option>
                                {schools.map((school) => (
                                    <option key={school.schoolId} value={school.schoolSlug}>
                                        {school.schoolName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {/* Main Content Area */}
                {isSuperAdmin && !selectedSchoolId ? (
                    <div className="h-[40vh] w-full flex flex-col items-center justify-center border border-dashed border-light-border rounded-xl p-8 bg-neutral-50/20 text-center">
                        <Landmark size={36} className="text-black/20 mb-3" />
                        <h3 className="font-semibold text-xs text-black uppercase tracking-wider">No Campus Location Selected</h3>
                        <p className="text-[11px] text-black/45 mt-1 max-w-xs leading-relaxed">
                            Please pick a campus location from the selector above to manage employee profiles and HR records.
                        </p>
                    </div>
                ) : isStaffLoading ? (
                    <LoadingSpinner message="Loading staff profiles..." containerHeight="h-[40vh]" />
                ) : (
                    <StaffTable
                        staff={staffList}
                        onEdit={handleOpenEdit}
                        onDelete={handleDeleteStaff}
                        onToggleStatus={handleToggleStatus}
                    />
                )}

                {/* Create & Edit Staff Drawer */}
                <CreateEditStaffDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => {
                        setIsDrawerOpen(false);
                        setSelectedStaff(null);
                    }}
                    onSubmit={handleCreateOrEditSubmit}
                    isSubmitting={createStaffMutation.isPending || updateStaffMutation.isPending}
                    staff={selectedStaff}
                    roles={dbRoles}
                />
            </div>
        </CanAccess>
    );
}
