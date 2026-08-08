"use client";

import React, { useState, useEffect } from "react";
import { X, Pencil, Info, Calendar } from "lucide-react";
import toast from "react-hot-toast";

interface FeeStructure {
    id: number;
    classId: number;
    feeHeadId: number;
    feeHeadName: string | null;
    feeType: string | null;
    amount: string;
    frequency: string;
    isCompulsory: boolean;
    dueDay: number | null;
}

interface EditClassFeeDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (payload: {
        amount: string;
        frequency: string;
        isCompulsory: boolean;
        dueDay: number;
    }) => void;
    isPending: boolean;
    selectedStructure: FeeStructure | null;
    classes: any[];
}

export default function EditClassFeeDrawer({
    isOpen,
    onClose,
    onSave,
    isPending,
    selectedStructure,
    classes
}: EditClassFeeDrawerProps) {
    const [animateIn, setAnimateIn] = useState(false);

    // Form inputs
    const [amount, setAmount] = useState("");
    const [frequency, setFrequency] = useState("MONTHLY");
    const [isCompulsory, setIsCompulsory] = useState(true);
    const [dueDay, setDueDay] = useState("");

    useEffect(() => {
        if (isOpen && selectedStructure) {
            setAmount(selectedStructure.amount);
            setFrequency(selectedStructure.frequency);
            setIsCompulsory(selectedStructure.isCompulsory);
            setDueDay(String(selectedStructure.dueDay || ""));

            const timer = setTimeout(() => setAnimateIn(true), 50);
            return () => clearTimeout(timer);
        } else {
            setAnimateIn(false);
        }
    }, [isOpen, selectedStructure]);

    if (!isOpen || !selectedStructure) return null;

    const handleClose = () => {
        setAnimateIn(false);
        setTimeout(onClose, 300);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || Number(amount) <= 0) return toast.error("Amount must be greater than 0");
        if (!dueDay || Number(dueDay) < 1 || Number(dueDay) > 31) return toast.error("Due day must be between 1 and 31");

        onSave({
            amount: String(amount),
            frequency,
            isCompulsory,
            dueDay: Number(dueDay)
        });
    };

    const relatedClass = classes?.find((c: any) => c.id === selectedStructure.classId);

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
                    className={`w-screen max-w-lg bg-white border-l border-light-border shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${animateIn ? "translate-x-0" : "translate-x-full"
                        }`}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-light-border flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-light-border text-black">
                                <Pencil size={15} />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-black tracking-tight">Modify Mapped Class Fee</h3>
                                <p className="text-xs text-black/40 font-normal">
                                    Updating {selectedStructure.feeHeadName || "General Component"} for Class {relatedClass?.className || selectedStructure.classId}
                                </p>
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
                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 slim-scrollbar text-xs">
                        {/* Info Callout */}
                        <div className="p-3 bg-gray-50 border border-light-border rounded-lg flex gap-2.5 text-xs text-black/60 leading-relaxed font-medium">
                            <Info size={16} className="shrink-0 text-black/70 mt-0.5" />
                            <span>Class reference, academic year, and billing category links are read-only. Map a new category to edit them.</span>
                        </div>

                        {/* Amount & Due Day */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">
                                    Amount (INR)
                                </label>
                                <input
                                    type="number"
                                    placeholder="15000"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition font-semibold"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">
                                    Due Day (1-31)
                                </label>
                                <input
                                    type="number"
                                    placeholder="10"
                                    min={1}
                                    max={31}
                                    value={dueDay}
                                    onChange={(e) => setDueDay(e.target.value)}
                                    className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition font-semibold"
                                />
                            </div>
                        </div>

                        {/* Frequency & Compulsory Toggle */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">
                                    Billing Frequency
                                </label>
                                <select
                                    value={frequency}
                                    onChange={(e) => setFrequency(e.target.value)}
                                    className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white font-semibold cursor-pointer"
                                >
                                    <option value="ONE_TIME">One Time</option>
                                    <option value="MONTHLY">Monthly</option>
                                    <option value="QUARTERLY">Quarterly</option>
                                    <option value="HALF_YEARLY">Half Yearly</option>
                                    <option value="ANNUALLY">Annually</option>
                                </select>
                            </div>
                            <div className="space-y-1.5 flex flex-col justify-end">
                                <label className="flex gap-3 cursor-pointer p-2.5 border border-light-border rounded-lg bg-gray-50/30 hover:bg-gray-50/60 transition h-10 items-center select-none font-semibold">
                                    <input
                                        type="checkbox"
                                        checked={isCompulsory}
                                        onChange={(e) => setIsCompulsory(e.target.checked)}
                                        className="w-4 h-4 rounded border-light-border focus:ring-0 focus:outline-hidden cursor-pointer accent-black"
                                    />
                                    <span className="text-xs font-semibold text-black">Compulsory Dues</span>
                                </label>
                            </div>
                        </div>
                    </form>

                    {/* Actions */}
                    <div className="p-6 border-t border-light-border bg-gray-50/50 flex gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isPending}
                            className="w-1/2 py-2.5 rounded-lg border border-light-border bg-white text-xs font-semibold text-black hover:bg-neutral-50 transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={isPending}
                            className="w-1/2 py-2.5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-black/90 transition cursor-pointer flex items-center justify-center gap-1.5"
                        >
                            <Calendar size={13} />
                            {isPending ? "Saving..." : "Confirm & Save"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
