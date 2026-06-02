"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/interceptors/ApiClient";
import { BASE_URL } from "@/constants/constants";
import { CanAccess } from "@/components/Auth/CanAccess";
import { usePermission } from "@/hooks/usePermission";
import { Loader2, Plus, Calendar, RefreshCw, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

import AcademicYearStats, { AcademicYear } from "./AcademicYearStats";
import AcademicYearTable from "./AcademicYearTable";
import CreateAcademicYearDrawer from "./CreateAcademicYearDrawer";

export default function AcademicYearDashboard() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const queryClient = useQueryClient();
    const { isSuperAdmin } = usePermission();

    // Query: Fetch All Academic Years
    const {
        data: academicYears = [],
        isLoading,
        isRefetching,
        refetch
    } = useQuery<AcademicYear[]>({
        queryKey: ["getAcademicYearsList"],
        queryFn: async () => {
            const response = await ApiClient.get(`${BASE_URL}/admin/academicYears`);
            return response.data?.data || [];
        },
        refetchOnWindowFocus: false,
    });

    // Mutation: Create Academic Year (Super Admin Only)
    const createYearMutation = useMutation({
        mutationFn: async (newYearPayload: { name: string; startDate: string; endDate: string; isActive: boolean }) => {
            const response = await ApiClient.post(`${BASE_URL}/admin/createAcademicYear`, newYearPayload);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Academic year created and configured successfully!");
            queryClient.invalidateQueries({ queryKey: ["getAcademicYearsList"] });
            setIsDrawerOpen(false);
        },
        onError: (err: any) => {
            const serverMsg = err?.response?.data?.message || "Failed to create academic year.";
            toast.error(serverMsg);
        }
    });

    // Mutation: Toggle Academic Year Status with Optimistic Updates (Super Admin Only)
    const updateYearStatusMutation = useMutation({
        mutationFn: async (payload: { id: number; isActive: boolean }) => {
            const response = await ApiClient.put(`${BASE_URL}/admin/updateAcademicYearStatus`, payload);
            return response.data;
        },
        onMutate: async (variables) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ["getAcademicYearsList"] });

            // Snapshot previous query cache
            const previousYears = queryClient.getQueryData<AcademicYear[]>(["getAcademicYearsList"]);

            // Optimistically update query cache
            queryClient.setQueryData<AcademicYear[]>(["getAcademicYearsList"], (old = []) => {
                return old.map((year) => {
                    if (year.id === variables.id) {
                        return { ...year, isActive: variables.isActive };
                    }
                    // Since only one year can be active, deactivate other years if setting this one active
                    if (variables.isActive) {
                        return { ...year, isActive: false };
                    }
                    return year;
                });
            });

            return { previousYears };
        },
        onError: (err: any, variables, context) => {
            // Roll back to previous snapshot state on failure
            if (context?.previousYears) {
                queryClient.setQueryData(["getAcademicYearsList"], context.previousYears);
            }
            const serverMsg = err?.response?.data?.message || "Failed to update academic year status.";
            toast.error(serverMsg);
        },
        onSuccess: (data) => {
            toast.success(data?.message || "Academic year operational status updated!");
        },
        onSettled: () => {
            // Keep frontend synced to database state
            queryClient.invalidateQueries({ queryKey: ["getAcademicYearsList"] });
            setUpdatingId(null);
        }
    });

    const handleCreateYear = (payload: { name: string; startDate: string; endDate: string; isActive: boolean }) => {
        if (!isSuperAdmin) {
            toast.error("Unauthorized. Only platform Super Admins can configure academic sessions.");
            return;
        }
        createYearMutation.mutate(payload);
    };

    const handleToggleActive = (id: number, nextStatus: boolean) => {
        if (!isSuperAdmin) {
            toast.error("Unauthorized. Only platform Super Admins can alter operational statuses.");
            return;
        }
        setUpdatingId(id);
        updateYearStatusMutation.mutate({ id, isActive: nextStatus });
    };

    if (isLoading) {
        return (
            <div className="h-[60vh] w-full flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
                <span className="text-xs font-semibold text-black/50 tracking-wider uppercase">Loading academic calendar cycles...</span>
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
                            Academic Years
                            {isRefetching && <RefreshCw size={14} className="animate-spin text-black/40" />}
                        </h1>
                        <p className="text-xs text-black/50 font-medium">
                            {isSuperAdmin
                                ? "Manage institute calendar timelines, define operational session ranges, and set the system-wide active year."
                                : "View institute calendar timelines and active operational session ranges."
                            }
                        </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="h-9 px-3 rounded-lg border border-light-border bg-white text-black/70 hover:text-black transition flex items-center justify-center hover:bg-neutral-50 cursor-pointer text-xs font-semibold gap-1.5"
                            title="Sync calendar list"
                        >
                            <RefreshCw size={13} className={isRefetching ? "animate-spin" : ""} />
                            Re-Sync
                        </button>

                        {isSuperAdmin && (
                            <button
                                type="button"
                                onClick={() => setIsDrawerOpen(true)}
                                className="h-9 px-4 rounded-lg bg-black text-white text-xs font-semibold hover:bg-black/90 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                                <Plus size={14} />
                                Create Year
                            </button>
                        )}
                    </div>
                </div>

                {/* Performance stats overview */}
                <AcademicYearStats years={academicYears} />

                {/* Operational Warning Alert */}
                <div className="p-3.5 bg-gray-50 border border-light-border rounded-xl flex items-start gap-3 text-xs text-black/75 leading-relaxed">
                    <AlertCircle size={15} className="text-black/85 mt-0.5 shrink-0" />
                    <span>
                        <strong>Timeline Rule:</strong> Students, class enrollments, fee installments, and course schedules are bound directly to the active academic session.
                        {isSuperAdmin
                            ? " Activating a new calendar year will automatically mark all other years as inactive. Only one session can be active at a time."
                            : " Contact a platform SuperAdmin to adjust calendar cycle configurations or update active sessions."
                        }
                    </span>
                </div>

                {/* Table display */}
                <AcademicYearTable
                    years={academicYears}
                    isSuperAdmin={isSuperAdmin}
                    onToggleActive={handleToggleActive}
                    updatingId={updatingId}
                />

                {/* Create slide over drawer */}
                {isSuperAdmin && (
                    <CreateAcademicYearDrawer
                        isOpen={isDrawerOpen}
                        onClose={() => setIsDrawerOpen(false)}
                        onSave={handleCreateYear}
                        isPending={createYearMutation.isPending}
                    />
                )}
            </div>
        </CanAccess>
    );
}
