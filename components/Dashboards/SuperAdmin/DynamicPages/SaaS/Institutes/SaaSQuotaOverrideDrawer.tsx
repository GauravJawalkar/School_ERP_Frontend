"use client";

import { useState, useEffect } from "react";
import { X, Users, Info } from "lucide-react";
import { School } from "@/interfaces/interface";

interface SaaSQuotaOverrideDrawerProps {
    school: School | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (schoolSlug: string, newCap: number) => void;
}

export default function SaaSQuotaOverrideDrawer({
    school,
    isOpen,
    onClose,
    onSave
}: SaaSQuotaOverrideDrawerProps) {
    const [quotaInput, setQuotaInput] = useState<number>(0);
    const [animateIn, setAnimateIn] = useState(false);

    // Get current plan thresholds as baseline helpers
    const currentStudents = school ? Number(school.totalStudents || school.students || 0) : 0;
    let baseCap = 500;
    if (currentStudents > 2500) {
        baseCap = 10000;
    } else if (currentStudents > 500) {
        baseCap = 2500;
    }

    useEffect(() => {
        if (school && isOpen) {
            setQuotaInput(baseCap);
            const timer = setTimeout(() => setAnimateIn(true), 50);
            return () => clearTimeout(timer);
        } else {
            setAnimateIn(false);
        }
    }, [school, isOpen, baseCap]);

    if (!school || !isOpen) return null;

    const handleClose = () => {
        setAnimateIn(false);
        setTimeout(onClose, 300);
    };

    const handleApply = () => {
        onSave(school.schoolSlug ?? "", quotaInput);
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
                                <Users size={15} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-black tracking-tight">Override License Cap</h3>
                                <p className="text-[10px] text-black/40 font-medium">Manually adjust school capacity rules</p>
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
                            <span>This overrides the automated plan quota calculations, applying custom scaling configurations directly to <strong className="text-black">{school.schoolName}</strong>.</span>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Maximum Student Seats</label>
                                <input
                                    type="number"
                                    value={quotaInput}
                                    onChange={(e) => setQuotaInput(Number(e.target.value))}
                                    className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-bold focus:ring-2 focus:ring-black/10 transition"
                                />
                            </div>

                            <div className="p-3 rounded-lg border border-yellow-200 bg-yellow-50/50 text-[11px] text-yellow-800 leading-normal">
                                <strong>Caution:</strong> Overriding the cap to values lower than the school's actual student enrollment will restrict teachers from registering new students until seats are manually increased or upgraded.
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
                            Apply Override
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
