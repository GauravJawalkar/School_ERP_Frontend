"use client";

import { useState, useEffect } from "react";
import { Sliders, X, Check, Trash2 } from "lucide-react";
import { AVAILABLE_MODULES } from "@/constants/subscriptionModules.constants";

interface SaaSPlan {
    planId: string;
    name: string;
    studentLimit: number;
    staffLimit: number;
    features: string[];
    isActive: boolean;
    dbPlanId: number;
    prices: Array<{
        id: number;
        billingPeriod: string;
        amount: string;
    }>;
}

interface SaaSPlanDrawerProps {
    plan: SaaSPlan;
    isOpen: boolean;
    onClose: () => void;
    onSave: (payload: {
        planId: string;
        name: string;
        studentLimit: number;
        staffLimit: number;
        features: string[];
        price: number;
        billingCycle: string;
        dbPlanId: number;
        dbPriceId: number;
        isActive: boolean;
    }) => void;
    onDelete?: (dbPlanId: number) => Promise<any> | void;
    isPending?: boolean;
}

export default function SaaSPlanDrawer({
    plan,
    isOpen,
    onClose,
    onSave,
    onDelete,
    isPending = false
}: SaaSPlanDrawerProps) {
    const [name, setName] = useState(plan.name);
    const [studentLimit, setStudentLimit] = useState(plan.studentLimit);
    const [staffLimit, setStaffLimit] = useState(plan.staffLimit);
    const [selectedModules, setSelectedModules] = useState<string[]>([]);
    const [isActive, setIsActive] = useState(plan.isActive);
    
    // Billing and price states
    const [billingCycle, setBillingCycle] = useState("MONTHLY");
    const [price, setPrice] = useState(0);
    const [dbPriceId, setDbPriceId] = useState(0);
    
    const [animateIn, setAnimateIn] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (isOpen && plan) {
            setName(plan.name);
            setStudentLimit(plan.studentLimit);
            setStaffLimit(plan.staffLimit);
            setSelectedModules(plan.features || []);
            setIsActive(plan.isActive);

            // Match initial billing period (default: MONTHLY)
            const initialCycle = "MONTHLY";
            setBillingCycle(initialCycle);
            const matchedPrice = plan.prices?.find(p => p.billingPeriod === initialCycle) || plan.prices?.[0];
            if (matchedPrice) {
                setPrice(parseFloat(matchedPrice.amount));
                setDbPriceId(matchedPrice.id);
            } else {
                setPrice(0);
                setDbPriceId(0);
            }

            const timer = setTimeout(() => setAnimateIn(true), 50);
            return () => clearTimeout(timer);
        } else {
            setAnimateIn(false);
        }
    }, [isOpen, plan]);

    const handleClose = () => {
        if (isPending || isDeleting) return;
        setAnimateIn(false);
        setTimeout(onClose, 300);
    };

    const handleBillingCycleChange = (cycle: string) => {
        setBillingCycle(cycle);
        const matchedPrice = plan.prices?.find(p => p.billingPeriod === cycle);
        if (matchedPrice) {
            setPrice(parseFloat(matchedPrice.amount));
            setDbPriceId(matchedPrice.id);
        } else {
            setPrice(0);
            setDbPriceId(0);
        }
    };

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();
        if (isPending || isDeleting) return;

        onSave({
            planId: plan.planId,
            name,
            studentLimit,
            staffLimit,
            features: selectedModules,
            price,
            billingCycle,
            dbPlanId: plan.dbPlanId,
            dbPriceId,
            isActive
        });
    };

    const handleDelete = () => {
        if (!onDelete) return;
        onDelete(plan.dbPlanId);
        setAnimateIn(false);
        setTimeout(onClose, 300);
    };

    const isWorking = isPending || isDeleting;

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
                            disabled={isWorking}
                            className="h-8 w-8 rounded-lg border border-light-border bg-white flex items-center justify-center text-black/50 hover:text-black transition hover:bg-neutral-50 shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <X size={14} />
                        </button>
                    </div>

                    <form onSubmit={handleApply} className="flex-1 overflow-y-auto p-6 space-y-5 slim-scrollbar">

                        <div className="p-3 bg-gray-50 border border-light-border rounded-lg text-xs text-black/60 leading-relaxed">
                            Customizing <strong className="text-black">{plan.name}</strong> updates the catalog description and resource limits for any *new* school onboarding onto this tier.
                        </div>

                        {/* Active Status Checkbox */}
                        <div className="flex items-center justify-between p-3.5 bg-neutral-50 border border-light-border rounded-xl">
                            <div>
                                <span className="text-xs font-bold text-black block">Active Catalog Status</span>
                                <span className="text-[10px] text-black/45 font-medium block mt-0.5">Toggle tier availability for client registration</span>
                            </div>
                            <input
                                type="checkbox"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                disabled={isWorking}
                                className="w-4 h-4 accent-black rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        {/* Plan Name */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Plan Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={isWorking}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-semibold focus:ring-2 focus:ring-black/10 transition text-black disabled:opacity-60 disabled:bg-neutral-50"
                            />
                        </div>

                        {/* Billing Cycle */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Configure Price For Interval</label>
                            <select
                                value={billingCycle}
                                onChange={(e) => handleBillingCycleChange(e.target.value)}
                                disabled={isWorking}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-medium focus:ring-2 focus:ring-black/10 transition bg-white text-black disabled:opacity-60 disabled:bg-neutral-50"
                            >
                                <option value="MONTHLY">Monthly</option>
                                <option value="HALF_YEARLY">Half Yearly</option>
                                <option value="ANNUALLY">Annually</option>
                            </select>
                        </div>

                        {/* Price */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Catalog Fee (₹)</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                disabled={isWorking}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-bold focus:ring-2 focus:ring-black/10 transition text-black disabled:opacity-60 disabled:bg-neutral-50"
                            />
                        </div>

                        {/* Student Cap */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Licensed Student Seat Limit</label>
                            <input
                                type="number"
                                value={studentLimit}
                                onChange={(e) => setStudentLimit(Number(e.target.value))}
                                disabled={isWorking}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-bold focus:ring-2 focus:ring-black/10 transition text-black disabled:opacity-60 disabled:bg-neutral-50"
                            />
                        </div>

                        {/* Staff Cap */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Licensed Staff Seat Limit</label>
                            <input
                                type="number"
                                value={staffLimit}
                                onChange={(e) => setStaffLimit(Number(e.target.value))}
                                disabled={isWorking}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-bold focus:ring-2 focus:ring-black/10 transition text-black disabled:opacity-60 disabled:bg-neutral-50"
                            />
                        </div>

                        {/* Features Catalog (Custom Checklist) */}
                        <div className="space-y-2 border-t border-light-border/40 pt-4 pb-2">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Features Catalog</label>
                            <p className="text-[10px] text-black/45 font-medium -mt-1 mb-3 leading-relaxed">Select system modules to bundle inside this plan tier</p>

                            <div className="grid grid-cols-2 gap-2 mt-2 max-h-72 overflow-y-auto slim-scrollbar pr-1">
                                {AVAILABLE_MODULES.map(moduleName => {
                                    const isActiveModule = selectedModules.includes(moduleName);
                                    return (
                                        <div
                                            key={moduleName}
                                            onClick={() => {
                                                if (isWorking) return;
                                                if (isActiveModule) {
                                                    setSelectedModules(prev => prev.filter(m => m !== moduleName));
                                                } else {
                                                    setSelectedModules(prev => [...prev, moduleName]);
                                                }
                                            }}
                                            className={`flex items-center justify-between p-2.5 rounded-lg border transition-all duration-200 cursor-pointer select-none ${isActiveModule
                                                    ? "bg-black text-white border-black"
                                                    : "bg-white text-black/60 border-light-border hover:border-black/30 hover:bg-neutral-50"
                                                } ${isWorking ? "opacity-50 cursor-not-allowed" : ""}`}
                                        >
                                            <span className="text-[11px] font-bold capitalize tracking-wide">{moduleName.replace('_', ' ')}</span>
                                            <div className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center transition-all ${isActiveModule
                                                    ? "bg-white border-white text-black"
                                                    : "border-black/20 text-transparent"
                                                }`}>
                                                <Check size={8} strokeWidth={4} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </form>

                    <div className="p-6 border-t border-light-border bg-gray-50/50 flex gap-3 items-center">
                        {onDelete && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isWorking}
                                className="px-3.5 py-2.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-xs font-bold text-red-600 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs mr-auto"
                            >
                                <Trash2 size={13} />
                                {isDeleting ? "Deleting..." : "Delete Tier"}
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isWorking}
                            className="px-4 py-2.5 rounded-lg border border-light-border bg-white text-xs font-semibold text-black hover:bg-neutral-50 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            onClick={handleApply}
                            disabled={isWorking}
                            className="px-4 py-2.5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-black/90 transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? "Updating..." : "Update Catalog"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
