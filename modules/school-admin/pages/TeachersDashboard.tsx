"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/interceptors/ApiClient";
import { BASE_URL } from "@/constants/constants";
import { useAuthStore } from "@/store/authStore";
import { CanAccess } from "@/shared_components/Auth/CanAccess";
import { usePermission } from "@/hooks/usePermission";
import { Loader2, Plus, GraduationCap, ShieldAlert, RefreshCw, Landmark } from "lucide-react";
import toast from "react-hot-toast";

import TeachersTable from "../components/teachers/TeachersTable";
import CreateEditTeacherDrawer from "../components/teachers/CreateEditTeacherDrawer";

interface SchoolSummary {
    schoolId: number;
    schoolName: string;
    schoolSlug: string;
    schoolStatus: string;
}

export default function TeachersDashboard() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const { isSuperAdmin, can } = usePermission();
    const canCreate = can("teacher.create");
    const userSchoolSlug = user?.instituteDetails?.slug || "";

    // Selected school states (For Super Admins)
    const [selectedSchoolSlug, setSelectedSchoolSlug] = useState<string>("");
    const [selectedSchoolId, setSelectedSchoolId] = useState<number | undefined>(undefined);

    // Slide-over Drawer States
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);

    const currentSchoolSlug = isSuperAdmin ? selectedSchoolSlug : userSchoolSlug;

    // 1. Query: Fetch Schools Directory (Super Admin Only)
    const { data: schools = [], isLoading: isSchoolsLoading } = useQuery<SchoolSummary[]>({
        queryKey: ["getSchoolsSettingsList"],
        queryFn: async () => {
            const response = await ApiClient.get(`${BASE_URL}/institute/allSchools`);
            return response.data?.data || [];
        },
        enabled: isSuperAdmin
    });

    // 2. Query: Fetch Selected School Details (Classes, Sections, ClassSubjects)
    const { data: schoolDetails } = useQuery({
        queryKey: ["getSchoolDetails", currentSchoolSlug],
        queryFn: async () => {
            const response = await ApiClient.get(`${BASE_URL}/institute/${currentSchoolSlug}`);
            return response.data?.data;
        },
        enabled: !!currentSchoolSlug
    });

    const classes = schoolDetails?.classes || [];

    // 3. Query: Fetch Teachers Directory
    const {
        data: teachersList = [],
        isLoading: isTeachersLoading,
        isRefetching: isTeachersRefetching,
        refetch: refetchTeachers
    } = useQuery({
        queryKey: ["getTeachersList", currentSchoolSlug],
        queryFn: async () => {
            const response = await ApiClient.get(`${BASE_URL}/teacher/allTeachers`, {
                params: currentSchoolSlug ? { schoolSlug: currentSchoolSlug } : {}
            });
            return response.data?.data || [];
        },
        enabled: isSuperAdmin ? !!currentSchoolSlug : true
    });

    // Mutation: Create Teacher
    const createTeacherMutation = useMutation({
        mutationFn: async (payload: any) => {
            if (isSuperAdmin && selectedSchoolId) {
                payload.instituteId = selectedSchoolId;
            }
            const response = await ApiClient.post(`${BASE_URL}/teacher/createTeacher`, payload);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Teacher profile and academic credentials registered!");
            queryClient.invalidateQueries({ queryKey: ["getTeachersList"] });
            setIsDrawerOpen(false);
            setSelectedTeacher(null);
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to register teacher profile.");
        }
    });

    // Mutation: Update Teacher
    const updateTeacherMutation = useMutation({
        mutationFn: async ({ userId, payload }: { userId: string; payload: any }) => {
            const response = await ApiClient.put(`${BASE_URL}/teacher/updateTeacher/${userId}`, payload);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Teacher profile and assignments updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["getTeachersList"] });
            setIsDrawerOpen(false);
            setSelectedTeacher(null);
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to update teacher profile.");
        }
    });

    // Mutation: Toggle Active Status
    const toggleStatusMutation = useMutation({
        mutationFn: async (userId: string) => {
            const response = await ApiClient.patch(`${BASE_URL}/teacher/toggleStatus/${userId}`);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(data?.message || "Teacher active status toggled!");
            queryClient.invalidateQueries({ queryKey: ["getTeachersList"] });
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to toggle status.");
        }
    });

    const handleCreateOrEditSubmit = (formData: any) => {
        if (selectedTeacher) {
            updateTeacherMutation.mutate({ userId: selectedTeacher.userId, payload: formData });
        } else {
            createTeacherMutation.mutate(formData);
        }
    };

    const handleOpenEdit = (teacher: any) => {
        setSelectedTeacher(teacher);
        setIsDrawerOpen(true);
    };

    const handleOpenCreate = () => {
        setSelectedTeacher(null);
        setIsDrawerOpen(true);
    };

    const handleToggleStatus = (userId: string) => {
        toggleStatusMutation.mutate(userId);
    };

    if (isSuperAdmin && isSchoolsLoading) {
        return (
            <div className="h-[60vh] w-full flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
                <span className="text-xs font-semibold text-black/50 tracking-wider uppercase">Loading Campus Directory...</span>
            </div>
        );
    }

    return (
        <CanAccess anyRole={["SUPER_ADMIN", "SCHOOL_ADMIN"]}>
            <div className="pb-12 space-y-7">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-light-border pb-5 gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-black flex items-center gap-2">
                            Teachers Directory
                            {isTeachersRefetching && <RefreshCw size={14} className="animate-spin text-black/40" />}
                        </h1>
                        <p className="text-xs text-black/50 font-medium">
                            Deploy academic educators, allocate class teacher duties, and map subject responsibilities.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={() => refetchTeachers()}
                            className="h-9 px-3 rounded-lg border border-light-border bg-white text-black/70 hover:text-black transition flex items-center justify-center hover:bg-neutral-50 cursor-pointer text-xs font-semibold gap-1.5"
                        >
                            <RefreshCw size={13} className={isTeachersRefetching ? "animate-spin" : ""} />
                            Sync Registry
                        </button>

                        {canCreate && (currentSchoolSlug || !isSuperAdmin) && (
                            <button
                                type="button"
                                onClick={handleOpenCreate}
                                className="h-9 px-4 rounded-lg bg-black text-white text-xs font-semibold hover:bg-black/90 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                                <Plus size={14} />
                                Register Teacher
                            </button>
                        )}
                    </div>
                </div>

                {/* School Selector for Super Admins */}
                {isSuperAdmin && (
                    <div className="p-4 bg-white border border-light-border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                        <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-black/45 uppercase tracking-widest block font-mono">Administrative Scope Selector</span>
                            <span className="text-xs font-semibold text-black/70">Select campus location to manage educators and subject allocations</span>
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
                {isSuperAdmin && !selectedSchoolSlug ? (
                    <div className="h-[40vh] w-full flex flex-col items-center justify-center border border-dashed border-light-border rounded-xl p-8 bg-neutral-50/20 text-center">
                        <Landmark size={36} className="text-black/20 mb-3" />
                        <h3 className="font-semibold text-xs text-black uppercase tracking-wider">No Campus Location Selected</h3>
                        <p className="text-[11px] text-black/45 mt-1 max-w-xs leading-relaxed">
                            Please pick a campus location from the selector above to manage teachers, subject mapping, and class teacher allocations.
                        </p>
                    </div>
                ) : isTeachersLoading ? (
                    <div className="h-[40vh] w-full flex flex-col items-center justify-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-black" />
                        <span className="text-xs text-black/40">Loading teachers directory...</span>
                    </div>
                ) : (
                    <TeachersTable
                        teachers={teachersList}
                        onEdit={handleOpenEdit}
                        onToggleStatus={handleToggleStatus}
                    />
                )}

                {/* Create & Edit Teacher Drawer */}
                <CreateEditTeacherDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => {
                        setIsDrawerOpen(false);
                        setSelectedTeacher(null);
                    }}
                    onSubmit={handleCreateOrEditSubmit}
                    isSubmitting={createTeacherMutation.isPending || updateTeacherMutation.isPending}
                    teacher={selectedTeacher}
                    classes={classes}
                />
            </div>
        </CanAccess>
    );
}
