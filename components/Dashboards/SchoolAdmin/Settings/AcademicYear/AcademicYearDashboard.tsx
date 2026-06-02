"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/interceptors/ApiClient";
import { BASE_URL } from "@/constants/constants";
import { CanAccess } from "@/components/Auth/CanAccess";
import { Loader2, Plus, Calendar, RefreshCw, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

import AcademicYearStats, { AcademicYear } from "./AcademicYearStats";
import AcademicYearTable from "./AcademicYearTable";
import CreateAcademicYearDrawer from "./CreateAcademicYearDrawer";

export default function AcademicYearDashboard() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const queryClient = useQueryClient();

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

    // Mutation: Create Academic Year
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

    const handleCreateYear = (payload: any) => {
        createYearMutation.mutate(payload);
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
                            Manage institute calendar timelines, define operational session ranges, and set the system-wide active year.
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

                        <button
                            type="button"
                            onClick={() => setIsDrawerOpen(true)}
                            className="h-9 px-4 rounded-lg bg-black text-white text-xs font-semibold hover:bg-black/90 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                            <Plus size={14} />
                            Create Year
                        </button>
                    </div>
                </div>

                {/* Performance stats overview */}
                <AcademicYearStats years={academicYears} />

                {/* Operational Warning Alert */}
                <div className="p-3.5 bg-gray-50 border border-light-border rounded-xl flex items-start gap-3 text-xs text-black/75 leading-relaxed">
                    <AlertCircle size={15} className="text-black/85 mt-0.5 shrink-0" />
                    <span>
                        <strong>Timeline Rule:</strong> Students, class enrollments, fee installments, and course schedules are bound directly to the active academic session. Activating a new calendar year will automatically mark previous years as inactive.
                    </span>
                </div>

                {/* Table display */}
                <AcademicYearTable years={academicYears} />

                {/* Create slide over drawer */}
                <CreateAcademicYearDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    onSave={handleCreateYear}
                    isPending={createYearMutation.isPending}
                />
            </div>
        </CanAccess>
    );
}
