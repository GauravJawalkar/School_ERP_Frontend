"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/interceptors/ApiClient";
import { BASE_URL } from "@/constants/constants";
import { CanAccess } from "@/components/Auth/CanAccess";
import { Loader2, RefreshCw, Layers } from "lucide-react";
import toast from "react-hot-toast";

// Child imports
import SaaSStatsGrid from "./SaaSStatsGrid";
import SaaSInstitutesTable from "./SaaSInstitutesTable";

export default function SaaSInstitutesDashboard() {
    const queryClient = useQueryClient();

    // Fetch live schools registry
    const getAllSchools = async () => {
        const response = await ApiClient.get(`${BASE_URL}/institute/allSchools`);
        return response.data.data;
    };

    const { data: allSchools = [], isLoading, isRefetching, refetch } = useQuery({
        queryKey: ["getAllSchools"],
        queryFn: getAllSchools,
        refetchOnWindowFocus: false,
    });

    // 1. Mutation: Update Subscription Plan Tier
    const updateTierMutation = useMutation({
        mutationFn: async ({ schoolSlug, newTier }: { schoolSlug: string; newTier: string }) => {
            // Map tier name to a student capacity threshold for mock/db parity
            let capacity = 500;
            if (newTier.includes("Premium")) capacity = 2500;
            if (newTier.includes("Enterprise")) capacity = 10000;

            const res = await ApiClient.patch(`${BASE_URL}/institute/update/${schoolSlug}`, {
                totalStudents: capacity // Update cap capacity through totalStudents field simulation
            });
            return res.data;
        },
        onSuccess: (_, variables) => {
            toast.success(`Institute upgraded to ${variables.newTier}!`);
            queryClient.invalidateQueries({ queryKey: ["getAllSchools"] });
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to alter subscription tier.")
    });

    // 2. Mutation: Toggle Suspension Access
    const updateStatusMutation = useMutation({
        mutationFn: async ({ schoolSlug, newStatus }: { schoolSlug: string; newStatus: string }) => {
            const res = await ApiClient.patch(`${BASE_URL}/institute/update/${schoolSlug}`, {
                schoolStatus: newStatus
            });
            return res.data;
        },
        onSuccess: (_, variables) => {
            const label = variables.newStatus === "ACTIVE" ? "Re-activated" : "Suspended";
            toast.success(`Institute access has been ${label}!`);
            queryClient.invalidateQueries({ queryKey: ["getAllSchools"] });
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to toggle status.")
    });

    // 3. Mutation: Manual Quota Limit Overrides
    const overrideQuotasMutation = useMutation({
        mutationFn: async ({ schoolSlug, newCap }: { schoolSlug: string; newCap: number }) => {
            const res = await ApiClient.patch(`${BASE_URL}/institute/update/${schoolSlug}`, {
                totalStudents: newCap
            });
            return res.data;
        },
        onSuccess: () => {
            toast.success("Manual seat quota override applied!");
            queryClient.invalidateQueries({ queryKey: ["getAllSchools"] });
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to override seat license quota.")
    });

    if (isLoading) {
        return (
            <div className="h-[75vh] w-full flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
                <span className="text-sm font-medium text-black/50 tracking-wide uppercase">Assembling platform directories...</span>
            </div>
        );
    }

    return (
        <CanAccess role="SUPER_ADMIN">
            <div className="space-y-7 max-w-7xl mx-auto pb-10">
                
                {/* Dashboard Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-light-border pb-5">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl border border-light-border bg-white flex items-center justify-center text-black">
                            <Layers size={18} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-black">SaaS Institute Registry</h1>
                            <p className="text-xs text-black/50">Configure platform subdomains, audit active seat limits, and execute global licensing commands</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => refetch()}
                        disabled={isRefetching}
                        className="h-9 px-3 rounded-lg border border-light-border bg-white flex items-center gap-2 text-xs font-semibold text-black/70 hover:text-black transition shadow-xs hover:bg-neutral-50"
                    >
                        <RefreshCw size={12} className={isRefetching ? "animate-spin" : ""} />
                        {isRefetching ? "Syncing cluster..." : "Refresh Registries"}
                    </button>
                </div>

                {/* SaaS Metrics Stats Grid */}
                <SaaSStatsGrid schools={allSchools} />

                {/* Operations Registry list Table */}
                <SaaSInstitutesTable 
                    schools={allSchools}
                    onUpdateTier={(schoolSlug, newTier) => updateTierMutation.mutate({ schoolSlug, newTier })}
                    onUpdateStatus={(schoolSlug, newStatus) => updateStatusMutation.mutate({ schoolSlug, newStatus })}
                    onOverrideQuotas={(schoolSlug, newCap) => overrideQuotasMutation.mutate({ schoolSlug, newCap })}
                />

            </div>
        </CanAccess>
    );
}
