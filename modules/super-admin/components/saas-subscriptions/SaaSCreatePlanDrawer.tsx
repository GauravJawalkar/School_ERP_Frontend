"use client";

import { useState, useEffect } from "react";
import { Plus, X, Check } from "lucide-react";
import { AVAILABLE_MODULES } from "@/constants/subscriptionModules.constants";

interface SaaSCreatePlanDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (payload: {
        name: string;
        slug: string;
        description: string;
        price: number;
        billingCycle: string;
        studentLimit: number;
        staffLimit: number;
        features: string[];
    }) => void;
    isPending?: boolean;
}

export default function SaaSCreatePlanDrawer({ isOpen, onClose, onSave, isPending = false }: SaaSCreatePlanDrawerProps) {
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [studentLimit, setStudentLimit] = useState(500);
    const [staffLimit, setStaffLimit] = useState(50);
    const [billingCycle, setBillingCycle] = useState("MONTHLY");
    const [selectedModules, setSelectedModules] = useState<string[]>([]);
    const [animateIn, setAnimateIn] = useState(false);

    // Auto-generate slug from name
    useEffect(() => {
        setSlug(name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));
    }, [name]);

    useEffect(() => {
        if (isOpen) {
            setName("");
            setSlug("");
            setDescription("");
            setPrice(0);
            setStudentLimit(500);
            setStaffLimit(50);
            setBillingCycle("MONTHLY");
            setSelectedModules([]);
            
            const timer = setTimeout(() => setAnimateIn(true), 50);
            return () => clearTimeout(timer);
        } else {
            setAnimateIn(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleClose = () => {
        if (isPending) return;
        setAnimateIn(false);
        setTimeout(onClose, 300);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isPending) return;
        if (!name || !slug) return;

        onSave({
            name,
            slug,
            description: description || `${name} subscription plan`,
            price,
            billingCycle,
            studentLimit,
            staffLimit,
            features: selectedModules
        });
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
                                <Plus size={15} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-black tracking-tight">Create Tier Plan</h3>
                                <p className="text-[10px] text-black/40 font-medium">Add a new pricing tier to the catalog</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isPending}
                            className="h-8 w-8 rounded-lg border border-light-border bg-white flex items-center justify-center text-black/50 hover:text-black transition hover:bg-neutral-50 shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <X size={14} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 slim-scrollbar">

                        <div className="p-3 bg-gray-50 border border-light-border rounded-lg text-xs text-black/60 leading-relaxed">
                            Creating a new plan tier registers it on the system, making it immediately available for new institute registrations.
                        </div>

                        {/* Plan Name */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Plan Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Platinum Premium"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={isPending}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-semibold focus:ring-2 focus:ring-black/10 transition text-black placeholder:text-black/30 disabled:opacity-60 disabled:bg-neutral-50"
                                required
                            />
                        </div>

                        {/* Plan Slug */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Slug Identifier</label>
                            <input
                                type="text"
                                placeholder="e.g. platinum-premium"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                disabled={isPending}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-mono font-semibold focus:ring-2 focus:ring-black/10 transition text-black placeholder:text-black/30 bg-neutral-50 disabled:opacity-60"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Description</label>
                            <input
                                type="text"
                                placeholder="e.g. Tailored for enterprise operations"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={isPending}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-semibold focus:ring-2 focus:ring-black/10 transition text-black placeholder:text-black/30 disabled:opacity-60 disabled:bg-neutral-50"
                            />
                        </div>

                        {/* Price */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Catalog Fee (₹)</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                disabled={isPending}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-bold focus:ring-2 focus:ring-black/10 transition text-black disabled:opacity-60 disabled:bg-neutral-50"
                                required
                            />
                        </div>

                        {/* Billing Cycle */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Billing Interval</label>
                            <select
                                value={billingCycle}
                                onChange={(e) => setBillingCycle(e.target.value)}
                                disabled={isPending}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-medium focus:ring-2 focus:ring-black/10 transition bg-white text-black disabled:opacity-60 disabled:bg-neutral-50"
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
                                disabled={isPending}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-bold focus:ring-2 focus:ring-black/10 transition text-black disabled:opacity-60 disabled:bg-neutral-50"
                                required
                            />
                        </div>

                        {/* Staff Cap */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Licensed Staff Seat Limit</label>
                            <input
                                type="number"
                                value={staffLimit}
                                onChange={(e) => setStaffLimit(Number(e.target.value))}
                                disabled={isPending}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-bold focus:ring-2 focus:ring-black/10 transition text-black disabled:opacity-60 disabled:bg-neutral-50"
                                required
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
                                                if (isPending) return;
                                                if (isActive) {
                                                    setSelectedModules(prev => prev.filter(m => m !== moduleName));
                                                } else {
                                                    setSelectedModules(prev => [...prev, moduleName]);
                                                }
                                            }}
                                            className={`flex items-center justify-between p-2.5 rounded-lg border transition-all duration-200 cursor-pointer select-none ${isActive
                                                    ? "bg-black text-white border-black"
                                                    : "bg-white text-black/60 border-light-border hover:border-black/30 hover:bg-neutral-50"
                                                } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
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
                            disabled={isPending}
                            className="w-1/2 py-2.5 rounded-lg border border-light-border bg-white text-xs font-semibold text-black hover:bg-neutral-50 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={isPending}
                            className="w-1/2 py-2.5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-black/90 transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? "Creating..." : "Create Plan"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
