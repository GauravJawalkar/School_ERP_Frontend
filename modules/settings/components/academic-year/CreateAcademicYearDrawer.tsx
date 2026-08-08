"use client";

import React, { useState, useEffect } from "react";
import { X, CalendarPlus, Calendar } from "lucide-react";
import toast from "react-hot-toast";

interface CreateAcademicYearDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newYear: { name: string; startDate: string; endDate: string; isActive: boolean }) => void;
    isPending: boolean;
}

export default function CreateAcademicYearDrawer({
    isOpen,
    onClose,
    onSave,
    isPending
}: CreateAcademicYearDrawerProps) {
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setName("");
            setStartDate("");
            setEndDate("");
            setIsActive(false);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Academic Year Identifier is required");
            return;
        }

        if (!startDate || !endDate) {
            toast.error("Start Date and End Date are required");
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end <= start) {
            toast.error("End Date must be after Start Date");
            return;
        }

        onSave({
            name: name.trim(),
            startDate,
            endDate,
            isActive
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop overlay */}
            <div
                className="absolute inset-0 bg-black/35 backdrop-blur-xs transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Slide-over Container */}
            <div className="relative w-full max-w-md h-full bg-white border-l border-light-border shadow-2xl flex flex-col justify-between z-10 animate-slide-in">
                {/* Header */}
                <div className="p-5 border-b border-light-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neutral-50 rounded-lg flex items-center justify-center border border-light-border shrink-0">
                            <CalendarPlus size={16} className="text-black" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-black uppercase tracking-wide">
                                Create Academic Year
                            </h2>
                            <p className="text-xs text-black/50">Register a new calendar cycle and operational session range.</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-9 h-8 rounded-full border border-light-border hover:border-black/70 hover:border-2 flex items-center justify-center text-black/50 hover:text-black transition cursor-pointer"
                    >
                        <X size={14} />
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
                    {/* Academic Year Name */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-black/70 uppercase tracking-widest block">
                            Academic Year Identifier
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. 2025-2026 or AY 2024-25"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full h-9 px-3 border border-light-border rounded-lg text-xs text-black placeholder-black/30 focus:border-black focus:outline-hidden transition bg-white"
                        />
                        <span className="text-[11px] text-black/40 block leading-tight">
                            A unique title to identify the calendar timeline across the database directory.
                        </span>
                    </div>

                    {/* Dates Range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-black/70 uppercase tracking-widest block">
                                Start Date
                            </label>
                            <input
                                type="date"
                                required
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full h-9 px-3 border border-light-border rounded-lg text-xs text-black focus:border-black focus:outline-hidden transition bg-white cursor-pointer"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-black/70 uppercase tracking-widest block">
                                End Date
                            </label>
                            <input
                                type="date"
                                required
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full h-9 px-3 border border-light-border rounded-lg text-xs text-black focus:border-black focus:outline-hidden transition bg-white cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Activate Checkbox */}
                    <div className="pt-2">
                        <label className="flex items-start gap-3 cursor-pointer p-3 border border-light-border rounded-lg bg-gray-50/30 hover:bg-gray-50/60 transition">
                            <input
                                type="checkbox"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className="mt-0.5 w-4 h-4 text-black border-light-border rounded-sm focus:ring-0 focus:outline-hidden cursor-pointer accent-black"
                            />
                            <div className="space-y-1">
                                <span className="text-xs font-semibold text-black block">Set as Active Year</span>
                                <p className="text-[11px] text-black/45 leading-normal">
                                    Marking this as active will automatically deactivate all other academic years across the platform.
                                </p>
                            </div>
                        </label>
                    </div>
                </form>

                {/* Footer Controls */}
                <div className="p-4 border-t border-light-border bg-neutral-50/75 flex items-center justify-end gap-2.5">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isPending}
                        className="h-9 px-4 rounded-lg border border-light-border text-xs font-semibold hover:border-black hover:bg-neutral-50 transition cursor-pointer text-black"
                    >
                        Discard
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="h-9 px-5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-black/90 transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                        <Calendar size={13} />
                        {isPending ? "Creating Year..." : "Confirm & Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}
