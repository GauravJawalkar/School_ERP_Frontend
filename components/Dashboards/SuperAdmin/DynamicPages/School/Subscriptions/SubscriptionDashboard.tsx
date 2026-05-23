"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApiClient } from "@/interceptors/ApiClient";
import { BASE_URL } from "@/constants/constants";
import { CanAccess } from "@/components/Auth/CanAccess";
import { Loader2, RefreshCw, Landmark, IndianRupee, ShieldAlert, Sparkles } from "lucide-react";

// Child imports
import PlanGrid from "./PlanGrid";
import ActiveSubscriptionsTable from "./ActiveSubscriptionsTable";

export default function SubscriptionDashboard() {
    // Fetch live list of all enrolled schools
    const getAllSchools = async () => {
        const response = await ApiClient.get(`${BASE_URL}/institute/allSchools`);
        return response.data.data;
    };

    const { data: allSchools = [], isLoading, isRefetching, refetch } = useQuery({
        queryKey: ["getAllSchools"],
        queryFn: getAllSchools,
        refetchOnWindowFocus: false,
    });

    // Dynamically calculate subscription revenue stats based on active schools and capacities
    const billingMetrics = useMemo(() => {
        let totalARR = 0;
        let totalStudents = 0;
        let activeCount = 0;

        allSchools.forEach((school: any) => {
            const students = Number(school.totalStudents || school.students || 0);
            totalStudents += students;

            if (school.schoolStatus === "ACTIVE" || school.status === "ACTIVE") {
                activeCount++;
                // Resolve tier price dynamically
                if (students > 2500) {
                    totalARR += 95000;
                } else if (students > 500) {
                    totalARR += 45000;
                } else {
                    totalARR += 15000;
                }
            }
        });

        const totalMRR = Math.round(totalARR / 12);

        return {
            totalARR,
            totalMRR,
            totalStudents,
            activeCount
        };
    }, [allSchools]);

    if (isLoading) {
        return (
            <div className="h-[75vh] w-full flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
                <span className="text-sm font-medium text-black/50 tracking-wide uppercase">Mapping billing databases...</span>
            </div>
        );
    }

    const cards = [
        {
            title: "Annual Recurring Revenue (ARR)",
            value: `₹${billingMetrics.totalARR.toLocaleString()}`,
            description: "System-wide licensing value",
            icon: <IndianRupee size={16} className="text-black" />,
            badge: "Active ARR"
        },
        {
            title: "Monthly Recurring Revenue (MRR)",
            value: `₹${billingMetrics.totalMRR.toLocaleString()}`,
            description: "Estimated monthly stream",
            icon: <Sparkles size={16} className="text-black" />,
            badge: "Prorated"
        },
        {
            title: "Billing Standing",
            value: `${billingMetrics.activeCount} / ${allSchools.length}`,
            description: "Good standing accounts ratio",
            icon: <Landmark size={16} className="text-black" />,
            badge: "Statuses"
        },
        {
            title: "Unbilled Overages",
            value: "0 Accounts",
            description: "Quota limit violations flagged",
            icon: <ShieldAlert size={16} className="text-black" />,
            badge: "Compliance"
        }
    ];

    return (
        <CanAccess role="SUPER_ADMIN">
            <div className="space-y-7 max-w-7xl mx-auto pb-10">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-light-border pb-5">
                    <div>
                        <h1 className="text-xl font-bold text-black">Subscription Tiers & Licensing</h1>
                        <p className="text-xs text-black/50">Manage global pricing tiers, configure student caps, and audit active school plans</p>
                    </div>

                    <button
                        type="button"
                        onClick={() => refetch()}
                        disabled={isRefetching}
                        className="h-9 px-3 rounded-lg border border-light-border bg-white flex items-center gap-2 text-xs font-semibold text-black/70 hover:text-black transition shadow-xs hover:bg-neutral-50"
                    >
                        <RefreshCw size={12} className={isRefetching ? "animate-spin" : ""} />
                        {isRefetching ? "Updating ledger..." : "Re-sync Billings"}
                    </button>
                </div>

                {/* Subscriptions Stats Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {cards.map((card, idx) => (
                        <div key={idx} className="bg-white border border-light-border rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-black/25 transition-all">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs text-black/50 font-semibold uppercase tracking-wider">{card.title}</span>
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-light-border">
                                        {card.icon}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-black tracking-tight">{card.value}</h3>
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50 text-[11px]">
                                <span className="text-black/40 font-medium">{card.description}</span>
                                <div className="bg-black/90 text-white px-2 py-0.5 rounded-sm font-normal scale-95 origin-right">
                                    {card.badge}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Plan Pricing Grid */}
                <PlanGrid schools={allSchools} />

                {/* Active Subscriptions Registry */}
                <ActiveSubscriptionsTable schools={allSchools} />

            </div>
        </CanAccess>
    );
}
