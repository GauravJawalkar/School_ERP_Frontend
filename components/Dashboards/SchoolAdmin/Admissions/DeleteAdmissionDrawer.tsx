"use client";

import React, { useState, useEffect } from "react";
import { X, Trash2, ShieldAlert, Archive, AlertOctagon, Lock } from "lucide-react";

interface AdmissionApplication {
    id: number;
    name: string;
    className: string;
    academicYearName: string;
    admissionDate: string;
    schoolName?: string;
}

interface DeleteAdmissionDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    application: AdmissionApplication | null;
    onConfirm: (id: number, deleteType: "soft" | "hard") => void;
    isPending: boolean;
    canHardDelete: boolean;
}

export default function DeleteAdmissionDrawer({
    isOpen,
    onClose,
    application,
    onConfirm,
    isPending,
    canHardDelete
}: DeleteAdmissionDrawerProps) {
    const [deleteType, setDeleteType] = useState<"soft" | "hard">("soft");

    // Reset state when drawer opens/closes
    useEffect(() => {
        if (isOpen) {
            setDeleteType("soft");
        }
    }, [isOpen]);

    if (!isOpen || !application) return null;

    const handleConfirmClick = () => {
        onConfirm(application.id, deleteType);
    };

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
            });
        } catch {
            return dateStr;
        }
    };

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
                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center border border-red-100 shrink-0">
                            <ShieldAlert size={18} className="text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-black uppercase tracking-wide">
                                Delete Application
                            </h2>
                            <p className="text-xs text-black/50">Determine deletion level and confirm.</p>
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

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Warnings */}
                    {deleteType === "soft" ? (
                        <div className="p-4 bg-amber-50/50 border border-amber-200/50 rounded-xl space-y-2">
                            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block">Soft Delete (Archive)</span>
                            <p className="text-xs text-black/75 leading-relaxed font-medium">
                                The admission record for <strong className="text-black font-extrabold">{application.name}</strong> will be archived and hidden. It can be restored later if needed.
                            </p>
                        </div>
                    ) : (
                        <div className="p-4 bg-red-50/40 border border-red-200/50 rounded-xl space-y-2">
                            <span className="text-[10px] font-bold text-red-800 uppercase tracking-widest block">Permanent Delete (Destructive)</span>
                            <p className="text-xs text-black/75 leading-relaxed font-medium">
                                WARNING: The admission record for <strong className="text-black font-extrabold">{application.name}</strong> will be permanently deleted from the database. <strong>This action cannot be undone.</strong>
                            </p>
                        </div>
                    )}

                    {/* Selector Options */}
                    <div className="space-y-3">
                        <span className="text-[10px] font-bold text-black/45 uppercase tracking-widest block">Select Deletion Type</span>
                        <div className="grid grid-cols-1 gap-3">
                            {/* Option 1: Soft Delete */}
                            <label
                                className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition select-none ${
                                    deleteType === "soft"
                                        ? "border-black bg-neutral-50/50 shadow-xs"
                                        : "border-light-border hover:border-black/45 bg-white"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="deleteType"
                                    checked={deleteType === "soft"}
                                    onChange={() => setDeleteType("soft")}
                                    className="sr-only"
                                />
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                                    deleteType === "soft" ? "border-black" : "border-input-border"
                                }`}>
                                    {deleteType === "soft" && <div className="w-2 h-2 rounded-full bg-black" />}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 font-bold text-xs text-black">
                                        <Archive size={13} className="text-black/65" />
                                        Archive Application (Soft Delete)
                                    </div>
                                    <p className="text-[11px] text-black/45 leading-relaxed">
                                        Hide this entry from lists and table searches. The application will be kept as archived status in records.
                                    </p>
                                </div>
                            </label>

                            {/* Option 2: Hard Delete */}
                            <label
                                className={`flex items-start gap-3 p-4 border rounded-xl transition select-none ${
                                    !canHardDelete
                                        ? "opacity-50 border-light-border bg-neutral-50/20 cursor-not-allowed"
                                        : deleteType === "hard"
                                        ? "border-red-600 bg-red-50/5 shadow-xs cursor-pointer"
                                        : "border-light-border hover:border-red-500/50 bg-white cursor-pointer"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="deleteType"
                                    disabled={!canHardDelete}
                                    checked={deleteType === "hard"}
                                    onChange={() => setDeleteType("hard")}
                                    className="sr-only"
                                />
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                                    deleteType === "hard" ? "border-red-600" : "border-input-border"
                                }`}>
                                    {deleteType === "hard" && <div className="w-2 h-2 rounded-full bg-red-600" />}
                                </div>
                                <div className="space-y-1 flex-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 font-bold text-xs text-black">
                                            <AlertOctagon size={13} className={deleteType === "hard" ? "text-red-600" : "text-black/65"} />
                                            Permanently Delete (Hard Delete)
                                        </div>
                                        {!canHardDelete && (
                                            <span className="flex items-center gap-1 text-[9px] font-bold text-black/40 uppercase bg-neutral-100 px-1.5 py-0.5 rounded-sm">
                                                <Lock size={9} /> Admin Only
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-black/45 leading-relaxed">
                                        Wipe the registration record completely. Recommended only for mock records or strict data compliance requests.
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Record details */}
                    <div className="space-y-3">
                        <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest block">Application Summary</span>
                        <div className="border border-light-border rounded-xl p-4 bg-neutral-50/35 space-y-3 text-xs leading-normal">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-black/45 block">Applicant Name</span>
                                    <span className="font-bold text-black">{application.name}</span>
                                </div>
                                <div>
                                    <span className="text-black/45 block">Target Class</span>
                                    <span className="font-bold text-black">Class {application.className}</span>
                                </div>
                                <div className="mt-2">
                                    <span className="text-black/45 block">Academic Year</span>
                                    <span className="font-bold text-black">{application.academicYearName}</span>
                                </div>
                                <div className="mt-2">
                                    <span className="text-black/45 block">Registered Date</span>
                                    <span className="font-bold text-black">{formatDate(application.admissionDate)}</span>
                                </div>
                                {application.schoolName && (
                                    <div className="col-span-2 mt-2 border-t border-neutral-100 pt-2">
                                        <span className="text-black/45 block">Registered School</span>
                                        <span className="font-bold text-black">{application.schoolName}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

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
                        type="button"
                        onClick={handleConfirmClick}
                        disabled={isPending}
                        className={`h-9 px-5 rounded-lg text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-xs ${
                            deleteType === "hard"
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-black hover:bg-black/90"
                        }`}
                    >
                        <Trash2 size={13} />
                        {isPending
                            ? deleteType === "hard" ? "Deleting..." : "Archiving..."
                            : deleteType === "hard" ? "Yes, Permanently Delete" : "Yes, Archive Application"}
                    </button>
                </div>
            </div>
        </div>
    );
}
