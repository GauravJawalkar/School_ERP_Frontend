"use client";

import React, { useState, useEffect } from "react";
import { X, Trash2, ShieldAlert, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

interface DeleteFeeStructureDrawerProps {
    isOpen: boolean;
    feeHeadName: string;
    className: string;
    amount: number;
    frequency: string;
    onClose: () => void;
    onConfirm: () => void;
    isPending: boolean;
}

export default function DeleteFeeStructureDrawer({
    isOpen,
    feeHeadName,
    className,
    amount,
    frequency,
    onClose,
    onConfirm,
    isPending
}: DeleteFeeStructureDrawerProps) {
    const [confirmName, setConfirmName] = useState("");
    const [animateIn, setAnimateIn] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setConfirmName("");
            const timer = setTimeout(() => setAnimateIn(true), 50);
            return () => clearTimeout(timer);
        } else {
            setAnimateIn(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleClose = () => {
        setAnimateIn(false);
        setTimeout(onClose, 300);
    };

    const isMatch = confirmName.trim().toUpperCase() === feeHeadName.trim().toUpperCase();

    const handleSubmit = (e?: React.FormEvent | React.MouseEvent) => {
        if (e) e.preventDefault();
        if (!isMatch || isPending) return;
        onConfirm();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop overlay */}
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ${
                    animateIn ? "opacity-100" : "opacity-0"
                }`}
                onClick={handleClose}
            />

            {/* Slide-over Container */}
            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
                <div
                    className={`w-screen max-w-md bg-white border-l border-light-border shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
                        animateIn ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-light-border flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ShieldAlert size={20} className="text-red-600 shrink-0" />
                            <div>
                                <h2 className="text-sm font-semibold text-black tracking-tight">Delete Fee Mapping</h2>
                                <p className="text-xs text-black/40 font-normal">Remove fee structure from academic class.</p>
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

                    {/* Content */}
                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 slim-scrollbar text-xs">
                        {/* Deletion Warning Box */}
                        <div className="p-4 bg-red-50/50 border border-red-100 rounded-lg space-y-3">
                            <div className="flex items-start gap-2.5">
                                <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={16} />
                                <div>
                                    <h3 className="text-xs font-bold text-red-800 uppercase tracking-wide leading-none">Critical Warning</h3>
                                    <p className="text-xs mt-1.5 leading-relaxed text-black/70 font-medium">
                                        You are about to delete the mapping of <strong className="font-mono bg-red-100 px-1 py-0.5 rounded text-red-700 text-xs font-bold">{feeHeadName}</strong> for <strong className="text-black">Class {className}</strong>.
                                    </p>
                                </div>
                            </div>

                            <ul className="text-xs text-black/70 font-medium space-y-2 list-disc pl-4 pt-1">
                                <li><strong>Fee Mapped Amount</strong>: ₹{amount} ({frequency})</li>
                                <li>Active student invoices generated under this mapping may lose parent references.</li>
                                <li>Payment records linking to this schedule configuration will remain but lose direct association.</li>
                                <li>This action cannot be undone.</li>
                            </ul>
                        </div>

                        {/* Safety confirmation name check */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-black/70 uppercase tracking-wider block">
                                Type Fee Name to Confirm
                            </label>
                            <p className="text-xs text-black/45 leading-normal">
                                To proceed with the deletion, please type the fee head name <strong className="font-semibold text-black">{feeHeadName}</strong> below:
                            </p>
                            <input
                                type="text"
                                required
                                placeholder={`e.g. ${feeHeadName}`}
                                value={confirmName}
                                onChange={(e) => setConfirmName(e.target.value)}
                                className="w-full border border-red-200 focus:border-red-600 outline-none p-2.5 rounded-lg text-xs font-mono font-bold text-red-600 placeholder-black/25 transition bg-white uppercase"
                            />
                        </div>
                    </form>

                    {/* Footer Controls */}
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
                            onClick={handleSubmit}
                            disabled={!isMatch || isPending}
                            className={`w-1/2 py-2.5 rounded-lg text-white text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs ${
                                isMatch && !isPending
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-neutral-200 text-neutral-400 cursor-not-allowed border border-neutral-300 shadow-none"
                            }`}
                        >
                            <Trash2 size={13} />
                            {isPending ? "Deleting..." : "Confirm Delete"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
