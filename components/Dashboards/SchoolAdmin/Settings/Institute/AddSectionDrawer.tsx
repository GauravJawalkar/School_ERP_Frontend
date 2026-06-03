"use client";

import React, { useState, useEffect } from "react";
import { X, Layers, Plus } from "lucide-react";
import toast from "react-hot-toast";

interface AddSectionDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (payload: {
        name: string;
        classId: number;
        capacity: number | null;
        roomNumber: string;
        classTeacherId: number | null;
    }) => void;
    isPending: boolean;
    classId: number;
    className: string;
    classCapacity: number | null;
    currentSections: any[];
    staff: any[];
}

export default function AddSectionDrawer({
    isOpen,
    onClose,
    onSave,
    isPending,
    classId,
    className,
    classCapacity,
    currentSections,
    staff
}: AddSectionDrawerProps) {
    const [animateIn, setAnimateIn] = useState(false);

    // Form inputs
    const [name, setName] = useState("A");
    const [capacity, setCapacity] = useState("");
    const [roomNumber, setRoomNumber] = useState("");
    const [classTeacherId, setClassTeacherId] = useState("");

    useEffect(() => {
        if (isOpen) {
            setName("A");
            setCapacity("");
            setRoomNumber("");
            setClassTeacherId("");
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

        if (!name.trim()) {
            return toast.error("Section name is required");
        }

        // Validate capacity constraints
        if (classCapacity && capacity) {
            const currentTotal = currentSections.reduce((acc: number, curr: any) => acc + (curr.capacity || 0), 0);
            const targetTotal = currentTotal + Number(capacity);
            if (targetTotal > classCapacity) {
                return toast.error(
                    `Capacity Limit Exceeded: Total sections capacity (${targetTotal}) will exceed class capacity limit of ${classCapacity} seats.`
                );
            }
        }

        onSave({
            name: name.trim(),
            classId,
            capacity: capacity ? Number(capacity) : null,
            roomNumber: roomNumber.trim(),
            classTeacherId: classTeacherId ? Number(classTeacherId) : null
        });
    };

    // Standard list of sections (A-Z)
    const sectionOptions = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

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
                                <Layers size={15} />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-black tracking-tight">Add Class Section</h3>
                                <p className="text-xs text-black/40 font-normal">Create section partition for Class {className}</p>
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
                        {/* Section Name Select */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">
                                Section Name
                            </label>
                            <select
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white font-semibold cursor-pointer"
                            >
                                {sectionOptions.map((opt) => (
                                    <option key={opt} value={opt}>
                                        Section {opt}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Capacity Limit */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">
                                Capacity Limit
                            </label>
                            <input
                                type="number"
                                placeholder={classCapacity ? `Max available: ${classCapacity - currentSections.reduce((acc, curr) => acc + (curr.capacity || 0), 0)} seats` : "e.g. 30"}
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white font-semibold font-medium"
                            />
                            {classCapacity && (
                                <p className="text-[10px] text-black/45 font-medium">
                                    Class Capacity: {classCapacity} seats • Sections Assigned: {currentSections.reduce((acc, curr) => acc + (curr.capacity || 0), 0)} seats
                                </p>
                            )}
                        </div>

                        {/* Room Number */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">
                                Room Number (Optional)
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Room-102"
                                value={roomNumber}
                                onChange={(e) => setRoomNumber(e.target.value)}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white font-semibold font-medium"
                            />
                        </div>

                        {/* Class Teacher */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">
                                Class Teacher (Optional)
                            </label>
                            <select
                                value={classTeacherId}
                                onChange={(e) => setClassTeacherId(e.target.value)}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white font-semibold cursor-pointer"
                            >
                                <option value="">Select Class Teacher...</option>
                                {staff.map((teacher: any) => (
                                    <option key={teacher.id} value={teacher.id}>
                                        {teacher.firstName} {teacher.lastName} ({teacher.designation})
                                    </option>
                                ))}
                            </select>
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
                            {isPending ? "Adding..." : "Confirm Add"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
