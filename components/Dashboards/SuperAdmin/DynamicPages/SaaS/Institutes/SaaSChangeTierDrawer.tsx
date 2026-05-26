"use client";

import { useState, useEffect } from "react";
import { X, Check, Sliders, Info } from "lucide-react";

import { School } from "@/interfaces/interface";

interface SaaSChangeTierDrawerProps {
    school: School | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (schoolSlug: string, newTier: string) => void;
}

export default function SaaSChangeTierDrawer({
    school,
    isOpen,
    onClose,
    onSave
}: SaaSChangeTierDrawerProps) {
    const [selectedTier, setSelectedTier] = useState("");
    const [animateIn, setAnimateIn] = useState(false);

    // Get current tier based on student count for baseline option selecting
    const currentStudents = school ? Number(school.totalStudents || school.students || 0) : 0;
    let baselineTier = "Basic Tier";
    if (currentStudents > 2500) {
        baselineTier = "Enterprise Suite";
    } else if (currentStudents > 500) {
        baselineTier = "Premium Growth";
    }

    useEffect(() => {
        if (school && isOpen) {
            setSelectedTier(baselineTier);
            const timer = setTimeout(() => setAnimateIn(true), 50);
            return () => clearTimeout(timer);
        } else {
            setAnimateIn(false);
        }
    }, [school, isOpen, baselineTier]);

    if (!school || !isOpen) return null;

    const handleClose = () => {
        setAnimateIn(false);
        setTimeout(onClose, 300);
    };

    const handleApply = () => {
        onSave(school.schoolSlug ?? "", selectedTier);
        handleClose();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ${animateIn ? "opacity-100" : "opacity-0"
                    }`}
                onClick={handleClose}
            />

            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
                {/* Slide-over panel */}
                <div
                    className={`w-screen max-w-md bg-white border-l border-light-border shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${animateIn ? "translate-x-0" : "translate-x-full"
                        }`}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-light-border flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-light-border text-black">
                                <Sliders size={15} />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-black tracking-tight">Shift Subscription Tier</h3>
                                <p className="text-[10px] text-black/40 font-medium">Update pricing models & limits</p>
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

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        <div className="p-3 bg-gray-50 border border-light-border rounded-lg flex gap-2.5 text-xs text-black/60 leading-relaxed">
                            <Info size={16} className="shrink-0 text-black/70 mt-0.5" />
                            <span>Updating the billing tier for <strong className="text-black">{school.schoolName}</strong> adjusts their resource limits and core LMS capabilities immediately.</span>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Select New Subscription Plan</label>

                            <div className="space-y-2.5">
                                {[
                                    { name: "Basic Tier", desc: "Up to 500 students, standard mail support" },
                                    { name: "Premium Growth", desc: "Up to 2500 students, priority 24/7 support" },
                                    { name: "Enterprise Suite", desc: "Unlimited students & staff accounts, custom SLA" }
                                ].map((tier) => {
                                    const isSelected = selectedTier === tier.name;
                                    return (
                                        <button
                                            type="button"
                                            key={tier.name}
                                            onClick={() => setSelectedTier(tier.name)}
                                            className={`w-full p-4 rounded-xl border text-left transition select-none cursor-pointer flex justify-between items-center ${isSelected
                                                    ? "bg-black text-white border-black"
                                                    : "bg-white text-black border-light-border hover:bg-gray-50"
                                                }`}
                                        >
                                            <div>
                                                <h4 className="text-sm font-semibold">{tier.name}</h4>
                                                <p className={`text-[10px] mt-0.5 font-medium ${isSelected ? "text-white/60" : "text-black/40"}`}>
                                                    {tier.desc}
                                                </p>
                                            </div>
                                            <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${isSelected ? "bg-white text-black border-white" : "border-gray-300"
                                                }`}>
                                                {isSelected && <Check size={10} strokeWidth={3.5} />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="p-6 border-t border-light-border bg-gray-50/50 flex gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="w-1/2 py-2.5 rounded-lg border border-light-border bg-white text-xs font-semibold text-black hover:bg-neutral-50 transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleApply}
                            className="w-1/2 py-2.5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-black/90 transition cursor-pointer"
                        >
                            Apply Shift
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
