"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/interceptors/ApiClient";
import { BASE_URL } from "@/constants/constants";
import { useAuthStore } from "@/store/authStore";
import { usePermission } from "@/hooks/usePermission";
import { CanAccess } from "@/components/Auth/CanAccess";
import { Loader2, Plus, RefreshCw, Users, Building2 } from "lucide-react";
import toast from "react-hot-toast";

import StaffTable from "./StaffTable";
import CreateEditStaffDrawer from "./CreateEditStaffDrawer";

interface SchoolSummary {
    schoolId: number;
    schoolName: string;
    schoolSlug: string;
    schoolStatus: string;
}

export default function StaffDashboard() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const { isSuperAdmin } = usePermission();

    // Selected States
    const [selectedSchoolSlug, setSelectedSchoolSlug] = useState<string>("");
    const [selectedSchoolId, setSelectedSchoolId] = useState<number | undefined>(undefined);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<any | null>(null);

    // Dynamic scope
    const userSchoolSlug = user?.instituteDetails?.slug || "";
    const userSchoolId = user?.instituteDetails?.id;
    const currentSchoolSlug = isSuperAdmin ? selectedSchoolSlug : userSchoolSlug;
    const currentSchoolId = isSuperAdmin ? selectedSchoolId : userSchoolId;

    // 1. Query: Fetch Schools List (Super Admin Only)
    const { data: schools = [], isLoading: isSchoolsLoading } = useQuery<SchoolSummary[]>({
        queryKey: ["getSchoolsSettingsList"],
        queryFn: async () => {
            const response = await ApiClient.get(`${BASE_URL}/institute/allSchools`);
            return response.data?.data || [];
        },
        enabled: isSuperAdmin
    });

    // 2. Query: Fetch Security Roles (To assign in staff form)
    const { data: rolesResponse } = useQuery({
        queryKey: ["getRolesList"],
        queryFn: async () => {
            const response = await ApiClient.get(`${BASE_URL}/roles/getAllRoles`);
            return response.data?.data || [];
        }
    });
    const rolesList = Array.isArray(rolesResponse) ? rolesResponse : [];

    // 3. Query: Fetch Staff Members List
    const {
        data: staffMembers = [],
        isLoading: isStaffLoading,
        isRefetching: isStaffRefetching,
        refetch: refetchStaff
    } = useQuery({
        queryKey: ["getStaffList", currentSchoolId],
        queryFn: async () => {
            const response = await ApiClient.get(`${BASE_URL}/admin/staff`, {
                params: currentSchoolId ? { instituteId: currentSchoolId } : {}
            });
            return response.data?.data || [];
        },
        enabled: isSuperAdmin ? !!currentSchoolId : true
    });

    // 4. Mutation: Create Staff
    const createStaffMutation = useMutation({
        mutationFn: async (payload: any) => {
            const response = await ApiClient.post(`${BASE_URL}/admin/createStaff`, payload);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(data?.message || "Staff member registered successfully!");
            queryClient.invalidateQueries({ queryKey: ["getStaffList"] });
            setIsDrawerOpen(false);
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to register staff member.");
        }
    });

    // 5. Mutation: Update Staff
    const updateStaffMutation = useMutation({
        mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
            const response = await ApiClient.put(`${BASE_URL}/admin/staff/${id}`, payload);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(data?.message || "Staff profile updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["getStaffList"] });
            setIsDrawerOpen(false);
            setSelectedStaff(null);
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to update staff profile.");
        }
    });

    // 6. Mutation: Delete Staff
    const deleteStaffMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await ApiClient.delete(`${BASE_URL}/admin/staff/${id}`);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(data?.message || "Staff member deleted successfully.");
            queryClient.invalidateQueries({ queryKey: ["getStaffList"] });
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to delete staff member.");
        }
    });

    const handleOpenCreate = () => {
        setSelectedStaff(null);
        setIsDrawerOpen(true);
    };

    const handleOpenEdit = (staff: any) => {
        setSelectedStaff(staff);
        setIsDrawerOpen(true);
    };

    const handleFormSubmit = (payload: any) => {
        if (selectedStaff) {
            updateStaffMutation.mutate({
                id: selectedStaff.id,
                payload
            });
        } else {
            if (isSuperAdmin && currentSchoolId) {
                payload.reqInstId = currentSchoolId;
            }
            createStaffMutation.mutate(payload);
        }
    };

    const handleToggleStatus = (userId: string, nextStatus: boolean) => {
        const member = staffMembers.find((s: any) => s.userId === userId);
        if (member) {
            const confirmMsg = `Are you sure you want to ${nextStatus ? "activate" : "deactivate"} access for ${member.firstName}?`;
            if (window.confirm(confirmMsg)) {
                const payload = {
                    firstName: member.firstName,
                    lastName: member.lastName,
                    email: member.email,
                    phone: member.phone,
                    gender: member.gender,
                    isActive: nextStatus,
                    roleName: member.roleName,
                    employeeCode: member.employeeCode,
                    designation: member.designation,
                    department: member.department || "",
                    joiningDate: member.joiningDate ? new Date(member.joiningDate).toISOString().split("T")[0] : "",
                    salaryBasic: Number(member.salaryBasic) || 0,
                    bankName: member.bankDetails?.bankName || "",
                    bankAccHolderName: member.bankDetails?.bankAccHolderName || "",
                    bankAccNo: member.bankDetails?.bankAccNo || "",
                    bankIFSC: member.bankDetails?.bankIFSC || "",
                    bankBranchName: member.bankDetails?.bankBranchName || "",
                    bankAccType: member.bankDetails?.bankAccType || "SAVINGS",
                    upiId: member.bankDetails?.upiId || ""
                };
                updateStaffMutation.mutate({
                    id: member.id,
                    payload
                });
            }
        }
    };

    const handleDeleteStaff = (id: number) => {
        const confirmMsg = "Are you sure you want to permanently delete this staff member? This action cannot be undone and will cascade delete all logs and profiles associated with their account.";
        if (window.confirm(confirmMsg)) {
            deleteStaffMutation.mutate(id);
        }
    };

    const isDataLoading = isStaffLoading || (isSuperAdmin && isSchoolsLoading);

    const accessRestrictedFallback = (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white border border-light-border rounded-xl">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4 border border-red-100">
                <Users size={26} />
            </div>
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Access Restricted</h3>
            <p className="text-xs text-black/55 mt-1.5 max-w-sm leading-relaxed">
                You do not hold permissions to view the staff registry. Please contact your campus security administrator to request access.
            </p>
        </div>
    );

    return (
        <CanAccess permission="staff.view" fallback={accessRestrictedFallback}>
            <div className="pb-12 space-y-7 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-light-border pb-5 gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-black flex items-center gap-2">
                            Staff Directory
                            {isStaffRefetching && <RefreshCw size={14} className="animate-spin text-black/40" />}
                        </h1>
                        <p className="text-xs text-black/55 font-medium">
                            Register, manage, and configure system access and profiles for school operations staff.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={() => refetchStaff()}
                            disabled={isDataLoading || isStaffRefetching}
                            className="h-9 px-3 rounded-lg border border-light-border bg-white text-black/70 hover:text-black transition flex items-center justify-center hover:bg-neutral-55 cursor-pointer text-xs font-semibold gap-1.5"
                        >
                            <RefreshCw size={13} className={isStaffRefetching ? "animate-spin" : ""} />
                            Sync Registry
                        </button>

                        <CanAccess permission="staff.create">
                            {(currentSchoolSlug || !isSuperAdmin) && (
                                <button
                                    type="button"
                                    onClick={handleOpenCreate}
                                    className="h-9 px-4 rounded-lg bg-black text-white text-xs font-medium hover:bg-black/90 transition flex items-center gap-1.5 cursor-pointer"
                                >
                                    <Plus size={14} />
                                    Register Staff
                                </button>
                            )}
                        </CanAccess>
                    </div>
                </div>

                {/* School Scope Selection (Super Admin Only) */}
                {isSuperAdmin && (
                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-50/50 border border-light-border p-4 rounded-xl">
                        <div className="w-full sm:w-80 space-y-1">
                            <span className="text-[10px] font-bold text-black/45 uppercase tracking-wider block">Target School Campus:</span>
                            <div className="relative">
                                <Building2 size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
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
                                    className="w-full border border-input-border text-xs pl-9 pr-3 py-1.5 outline-none rounded-lg bg-white font-medium cursor-pointer"
                                >
                                    <option value="">Select campus scope</option>
                                    {schools.map((school) => (
                                        <option key={school.schoolId} value={school.schoolSlug}>
                                            {school.schoolName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Dashboard Main Content */}
                {isSuperAdmin && !selectedSchoolSlug ? (
                    <div className="h-[40vh] w-full flex flex-col items-center justify-center border border-dashed border-light-border rounded-xl p-8 bg-neutral-50/20 text-center">
                        <Building2 size={36} className="text-black/20 mb-3" />
                        <h3 className="font-semibold text-xs text-black uppercase tracking-wider">No Campus Scope Selected</h3>
                        <p className="text-[11px] text-black/45 mt-1 max-w-xs leading-relaxed">
                            Please select an educational campus registry from the dropdown above to view and manage staff details.
                        </p>
                    </div>
                ) : isStaffLoading ? (
                    <div className="h-[60vh] w-full flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-black" />
                        <span className="text-xs font-semibold text-black/50 tracking-wider uppercase">Loading Staff Directory...</span>
                    </div>
                ) : (
                    <StaffTable
                        staff={staffMembers}
                        onEdit={handleOpenEdit}
                        onDelete={handleDeleteStaff}
                        onToggleStatus={handleToggleStatus}
                    />
                )}

                {/* Slide-over Registration Panel */}
                <CreateEditStaffDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => {
                        setIsDrawerOpen(false);
                        setSelectedStaff(null);
                    }}
                    onSubmit={handleFormSubmit}
                    isSubmitting={createStaffMutation.isPending || updateStaffMutation.isPending}
                    staff={selectedStaff}
                    roles={rolesList}
                />
            </div>
        </CanAccess>
    );
}
