"use client";

import React, { useState, useEffect } from "react";
import { X, Settings, Plus } from "lucide-react";
import toast from "react-hot-toast";

interface AddFeeCategoryDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (payload: {
        feeName: string;
        feeType: string;
        description: string;
        taxPercentage: string;
    }) => void;
    isPending: boolean;
}

export default function AddFeeCategoryDrawer({
    isOpen,
    onClose,
    onSave,
    isPending
}: AddFeeCategoryDrawerProps) {
    const [animateIn, setAnimateIn] = useState(false);

    // Form inputs
    const [feeName, setFeeName] = useState("");
    const [feeType, setFeeType] = useState("ACADEMIC");
    const [description, setDescription] = useState("");
    const [taxPercentage, setTaxPercentage] = useState("0.00");

    useEffect(() => {
        if (isOpen) {
            setFeeName("");
            setFeeType("ACADEMIC");
            setDescription("");
            setTaxPercentage("0.00");
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!feeName.trim()) {
            return toast.error("Category name is required");
        }

        onSave({
            feeName: feeName.trim(),
            feeType,
            description: description.trim(),
            taxPercentage
        });
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
                    className={`w-screen max-w-lg bg-white border-l border-light-border shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${animateIn ? "translate-x-0" : "translate-x-full"
                        }`}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-light-border flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-light-border text-black">
                                <Settings size={15} />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-black tracking-tight">Add Fee Category Component</h3>
                                <p className="text-xs text-black/40 font-normal">Register new global billing components</p>
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
                        {/* Component Name */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">
                                Component Name
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Tuition Fee, Hostel Rent"
                                value={feeName}
                                onChange={(e) => setFeeName(e.target.value)}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white font-semibold"
                            />
                        </div>

                        {/* Component Type & Tax */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">
                                    Component Type
                                </label>
                                <select
                                    value={feeType}
                                    onChange={(e) => setFeeType(e.target.value)}
                                    className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white font-semibold cursor-pointer"
                                >
                                    <option value="ACADEMIC">Academic</option>
                                    <option value="TRANSPORT">Transport</option>
                                    <option value="LIBRARY">Library</option>
                                    <option value="EXAM">Exam</option>
                                    <option value="OTHER">Other Component</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">
                                    Tax Rate (%)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={taxPercentage}
                                    onChange={(e) => setTaxPercentage(e.target.value)}
                                    className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition font-semibold"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">
                                Description
                            </label>
                            <textarea
                                placeholder="Brief remarks on what this category represents..."
                                rows={5}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white font-semibold resize-none"
                            />
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
                            <Plus size={13} />
                            {isPending ? "Creating..." : "Confirm Create"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
