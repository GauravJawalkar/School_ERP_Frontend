"use client";

import React, { useState, useEffect } from "react";
import { X, Coins, Plus } from "lucide-react";
import toast from "react-hot-toast";

interface MapClassFeeDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (payload: {
        academicYearId: number;
        classId: number;
        feeHeadId: number;
        amount: string;
        frequency: string;
        isCompulsory: boolean;
        dueDay: number;
    }) => void;
    isPending: boolean;
    academicYears: any[];
    classes: any[];
    feeHeads: any[];
    onCreateFeeHeadClick: () => void;
}

export default function MapClassFeeDrawer({
    isOpen,
    onClose,
    onSave,
    isPending,
    academicYears,
    classes,
    feeHeads,
    onCreateFeeHeadClick
}: MapClassFeeDrawerProps) {
    const [animateIn, setAnimateIn] = useState(false);

    // Form inputs
    const [academicYearId, setAcademicYearId] = useState("");
    const [classId, setClassId] = useState("");
    const [feeHeadId, setFeeHeadId] = useState("");
    const [amount, setAmount] = useState("");
    const [frequency, setFrequency] = useState("MONTHLY");
    const [isCompulsory, setIsCompulsory] = useState(true);
    const [dueDay, setDueDay] = useState("");

    useEffect(() => {
        if (isOpen) {
            setAcademicYearId("");
            setClassId("");
            setFeeHeadId("");
            setAmount("");
            setFrequency("MONTHLY");
            setIsCompulsory(true);
            setDueDay("");
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

        if (!academicYearId) return toast.error("Academic Year is required");
        if (!classId) return toast.error("Target Class is required");
        if (!feeHeadId) return toast.error("Fee Category is required");
        if (!amount || Number(amount) <= 0) return toast.error("Amount must be greater than 0");
        if (!dueDay || Number(dueDay) < 1 || Number(dueDay) > 31) return toast.error("Due day must be between 1 and 31");

        onSave({
            academicYearId: Number(academicYearId),
            classId: Number(classId),
            feeHeadId: Number(feeHeadId),
            amount: String(amount),
            frequency,
            isCompulsory,
            dueDay: Number(dueDay)
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
                    className={`w-screen max-w-lg bg-white border-l border-light-border shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
                        animateIn ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-light-border flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-light-border text-black">
                                <Coins size={15} />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-black tracking-tight">Map Class Fee Structure</h3>
                                <p className="text-xs text-black/40 font-normal">Associate billing components with a classroom level</p>
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
                        {/* Target Academic Year */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">
                                Target Academic Year
                            </label>
                            <select
                                value={academicYearId}
                                onChange={(e) => setAcademicYearId(e.target.value)}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white font-semibold"
                            >
                                <option value="">Select Academic Year...</option>
                                {academicYears.map((ay: any) => (
                                    <option key={ay.id} value={ay.id}>
                                        {ay.name} ({ay.status})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Target Class Level */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">
                                Target Class Level
                            </label>
                            <select
                                value={classId}
                                onChange={(e) => setClassId(e.target.value)}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white font-semibold"
                            >
                                <option value="">Select Class...</option>
                                {classes.map((cls: any) => (
                                    <option key={cls.id} value={cls.id}>
                                        Class {cls.className}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Fee Category Component */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">
                                    Fee Category Component
                                </label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onCreateFeeHeadClick();
                                    }}
                                    className="text-[11px] text-black hover:underline font-bold inline-flex items-center gap-0.5 cursor-pointer"
                                >
                                    + Create Category
                                </button>
                            </div>
                            <select
                                value={feeHeadId}
                                onChange={(e) => setFeeHeadId(e.target.value)}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white font-semibold"
                            >
                                <option value="">Select Category...</option>
                                {feeHeads.map((fh: any) => (
                                    <option key={fh.id} value={fh.id}>
                                        {fh.feeName} ({fh.feeType})
                                    </option>
                                ))}
                            </select>
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
                                <label className="flex items-start gap-3 cursor-pointer p-2.5 border border-light-border rounded-lg bg-gray-50/30 hover:bg-gray-50/60 transition h-10 items-center select-none font-semibold">
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
                            <Plus size={13} />
                            {isPending ? "Mapping..." : "Confirm Map"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
