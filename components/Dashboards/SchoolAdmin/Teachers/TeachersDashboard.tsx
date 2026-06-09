"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/interceptors/ApiClient";
import { BASE_URL } from "@/constants/constants";
import { useAuthStore } from "@/store/authStore";
import { usePermission } from "@/hooks/usePermission";
import { CanAccess } from "@/components/Auth/CanAccess";
import { Loader2, Plus, RefreshCw, GraduationCap, Building2 } from "lucide-react";
import toast from "react-hot-toast";

import TeachersTable from "./TeachersTable";
import CreateEditTeacherDrawer from "./CreateEditTeacherDrawer";

interface SchoolSummary {
    schoolId: number;
    schoolName: string;
    schoolSlug: string;
    schoolStatus: string;
}

export default function TeachersDashboard() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const { isSuperAdmin } = usePermission();

    // Selected States (For Super Admins)
    const [selectedSchoolSlug, setSelectedSchoolSlug] = useState<string>("");
    const [selectedSchoolId, setSelectedSchoolId] = useState<number | undefined>(undefined);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);

    // Dynamic scoping of institute details
    const userSchoolSlug = user?.instituteDetails?.slug || "";
    const userSchoolId = user?.instituteDetails?.id;
    const currentSchoolSlug = isSuperAdmin ? selectedSchoolSlug : userSchoolSlug;
    const currentSchoolId = isSuperAdmin ? selectedSchoolId : userSchoolId;

    // 1. Query: Fetch Schools Directory (Super Admin Only)
    const { data: schools = [], isLoading: isSchoolsLoading } = useQuery<SchoolSummary[]>({
        queryKey: ["getSchoolsSettingsList"],
        queryFn: async () => {
            const response = await ApiClient.get(`${BASE_URL}/institute/allSchools`);
            return response.data?.data || [];
        },
        enabled: isSuperAdmin
    });

    // 1b. Query: Fetch School details (to get classes & sections and subjects)
    const { data: schoolDetails } = useQuery({
        queryKey: ["getSchoolDetails", currentSchoolSlug],
        queryFn: async () => {
            const response = await ApiClient.get(`${BASE_URL}/institute/${currentSchoolSlug}`);
            return response.data?.data;
        },
        enabled: !!currentSchoolSlug
    });

    // 2. Query: Fetch Teachers list
    const {
        data: teachers = [],
        isLoading: isTeachersLoading,
        isRefetching: isTeachersRefetching,
        refetch: refetchTeachers
    } = useQuery({
        queryKey: ["getTeachersList", currentSchoolId],
        queryFn: async () => {
            const response = await ApiClient.get(`${BASE_URL}/teacher`, {
                params: currentSchoolId ? { instituteId: currentSchoolId } : {}
            });
            return response.data?.data || [];
        },
        enabled: isSuperAdmin ? !!currentSchoolId : true
    });

    // 3. Mutation: Create Teacher
    const createTeacherMutation = useMutation({
        mutationFn: async (payload: any) => {
            const response = await ApiClient.post(`${BASE_URL}/teacher`, payload);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(data?.message || "Teacher deployed successfully!");
            queryClient.invalidateQueries({ queryKey: ["getTeachersList"] });
            setIsDrawerOpen(false);
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to deploy teacher.");
        }
    });

    // 4. Mutation: Update Teacher
    const updateTeacherMutation = useMutation({
        mutationFn: async ({ userId, payload }: { userId: string; payload: any }) => {
            const response = await ApiClient.put(`${BASE_URL}/teacher/${userId}`, payload);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(data?.message || "Teacher updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["getTeachersList"] });
            setIsDrawerOpen(false);
            setSelectedTeacher(null);
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to update teacher profile.");
        }
    });

    // 5. Mutation: Toggle Teacher Status
    const toggleStatusMutation = useMutation({
        mutationFn: async (userId: string) => {
            const response = await ApiClient.patch(`${BASE_URL}/teacher/${userId}`);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(data?.message || "Status updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["getTeachersList"] });
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to toggle status.");
        }
    });

    const handleOpenCreate = () => {
        setSelectedTeacher(null);
        setIsDrawerOpen(true);
    };

    const handleOpenEdit = (teacher: any) => {
        setSelectedTeacher(teacher);
        setIsDrawerOpen(true);
    };

    const handleFormSubmit = (payload: any) => {
        if (selectedTeacher) {
            updateTeacherMutation.mutate({
                userId: selectedTeacher.userId,
                payload
            });
        } else {
            // Include target school selection when superadmin deploys
            if (isSuperAdmin && currentSchoolId) {
                payload.reqInstId = currentSchoolId;
            }
            createTeacherMutation.mutate(payload);
        }
    };

    const handleToggleStatus = (userId: string) => {
        const confirmMessage = "Are you sure you want to alter this teacher's ERP access status?";
        if (window.confirm(confirmMessage)) {
            toggleStatusMutation.mutate(userId);
        }
    };

    const isDataLoading = isTeachersLoading || (isSuperAdmin && isSchoolsLoading);

    // Fallback block for restricted view access
    const accessDeniedFallback = (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white border border-light-border rounded-xl">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4 border border-red-100">
                <GraduationCap size={26} />
            </div>
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Access Restricted</h3>
            <p className="text-xs text-black/55 mt-1.5 max-w-sm leading-relaxed">
                You do not hold permissions to view the teachers registry. Please contact your system administrator to assign the teacher management credentials.
            </p>
        </div>
    );

    return (
        <CanAccess permission="teacher.view" fallback={accessDeniedFallback}>
            <div className="pb-12 space-y-7">
                
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-light-border pb-5 gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-black flex items-center gap-2">
                            Teachers Directory
                            {isTeachersRefetching && <RefreshCw size={14} className="animate-spin text-black/40" />}
                        </h1>
                        <p className="text-xs text-black/55 font-medium">
                            Manage educator profiles, credentials, academic designations and qualifications.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={() => refetchTeachers()}
                            disabled={isDataLoading || isTeachersRefetching}
                            className="h-9 px-3 rounded-lg border border-light-border bg-white text-black/70 hover:text-black transition flex items-center justify-center hover:bg-neutral-50 cursor-pointer text-xs font-semibold gap-1.5"
                        >
                            <RefreshCw size={13} className={isTeachersRefetching ? "animate-spin" : ""} />
                            Sync Registry
                        </button>

                        <CanAccess permission="teacher.create">
                            {(currentSchoolSlug || !isSuperAdmin) && (
                                <button
                                    type="button"
                                    onClick={handleOpenCreate}
                                    className="h-9 px-4 rounded-lg bg-black text-white text-xs font-medium hover:bg-black/90 transition flex items-center gap-1.5 cursor-pointer"
                                >
                                    <Plus size={14} />
                                    Deploy Teacher
                                </button>
                            )}
                        </CanAccess>
                    </div>
                </div>

                {/* School Filter Panel (Super Admin Only) */}
                {isSuperAdmin && (
                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-50/50 border border-light-border p-4 rounded-xl">
                        <div className="w-full sm:w-80 space-y-1">
                            <span className="text-[10px] font-bold text-black/45 uppercase tracking-wider block">Target Institute / Campus:</span>
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
                                    <option value="">Select campus registry</option>
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

                {/* Main Content Panels */}
                {isSuperAdmin && !selectedSchoolSlug ? (
                    /* Prompt Super Admin to select a school */
                    <div className="h-[40vh] w-full flex flex-col items-center justify-center border border-dashed border-light-border rounded-xl p-8 bg-neutral-50/20 text-center">
                        <Building2 size={36} className="text-black/20 mb-3" />
                        <h3 className="font-semibold text-xs text-black uppercase tracking-wider">No Campus Scope Selected</h3>
                        <p className="text-[11px] text-black/45 mt-1 max-w-xs leading-relaxed">
                            Please select an educational campus registry from the target institute dropdown above to examine and process teacher records.
                        </p>
                    </div>
                ) : isTeachersLoading ? (
                    <div className="h-[60vh] w-full flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-black" />
                        <span className="text-xs font-semibold text-black/50 tracking-wider uppercase">Loading Teachers Registry...</span>
                    </div>
                ) : (
                    <TeachersTable
                        teachers={teachers}
                        onEdit={handleOpenEdit}
                        onToggleStatus={handleToggleStatus}
                    />
                )}

                {/* Register/Modify Teacher Slide-over Drawer */}
                <CreateEditTeacherDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => {
                        setIsDrawerOpen(false);
                        setSelectedTeacher(null);
                    }}
                    onSubmit={handleFormSubmit}
                    isSubmitting={createTeacherMutation.isPending || updateTeacherMutation.isPending}
                    teacher={selectedTeacher}
                    classes={schoolDetails?.classes || []}
                />

            </div>
        </CanAccess>
    );
}
