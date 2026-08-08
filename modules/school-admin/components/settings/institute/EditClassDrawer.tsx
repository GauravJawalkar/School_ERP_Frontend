"use client";

import React, { useState, useEffect } from "react";
import { X, Pencil, Info, Calendar } from "lucide-react";
import toast from "react-hot-toast";

interface CampusClass {
    id: number;
    className: string;
    capacity: number | null;
    orderIndex: number | null;
    academicYearId: number;
}

interface EditClassDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (payload: {
        className: string;
        academicYearId: number;
        capacity: number | null;
    }) => void;
    isPending: boolean;
    selectedClass: CampusClass | null;
    academicYears: any[];
}

export default function EditClassDrawer({
    isOpen,
    onClose,
    onSave,
    isPending,
    selectedClass,
    academicYears
}: EditClassDrawerProps) {
    const [animateIn, setAnimateIn] = useState(false);

    // Form inputs
    const [classNameInput, setClassNameInput] = useState("");
    const [academicYearId, setAcademicYearId] = useState("");
    const [capacity, setCapacity] = useState("");

    useEffect(() => {
        if (isOpen && selectedClass) {
            setClassNameInput(selectedClass.className);
            setAcademicYearId(String(selectedClass.academicYearId || ""));
            setCapacity(selectedClass.capacity !== null ? String(selectedClass.capacity) : "");

            const timer = setTimeout(() => setAnimateIn(true), 50);
            return () => clearTimeout(timer);
        } else {
            setAnimateIn(false);
        }
    }, [isOpen, selectedClass]);

    if (!isOpen || !selectedClass) return null;

    const handleClose = () => {
        setAnimateIn(false);
        setTimeout(onClose, 300);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!classNameInput.trim()) {
            return toast.error("Class name is required");
        }
        if (!academicYearId) {
            return toast.error("Academic year association is required");
        }

        onSave({
            className: classNameInput.trim(),
            academicYearId: Number(academicYearId),
            capacity: capacity ? Number(capacity) : null
        });
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ${
                    animateIn ? "opacity-100" : "opacity-0"
                }`}
                onClick={handleClose}
            />

            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
                {/* Slide-over panel */}
                <div
                    className={`w-screen max-w-md bg-white border-l border-light-border shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
                        animateIn ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-light-border flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-light-border text-black">
                                <Pencil size={15} />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-black tracking-tight">Modify Class Parameters</h3>
                                <p className="text-xs text-black/40 font-normal">
                                    Updating Class: {selectedClass.className}
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
                            <span>Updating the class name or academic year will propagate to enrolled student directories automatically.</span>
                        </div>

                        {/* Class Name */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">
                                Class Name
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. 10A, 11-Science, Prep-B"
                                value={classNameInput}
                                onChange={(e) => setClassNameInput(e.target.value)}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white font-semibold"
                            />
                        </div>

                        {/* Academic Year Selection */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">
                                Academic Year
                            </label>
                            <select
                                value={academicYearId}
                                onChange={(e) => setAcademicYearId(e.target.value)}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white font-semibold cursor-pointer"
                            >
                                <option value="">Select Academic Year...</option>
                                {academicYears.map((ay: any) => (
                                    <option key={ay.id} value={ay.id}>
                                        {ay.name} ({ay.status})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Capacity Limit */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">
                                Capacity Limit (Optional)
                            </label>
                            <input
                                type="number"
                                placeholder="e.g. 40"
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white font-semibold"
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
                            <Calendar size={13} />
                            {isPending ? "Saving..." : "Confirm & Save"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
