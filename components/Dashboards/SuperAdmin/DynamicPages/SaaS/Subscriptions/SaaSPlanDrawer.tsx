"use client";

import { useState, useEffect } from "react";
import { Sliders, X, Check } from "lucide-react";
import { AVAILABLE_MODULES } from "@/constants/subscriptionModules.constants";

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
    }) => void;
}

export default function SaaSPlanDrawer({ plan, isOpen, onClose, onSave }: SaaSPlanDrawerProps) {
    const [name, setName] = useState(plan.name);
    const [price, setPrice] = useState(plan.price);
    const [studentLimit, setStudentLimit] = useState(plan.studentLimit);
    const [staffLimit, setStaffLimit] = useState(plan.staffLimit);
    const [billingCycle, setBillingCycle] = useState(plan.billingCycle);
    const [selectedModules, setSelectedModules] = useState<string[]>([]);
    const [animateIn, setAnimateIn] = useState(false);

    useEffect(() => {
        if (isOpen && plan) {
            setName(plan.name);
            setPrice(plan.price);
            setStudentLimit(plan.studentLimit);
            setStaffLimit(plan.staffLimit);
            setBillingCycle(plan.billingCycle);
            setSelectedModules(plan.features || []);

            const timer = setTimeout(() => setAnimateIn(true), 50);
            return () => clearTimeout(timer);
        } else {
            setAnimateIn(false);
        }
    }, [isOpen, plan]);

    const handleClose = () => {
        setAnimateIn(false);
        setTimeout(onClose, 300);
    };

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();

        onSave({
            ...plan,
            name,
            price,
            studentLimit,
            staffLimit,
            billingCycle,
            features: selectedModules
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

                        {/* Plan Name */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Plan Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-semibold focus:ring-2 focus:ring-black/10 transition text-black"
                            />
                        </div>

                        {/* Price */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Catalog Fee (₹)</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-bold focus:ring-2 focus:ring-black/10 transition text-black"
                            />
                        </div>

                        {/* Billing Cycle */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Billing Interval</label>
                            <select
                                value={billingCycle}
                                onChange={(e) => setBillingCycle(e.target.value)}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-medium focus:ring-2 focus:ring-black/10 transition bg-white text-black"
                            >
                                <option value="MONTHLY">Monthly</option>
                                <option value="HALF_YEARLY">Half Yearly</option>
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
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-bold focus:ring-2 focus:ring-black/10 transition text-black"
                            />
                        </div>

                        {/* Staff Cap */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Licensed Staff Seat Limit</label>
                            <input
                                type="number"
                                value={staffLimit}
                                onChange={(e) => setStaffLimit(Number(e.target.value))}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-bold focus:ring-2 focus:ring-black/10 transition text-black"
                            />
                        </div>

                        {/* Features Catalog (Custom Sleek Checklist) */}
                        <div className="space-y-2 border-t border-light-border/40 pt-4 pb-2">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Features Catalog</label>
                            <p className="text-[10px] text-black/45 font-medium -mt-1 mb-3 leading-relaxed">Select system modules to bundle inside this plan tier</p>

                            <div className="grid grid-cols-2 gap-2 mt-2 max-h-72 overflow-y-auto slim-scrollbar pr-1">
                                {AVAILABLE_MODULES.map(moduleName => {
                                    const isActive = selectedModules.includes(moduleName);
                                    return (
                                        <div
                                            key={moduleName}
                                            onClick={() => {
                                                if (isActive) {
                                                    setSelectedModules(prev => prev.filter(m => m !== moduleName));
                                                } else {
                                                    setSelectedModules(prev => [...prev, moduleName]);
                                                }
                                            }}
                                            className={`flex items-center justify-between p-2.5 rounded-lg border transition-all duration-200 cursor-pointer select-none ${isActive
                                                    ? "bg-black text-white border-black"
                                                    : "bg-white text-black/60 border-light-border hover:border-black/30 hover:bg-neutral-50"
                                                }`}
                                        >
                                            <span className="text-[11px] font-bold capitalize tracking-wide">{moduleName.replace('_', ' ')}</span>
                                            <div className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center transition-all ${isActive
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
