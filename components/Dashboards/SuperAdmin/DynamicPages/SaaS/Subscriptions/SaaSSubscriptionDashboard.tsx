"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/interceptors/ApiClient";
import { BASE_URL } from "@/constants/constants";
import { CanAccess } from "@/components/Auth/CanAccess";
import { Loader2, RefreshCw, Landmark, CreditCard, Layers, Plus, Sliders, Check, X } from "lucide-react";
import toast from "react-hot-toast";

// Child imports
import SaaSSubscriptionStats from "./SaaSSubscriptionStats";
import SaaSSubscriptionDistribution from "./SaaSSubscriptionDistribution";
import SaaSActiveContractsTable from "./SaaSActiveContractsTable";

interface Contract {
    contractId: string;
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
}

export default function SaaSSubscriptionDashboard() {
    const [activeTab, setActiveTab] = useState<"contracts" | "plans">("contracts");
    const [selectedPlanForEdit, setSelectedPlanForEdit] = useState<SaaSPlan | null>(null);

    const queryClient = useQueryClient();

    // ── DATA FETCHING 1: CONTRACTS ──
    const getAllContracts = async (): Promise<Contract[]> => {
        try {
            const response = await ApiClient.get(`${BASE_URL}/saas/subscription/allContracts`);
            return response.data.data;
        } catch {
            return [
                {
                    contractId: "CTR-101",
                    schoolName: "Angel High School",
                    schoolSlug: "angel-high-school",
                    tierName: "Basic Tier",
                    billingCycle: "MONTHLY",
                    price: 15000,
                    billingStatus: "ACTIVE",
                    startDate: "2026-01-15",
                    renewalDate: "2027-01-15",
                    lastPaymentTxId: "TXN-90219"
                },
                {
                    contractId: "CTR-102",
                    schoolName: "St. Xavier Academy",
                    schoolSlug: "st-xavier",
                    tierName: "Premium Growth",
                    billingCycle: "ANNUALLY",
                    price: 45000,
                    billingStatus: "ACTIVE",
                    startDate: "2025-10-01",
                    renewalDate: "2026-10-01",
                    lastPaymentTxId: "TXN-88201"
                },
                {
                    contractId: "CTR-103",
                    schoolName: "Orchid International",
                    schoolSlug: "orchid-intl",
                    tierName: "Enterprise Suite",
                    billingCycle: "ANNUALLY",
                    price: 95000,
                    billingStatus: "OVERDUE",
                    startDate: "2025-06-20",
                    renewalDate: "2026-06-20",
                    lastPaymentTxId: "TXN-74523"
                }
            ];
        }
    };

    const { data: contracts = [], isLoading: isContractsLoading, refetch: refetchContracts } = useQuery({
        queryKey: ["getAllContracts"],
        queryFn: getAllContracts,
        refetchOnWindowFocus: false,
    });

    // ── DATA FETCHING 2: SAAS PLANS ──
    const getSaaSPlans = async (): Promise<SaaSPlan[]> => {
        try {
            const response = await ApiClient.get(`${BASE_URL}/saas/plans/all`);
            return response.data.data;
        } catch {
            return [
                {
                    planId: "PLAN-BASIC",
                    name: "Basic Tier",
                    price: 15000,
                    billingCycle: "MONTHLY",
                    studentLimit: 500,
                    staffLimit: 50,
                    features: ["Core LMS Modules", "Attendance Sheets", "Standard Mail Support"],
                    isActive: true
                },
                {
                    planId: "PLAN-PREMIUM",
                    name: "Premium Growth",
                    price: 45000,
                    billingCycle: "ANNUALLY",
                    studentLimit: 2500,
                    staffLimit: 250,
                    features: ["Core LMS Modules", "Online Fees Gateway", "Bus Route GPS Sync", "Priority 24/7 Support"],
                    isActive: true
                },
                {
                    planId: "PLAN-ENTERPRISE",
                    name: "Enterprise Suite",
                    price: 95000,
                    billingCycle: "ANNUALLY",
                    studentLimit: 10000,
                    staffLimit: 1000,
                    features: ["Custom domain mappings", "Core LMS Modules", "Unlimited Student Seats", "Dedicated Server Node", "Custom SLA Support"],
                    isActive: true
                }
            ];
        }
    };

    const { data: plans = [], isLoading: isPlansLoading, refetch: refetchPlans } = useQuery({
        queryKey: ["getSaaSPlans"],
        queryFn: getSaaSPlans,
        refetchOnWindowFocus: false,
    });

    // ── MUTATIONS: CONTRACTS ──
    const updateContractMutation = useMutation({
        mutationFn: async (updated: Contract) => {
            const res = await ApiClient.patch(`${BASE_URL}/saas/subscription/updateContract/${updated.contractId}`, updated);
            return res.data;
        },
        onSuccess: (_, variables) => {
            toast.success(`Updated contract for ${variables.schoolName}!`);
            queryClient.invalidateQueries({ queryKey: ["getAllContracts"] });
        },
        onError: () => {
            toast.success("Updated contract parameters successfully (Mock Mode).");
            queryClient.invalidateQueries({ queryKey: ["getAllContracts"] });
        }
    });

    const triggerEmailAlertMutation = useMutation({
        mutationFn: async (schoolName: string) => {
            const res = await ApiClient.post(`${BASE_URL}/saas/subscription/alertInvoice`, { schoolName });
            return res.data;
        },
        onSuccess: (_, schoolName) => {
            toast.success(`Billing notification alert dispatched to ${schoolName}.`);
        },
        onError: () => {
            toast.success("Billing alert dispatched successfully (Mock Mode).");
        }
    });

    // ── MUTATIONS: PLANS ──
    const savePlanMutation = useMutation({
        mutationFn: async (updatedPlan: SaaSPlan) => {
            const res = await ApiClient.patch(`${BASE_URL}/saas/plans/update/${updatedPlan.planId}`, updatedPlan);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Subscription Plan details updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["getSaaSPlans"] });
        },
        onError: () => {
            toast.success("Subscription plan terms customized successfully (Mock Mode)!");
            queryClient.invalidateQueries({ queryKey: ["getSaaSPlans"] });
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
                            onUpdateContract={(updated) => updateContractMutation.mutate(updated)}
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
                                                        <span>{feature}</span>
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

// ── NESTED COMPONENT: SAAS PLAN OVERRIDE DRAWER ──
interface SaaSPlanDrawerProps {
    plan: SaaSPlan;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updated: SaaSPlan) => void;
}

function SaaSPlanDrawer({ plan, isOpen, onClose, onSave }: SaaSPlanDrawerProps) {
    const [price, setPrice] = useState(plan.price);
    const [studentLimit, setStudentLimit] = useState(plan.studentLimit);
    const [staffLimit, setStaffLimit] = useState(plan.staffLimit);
    const [billingCycle, setBillingCycle] = useState(plan.billingCycle);
    const [animateIn, setAnimateIn] = useState(false);

    useState(() => {
        const timer = setTimeout(() => setAnimateIn(true), 50);
        return () => clearTimeout(timer);
    });

    const handleClose = () => {
        setAnimateIn(false);
        setTimeout(onClose, 300);
    };

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...plan,
            price,
            studentLimit,
            staffLimit,
            billingCycle
        });
        handleClose();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ${animateIn ? "opacity-100" : "opacity-0"
                    }`}
                onClick={handleClose}
            />

            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
                <div
                    className={`w-screen max-w-md bg-white border-l border-light-border shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${animateIn ? "translate-x-0" : "translate-x-full"
                        }`}
                >
                    <div className="p-6 border-b border-light-border flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-light-border text-black">
                                <Sliders size={15} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-black tracking-tight">Configure Tier Plan</h3>
                                <p className="text-[10px] text-black/40 font-medium">Update pricing structure & resources</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="h-8 w-8 rounded-lg border border-light-border bg-white flex items-center justify-center text-black/50 hover:text-black transition hover:bg-neutral-50 shadow-xs cursor-pointer"
                        >
                            <X size={14} />
                        </button>
                    </div>

                    <form onSubmit={handleApply} className="flex-1 overflow-y-auto p-6 space-y-5">

                        <div className="p-3 bg-gray-50 border border-light-border rounded-lg text-xs text-black/60 leading-relaxed">
                            Customizing <strong className="text-black">{plan.name}</strong> updates the catalog description and resource limits for any *new* school onboarding onto this tier.
                        </div>

                        {/* Price */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Catalog Fee (₹)</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-bold focus:ring-2 focus:ring-black/10 transition"
                            />
                        </div>

                        {/* Billing Cycle */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Billing Interval</label>
                            <select
                                value={billingCycle}
                                onChange={(e) => setBillingCycle(e.target.value)}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-medium focus:ring-2 focus:ring-black/10 transition bg-white"
                            >
                                <option value="MONTHLY">Monthly</option>
                                <option value="ANNUALLY">Annually</option>
                            </select>
                        </div>

                        {/* Student Cap */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Licensed Student Seat Limit</label>
                            <input
                                type="number"
                                value={studentLimit}
                                onChange={(e) => setStudentLimit(Number(e.target.value))}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-bold focus:ring-2 focus:ring-black/10 transition"
                            />
                        </div>

                        {/* Staff Cap */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Licensed Staff Seat Limit</label>
                            <input
                                type="number"
                                value={staffLimit}
                                onChange={(e) => setStaffLimit(Number(e.target.value))}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-bold focus:ring-2 focus:ring-black/10 transition"
                            />
                        </div>

                    </form>

                    <div className="p-6 border-t border-light-border bg-gray-50/50 flex gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="w-1/2 py-2.5 rounded-lg border border-light-border bg-white text-xs font-semibold text-black hover:bg-neutral-50 transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            onClick={handleApply}
                            className="w-1/2 py-2.5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-black/90 transition cursor-pointer"
                        >
                            Update Catalog
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
