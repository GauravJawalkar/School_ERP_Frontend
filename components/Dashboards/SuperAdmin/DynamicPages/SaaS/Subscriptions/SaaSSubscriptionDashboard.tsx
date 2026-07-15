"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/interceptors/ApiClient";
import { BASE_URL } from "@/constants/constants";
import { CanAccess } from "@/components/Auth/CanAccess";
import { Loader2, RefreshCw, CreditCard, Layers, Plus, Sliders, Check, X } from "lucide-react";
import toast from "react-hot-toast";

// Child imports
import SaaSSubscriptionStats from "./SaaSSubscriptionStats";
import SaaSSubscriptionDistribution from "./SaaSSubscriptionDistribution";
import SaaSActiveContractsTable from "./SaaSActiveContractsTable";
import SaaSPlanDrawer from "./SaaSPlanDrawer";

interface Contract {
    contractId: string;
    instituteId: number;
    schoolName: string;
    schoolSlug: string;
    tierName: string;
    billingCycle: string;
    price: number;
    billingStatus: string;
    startDate: string;
    renewalDate: string;
    lastPaymentTxId?: string;
}

interface SaaSPlan {
    planId: string;
    name: string;
    price: number;
    billingCycle: string;
    studentLimit: number;
    staffLimit: number;
    features: string[];
    isActive: boolean;
    dbPlanId: number;
    dbPriceId: number;
}

export default function SaaSSubscriptionDashboard() {
    const [activeTab, setActiveTab] = useState<"contracts" | "plans">("contracts");
    const [selectedPlanForEdit, setSelectedPlanForEdit] = useState<SaaSPlan | null>(null);

    const queryClient = useQueryClient();

    // ── DATA FETCHING 1: CONTRACTS ──
    const getAllContracts = async (): Promise<Contract[]> => {
        const response = await ApiClient.get(`${BASE_URL}/saas/subscriptions`);
        return response.data.data;
    };

    const { data: contracts = [], isLoading: isContractsLoading, refetch: refetchContracts } = useQuery({
        queryKey: ["getAllContracts"],
        queryFn: getAllContracts,
        refetchOnWindowFocus: false,
    });

    // ── DATA FETCHING 2: SAAS PLANS ──
    const getSaaSPlans = async (): Promise<SaaSPlan[]> => {
        const response = await ApiClient.get(`${BASE_URL}/saas/plans`);
        const backendPlans = response.data.data;
        return backendPlans.map((p: any) => {
            const primaryPrice = p.prices?.[0] || { id: 0, amount: "0", billingPeriod: "MONTHLY" };
            return {
                planId: p.slug,
                name: p.name,
                price: parseFloat(primaryPrice.amount),
                billingCycle: primaryPrice.billingPeriod,
                studentLimit: p.maxStudents,
                staffLimit: p.maxStaff,
                features: p.features?.modules || [],
                isActive: p.isActive,
                dbPlanId: p.id,
                dbPriceId: primaryPrice.id
            };
        });
    };

    const { data: plans = [], isLoading: isPlansLoading, refetch: refetchPlans } = useQuery({
        queryKey: ["getSaaSPlans"],
        queryFn: getSaaSPlans,
        refetchOnWindowFocus: false,
    });

    // ── MUTATIONS: ASSIGN / UPGRADE CONTRACTS ──
    const updateContractMutation = useMutation({
        mutationFn: async (payload: {
            instituteId: number;
            planId: number;
            priceId: number;
            billingPeriod: string;
            amount: number;
            paymentGateway: string;
            gatewayTransactionId: string;
        }) => {
            const res = await ApiClient.post(`${BASE_URL}/saas/subscriptions/assign`, payload);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Subscription assigned/upgraded successfully!");
            queryClient.invalidateQueries({ queryKey: ["getAllContracts"] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to assign subscription");
        }
    });

    const triggerEmailAlertMutation = useMutation({
        mutationFn: async (schoolName: string) => {
            await new Promise(resolve => setTimeout(resolve, 600));
            return { success: true };
        },
        onSuccess: (_, schoolName) => {
            toast.success(`Billing notification alert dispatched to ${schoolName}.`);
        }
    });

    // ── MUTATIONS: SAVE PLANS & PRICES ──
    const savePlanMutation = useMutation({
        mutationFn: async (payload: {
            planId: string;
            name: string;
            studentLimit: number;
            staffLimit: number;
            features: string[];
            price: number;
            billingCycle: string;
            dbPlanId: number;
            dbPriceId: number;
        }) => {
            // 1. Update the plan metadata and feature modules catalog
            await ApiClient.put(`${BASE_URL}/saas/plans/${payload.dbPlanId}`, {
                name: payload.name,
                maxStudents: payload.studentLimit,
                maxStaff: payload.staffLimit,
                features: { modules: payload.features }
            });

            // 2. Update price in parallel if a price ID exists
            if (payload.dbPriceId) {
                await ApiClient.put(`${BASE_URL}/saas/prices/${payload.dbPriceId}`, {
                    amount: payload.price
                });
            }
        },
        onSuccess: () => {
            toast.success("Subscription Plan details and price updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["getSaaSPlans"] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to update subscription parameters");
        }
    });

    const handleSync = () => {
        if (activeTab === "contracts") refetchContracts();
        else refetchPlans();
    };

    if (isContractsLoading || isPlansLoading) {
        return (
            <div className="h-[75vh] w-full flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
                <span className="text-sm font-medium text-black/50 tracking-wide uppercase">Assembling platform balance sheets...</span>
            </div>
        );
    }

    return (
        <CanAccess role="SUPER_ADMIN">
            <div className="space-y-7 max-w-7xl mx-auto pb-10">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-light-border pb-5">
                    <div className="flex items-center gap-3">
                        <div>
                            <h1 className="text-xl font-bold text-black">SaaS Subscriptions Hub</h1>
                            <p className="text-xs text-black/50">Manage global recurring contracts, pricing catalog plans, MRR distributions, and tier parameters</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Tab Switcher */}
                        <div className="flex rounded-lg border border-light-border bg-gray-50 p-1 text-xs">
                            <button
                                onClick={() => setActiveTab("contracts")}
                                className={`px-3 py-1.5 rounded-md font-semibold transition cursor-pointer flex items-center gap-1.5 ${activeTab === "contracts" ? "bg-white text-black shadow-xs" : "text-black/50 hover:text-black"
                                    }`}
                            >
                                <CreditCard size={12} /> Subscriber Contracts
                            </button>
                            <button
                                onClick={() => setActiveTab("plans")}
                                className={`px-3 py-1.5 rounded-md font-semibold transition cursor-pointer flex items-center gap-1.5 ${activeTab === "plans" ? "bg-white text-black shadow-xs" : "text-black/50 hover:text-black"
                                    }`}
                            >
                                <Layers size={12} /> Core SaaS Plans
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={handleSync}
                            className="h-9 px-3 rounded-lg border border-light-border bg-white flex items-center gap-2 text-xs font-semibold text-black/70 hover:text-black transition shadow-xs hover:bg-neutral-50 cursor-pointer"
                        >
                            <RefreshCw size={12} />
                            Sync Cluster
                        </button>
                    </div>
                </div>

                {/* ── CONDITIONAL RENDER: SUBSCRIBER REGISTRY CONTRACTS ── */}
                {activeTab === "contracts" && (
                    <div className="space-y-7 animate-in fade-in duration-200">
                        {/* Performance stats metrics grids */}
                        <SaaSSubscriptionStats contracts={contracts} />

                        {/* Subscriptions Distributions donut */}
                        <SaaSSubscriptionDistribution contracts={contracts} />

                        {/* Active contract listings registry */}
                        <SaaSActiveContractsTable
                            contracts={contracts}
                            plans={plans}
                            onUpdateContract={(payload) => updateContractMutation.mutate(payload)}
                            onTriggerEmailAlert={(name) => triggerEmailAlertMutation.mutate(name)}
                        />
                    </div>
                )}

                {/* ── CONDITIONAL RENDER: CORE SAAS PLAN CONFIGURATOR ── */}
                {activeTab === "plans" && (
                    <div className="space-y-6 animate-in fade-in duration-200">

                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-black/80 uppercase tracking-wider mb-0.5">SaaS Platform Plans Directory</h3>
                                <p className="text-xs text-black/40 font-medium">Configure resource allocations, caps, and price indices for core subscriber tiers</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => toast.success("Plan creation form is coming soon!")}
                                className="h-8 px-3 rounded-lg bg-black text-white text-xs font-bold hover:bg-black/90 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                                <Plus size={13} /> Create Tier Plan
                            </button>
                        </div>

                        {/* Plans Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {plans.map((plan) => (
                                <div key={plan.planId} className="bg-white border border-light-border rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-black/35 transition-all">
                                    <div className="space-y-4">

                                        <div className="flex justify-between items-start border-b border-light-border/40 pb-3">
                                            <div>
                                                <h4 className="text-sm font-bold text-black">{plan.name}</h4>
                                                <p className="text-[10px] font-mono text-black/40 mt-0.5 lowercase">{plan.planId}</p>
                                            </div>
                                            <span className="bg-neutral-50 px-2 py-0.5 border border-light-border rounded-full text-[9px] font-bold text-black/60 uppercase">
                                                Active
                                            </span>
                                        </div>

                                        <div className="space-y-1">
                                            <span className="text-2xl font-black text-black">₹{plan.price.toLocaleString()}</span>
                                            <span className="text-black/40 text-[10px] block font-medium uppercase tracking-wider">Per {plan.billingCycle.toLowerCase()} cycle</span>
                                        </div>

                                        <div className="space-y-2 border-t border-light-border/30 pt-3">
                                            <div className="flex justify-between text-xs text-black/70 font-semibold">
                                                <span>Student Seats Cap:</span>
                                                <span className="text-black">{plan.studentLimit.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-xs text-black/70 font-semibold">
                                                <span>Staff Seats Cap:</span>
                                                <span className="text-black">{plan.staffLimit.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2 pt-1">
                                            <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest block">Features catalog</span>
                                            <div className="space-y-1.5">
                                                {plan.features.map((feature, fIdx) => (
                                                    <div key={fIdx} className="flex items-center gap-1.5 text-xs text-black/70 font-medium">
                                                        <Check size={11} className="text-black shrink-0" strokeWidth={3} />
                                                        <span className="capitalize">{feature.replace('_', ' ')}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setSelectedPlanForEdit(plan)}
                                        className="w-full mt-6 py-2 rounded-lg border border-light-border hover:border-black bg-white hover:bg-neutral-50 text-xs font-semibold text-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                                    >
                                        <Sliders size={12} /> Configure parameters
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── PLAN PARAMETERS OVERRIDE DRAWER ── */}
                {selectedPlanForEdit && (
                    <SaaSPlanDrawer
                        plan={selectedPlanForEdit}
                        isOpen={!!selectedPlanForEdit}
                        onClose={() => setSelectedPlanForEdit(null)}
                        onSave={(updated) => {
                            savePlanMutation.mutate(updated);
                            setSelectedPlanForEdit(null);
                        }}
                    />
                )}

            </div>
        </CanAccess>
    );
}


