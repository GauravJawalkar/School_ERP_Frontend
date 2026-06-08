"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/interceptors/ApiClient";
import { BASE_URL } from "@/constants/constants";
import { useAuthStore } from "@/store/authStore";
import { Loader2, Plus, RefreshCw, AlertCircle, BookOpen, GraduationCap, Building2 } from "lucide-react";
import toast from "react-hot-toast";

import AdmissionsTable from "./AdmissionsTable";
import CreateAdmissionDrawer from "./CreateAdmissionDrawer";
import ViewApproveAdmissionDrawer from "./ViewApproveAdmissionDrawer";
import DeleteAdmissionDrawer from "./DeleteAdmissionDrawer";

interface SchoolSummary {
    schoolId: number;
    schoolName: string;
    schoolSlug: string;
    schoolStatus: string;
}

export default function AdmissionsDashboard() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const isSuperAdmin = user?.roles?.includes("SUPER_ADMIN");
    const isSchoolAdmin = user?.roles?.includes("SCHOOL_ADMIN");
    const canHardDelete = !!(isSuperAdmin || isSchoolAdmin);
    const userSchoolSlug = user?.instituteDetails?.slug || "";
    const userSchoolId = user?.instituteDetails?.id;

    // Selected states (For Super Admins)
    const [selectedSchoolSlug, setSelectedSchoolSlug] = useState<string>("");
    const [selectedSchoolId, setSelectedSchoolId] = useState<number | undefined>(undefined);
    const [selectedYearId, setSelectedYearId] = useState<number | "">("");

    // Drawers states
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState<any | null>(null);

    // 1. Query: Fetch Academic Years
    const { data: academicYears = [], isLoading: isYearsLoading } = useQuery({
        queryKey: ["getAcademicYearsList"],
        queryFn: async () => {
            const response = await ApiClient.get(`${BASE_URL}/admin/academicYears`);
            return response.data?.data || [];
        }
    });

    // Derived state for academic year selection (defaults to active session)
    const activeYearId = academicYears.find((ay: any) => ay.isActive)?.id || academicYears[0]?.id;
    const currentYearId = selectedYearId || activeYearId;

    // Derived state for school details scope (mapped dynamically by authorization scope)
    const currentSchoolSlug = isSuperAdmin ? selectedSchoolSlug : userSchoolSlug;
    const currentSchoolId = isSuperAdmin ? selectedSchoolId : userSchoolId;

    // 2. Query: Fetch Schools Directory (Super Admin Only)
    const { data: schools = [], isLoading: isSchoolsLoading } = useQuery<SchoolSummary[]>({
        queryKey: ["getSchoolsSettingsList"],
        queryFn: async () => {
            const response = await ApiClient.get(`${BASE_URL}/institute/allSchools`);
            return response.data?.data || [];
        },
        enabled: isSuperAdmin
    });

    // 3. Query: Get Selected School Details (to obtain classes list for creation)
    const { data: schoolDetails } = useQuery({
        queryKey: ["getSchoolDetails", currentSchoolSlug],
        queryFn: async () => {
            const response = await ApiClient.get(`${BASE_URL}/institute/${currentSchoolSlug}`);
            return response.data?.data;
        },
        enabled: !!currentSchoolSlug
    });

    // Extract classes
    const classes = schoolDetails?.classes || [];

    // 4. Query: Fetch Admissions list
    const {
        data: admissions = [],
        isLoading: isAdmissionsLoading,
        isRefetching: isAdmissionsRefetching,
        refetch: refetchAdmissions
    } = useQuery({
        queryKey: ["getAdmissionsList", currentYearId, currentSchoolId],
        queryFn: async () => {
            const response = await ApiClient.get(`${BASE_URL}/addmission/${currentYearId}`, {
                params: currentSchoolId ? { instituteId: currentSchoolId } : {}
            });
            return response.data?.data || [];
        },
        enabled: !!currentYearId && (isSuperAdmin ? !!currentSchoolId : true)
    });

    // Mutation: Create Admission Application
    const createAdmissionMutation = useMutation({
        mutationFn: async (payload: any) => {
            const response = await ApiClient.post(`${BASE_URL}/addmission/createAddmission`, payload);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(data?.message || "Admission application registered successfully!");
            queryClient.invalidateQueries({ queryKey: ["getAdmissionsList"] });
            setIsCreateOpen(false);
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to submit application.");
        }
    });

    // Mutation: Approve Admission Application (Enroll Student)
    const approveAdmissionMutation = useMutation({
        mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
            const response = await ApiClient.post(`${BASE_URL}/addmission/approveAdmission/${id}`, payload);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(data?.message || "Admission approved and student registered successfully!");
            queryClient.invalidateQueries({ queryKey: ["getAdmissionsList"] });
            setIsViewOpen(false);
            setSelectedApplication(null);
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to approve admission application.");
        }
    });

    // Mutation: Update Application Status
    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: number; status: string }) => {
            const response = await ApiClient.patch(`${BASE_URL}/addmission/updateStatus`, {
                addmissionId: id,
                status
            });
            return response.data;
        },
        onSuccess: (data, variables) => {
            toast.success(`Application status updated to ${variables.status}`);
            queryClient.invalidateQueries({ queryKey: ["getAdmissionsList"] });

            // Sync selected application view if open
            if (selectedApplication && selectedApplication.id === variables.id) {
                setSelectedApplication((prev: any) => prev ? { ...prev, applicationStatus: variables.status } : null);
            }
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to update status.");
        }
    });

    // Mutation: Delete Admission (Supports both Soft and Hard deletes)
    const deleteAdmissionMutation = useMutation({
        mutationFn: async ({ id, type }: { id: number; type: "soft" | "hard" }) => {
            const url = type === "hard"
                ? `${BASE_URL}/addmission/${id}`
                : `${BASE_URL}/addmission/${id}/soft`;
            const response = type === "hard"
                ? await ApiClient.delete(url)
                : await ApiClient.patch(url);
            return { responseData: response.data, type };
        },
        onSuccess: (data) => {
            if (data.type === "hard") {
                toast.success("Admission application deleted permanently.");
            } else {
                toast.success("Admission application archived successfully.");
            }
            queryClient.invalidateQueries({ queryKey: ["getAdmissionsList"] });
            setIsDeleteOpen(false);
            setSelectedApplication(null);
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to complete deletion request.");
        }
    });

    const handleCreateSave = (payload: any) => {
        createAdmissionMutation.mutate(payload);
    };

    const handleApproveSave = (id: number, payload: any) => {
        approveAdmissionMutation.mutate({ id, payload });
    };

    const handleStatusChange = (id: number, status: string) => {
        updateStatusMutation.mutate({ id, status });
    };

    const handleDelete = (app: any) => {
        setSelectedApplication(app);
        setIsDeleteOpen(true);
    };

    const handleDeleteConfirm = (id: number, type: "soft" | "hard") => {
        deleteAdmissionMutation.mutate({ id, type });
    };

    const handleApproveClick = (app: any) => {
        setSelectedApplication(app);
        setIsViewOpen(true);
    };

    const handleView = (app: any) => {
        setSelectedApplication(app);
        setIsViewOpen(true);
    };

    if (isYearsLoading || (isSuperAdmin && isSchoolsLoading)) {
        return (
            <div className="h-[60vh] w-full flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
                <span className="text-xs font-semibold text-black/50 tracking-wider uppercase">Loading Admission Timelines...</span>
            </div>
        );
    }

    return (
        <div className="pb-12 space-y-7">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-light-border pb-5 gap-4">
                <div>
                    <h1 className="text-xl font-bold text-black flex items-center gap-2">
                        Admission Applications
                        {isAdmissionsRefetching && <RefreshCw size={14} className="animate-spin text-black/40" />}
                    </h1>
                    <p className="text-xs text-black/50 font-medium">
                        Evaluate student enrollment requests, update application lead states, and register student credentials.
                    </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <button
                        type="button"
                        onClick={() => refetchAdmissions()}
                        className="h-9 px-3 rounded-lg border border-light-border bg-white text-black/70 hover:text-black transition flex items-center justify-center hover:bg-neutral-50 cursor-pointer text-xs font-semibold gap-1.5"
                    >
                        <RefreshCw size={13} className={isAdmissionsRefetching ? "animate-spin" : ""} />
                        Sync Registry
                    </button>

                    {/* Only show Add Admission button if a school is selected / active */}
                    {(selectedSchoolSlug || !isSuperAdmin) && (
                        <button
                            type="button"
                            onClick={() => setIsCreateOpen(true)}
                            className="h-9 px-4 rounded-lg bg-black text-white text-xs font-medium hover:bg-black/90 transition flex items-center gap-1.5 cursor-pointer"
                        >
                            <Plus size={14} />
                            New Addmission
                        </button>
                    )}
                </div>
            </div>

            {/* School & Academic Session Filter Panels */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-50/50 border border-light-border p-4 rounded-xl">
                {/* 1. Academic Year selector */}
                <div className="w-full sm:w-60 space-y-1">
                    <span className="text-[10px] font-bold text-black/45 uppercase tracking-wider block">Academic Session:</span>
                    <select
                        value={currentYearId || ""}
                        onChange={(e) => setSelectedYearId(e.target.value ? Number(e.target.value) : "")}
                        className="w-full border border-input-border text-xs px-2.5 py-1.5 outline-none rounded-lg bg-white font-medium cursor-pointer"
                    >
                        {academicYears.map((ay: any) => (
                            <option key={ay.id} value={ay.id}>
                                {ay.name} {ay.isActive ? "(Active)" : ""}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 2. School Selector (Super Admin Only) */}
                {isSuperAdmin && (
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
                )}
            </div>

            {/* Main Content Panels */}
            {isSuperAdmin && !selectedSchoolSlug ? (
                /* Prompt Super Admin to select a school */
                <div className="h-[40vh] w-full flex flex-col items-center justify-center border border-dashed border-light-border rounded-xl p-8 bg-neutral-50/20 text-center">
                    <GraduationCap size={36} className="text-black/20 mb-3" />
                    <h3 className="font-semibold text-xs text-black uppercase tracking-wider">No Campus Scope Selected</h3>
                    <p className="text-[11px] text-black/45 mt-1 max-w-xs leading-relaxed">
                        Please select an educational campus registry from the target institute dropdown above to examine and process admission requests.
                    </p>
                </div>
            ) : isAdmissionsLoading ? (
                <div className="h-[40vh] w-full flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-black" />
                    <span className="text-xs text-black/40">Querying admission records...</span>
                </div>
            ) : (
                /* Table Display */
                <AdmissionsTable
                    applications={admissions}
                    onView={handleView}
                    onApproveClick={handleApproveClick}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                />
            )}

            {/* Create Drawer */}
            <CreateAdmissionDrawer
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSave={handleCreateSave}
                isPending={createAdmissionMutation.isPending}
                academicYears={academicYears}
                classes={classes}
                selectedInstituteId={currentSchoolId}
            />

            {/* View & Approve Drawer */}
            <ViewApproveAdmissionDrawer
                isOpen={isViewOpen}
                onClose={() => {
                    setIsViewOpen(false);
                    setSelectedApplication(null);
                }}
                application={selectedApplication}
                onApprove={handleApproveSave}
                onStatusChange={handleStatusChange}
                isApproving={approveAdmissionMutation.isPending}
                isUpdatingStatus={updateStatusMutation.isPending}
            />

            {/* Delete Drawer */}
            <DeleteAdmissionDrawer
                isOpen={isDeleteOpen}
                onClose={() => {
                    setIsDeleteOpen(false);
                    setSelectedApplication(null);
                }}
                application={selectedApplication}
                onConfirm={handleDeleteConfirm}
                isPending={deleteAdmissionMutation.isPending}
                canHardDelete={canHardDelete}
            />
        </div>
    );
}
