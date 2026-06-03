"use client";

import React, { useState, useEffect } from "react";
import { X, Pencil, Info, Calendar } from "lucide-react";
import toast from "react-hot-toast";

interface SectionDetails {
    id: number;
    name: string;
    capacity: number | null;
    roomNumber: string | null;
    classTeacherId: number | null;
}

interface EditSectionDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (payload: {
        name: string;
        capacity: number | null;
        roomNumber: string;
        classTeacherId: number | null;
    }) => void;
    isPending: boolean;
    selectedSection: SectionDetails | null;
    className: string;
    classCapacity: number | null;
    currentSections: any[];
    staff: any[];
}

export default function EditSectionDrawer({
    isOpen,
    onClose,
    onSave,
    isPending,
    selectedSection,
    className,
    classCapacity,
    currentSections,
    staff
}: EditSectionDrawerProps) {
    const [animateIn, setAnimateIn] = useState(false);

    // Form inputs
    const [name, setName] = useState("A");
    const [capacity, setCapacity] = useState("");
    const [roomNumber, setRoomNumber] = useState("");
    const [classTeacherId, setClassTeacherId] = useState("");

    useEffect(() => {
        if (isOpen && selectedSection) {
            setName(selectedSection.name);
            setCapacity(selectedSection.capacity !== null ? String(selectedSection.capacity) : "");
            setRoomNumber(selectedSection.roomNumber || "");
            setClassTeacherId(selectedSection.classTeacherId ? String(selectedSection.classTeacherId) : "");

            const timer = setTimeout(() => setAnimateIn(true), 50);
            return () => clearTimeout(timer);
        } else {
            setAnimateIn(false);
        }
    }, [isOpen, selectedSection]);

    if (!isOpen || !selectedSection) return null;

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
            const currentTotal = currentSections.reduce(
                (acc: number, curr: any) => acc + (curr.id === selectedSection.id ? 0 : (curr.capacity || 0)),
                0
            );
            const targetTotal = currentTotal + Number(capacity);
            if (targetTotal > classCapacity) {
                return toast.error(
                    `Capacity Limit Exceeded: Total sections capacity (${targetTotal}) will exceed class capacity limit of ${classCapacity} seats.`
                );
            }
        }

        onSave({
            name: name.trim(),
            capacity: capacity ? Number(capacity) : null,
            roomNumber: roomNumber.trim(),
            classTeacherId: classTeacherId ? Number(classTeacherId) : null
        });
    };

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
                                <Pencil size={15} />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-black tracking-tight">Modify Class Section</h3>
                                <p className="text-xs text-black/40 font-normal">
                                    Updating Section {selectedSection.name} for Class {className}
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
                            <span>Updating section parameters propagates automatically to linked class timetables and student profiles.</span>
                        </div>

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
                                placeholder="e.g. 30"
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white font-semibold"
                            />
                            {classCapacity && (
                                <p className="text-[10px] text-black/45 font-medium">
                                    Class Capacity: {classCapacity} seats • Other Sections: {currentSections.reduce((acc, curr) => acc + (curr.id === selectedSection.id ? 0 : (curr.capacity || 0)), 0)} seats
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
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white font-semibold"
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
                            <Calendar size={13} />
                            {isPending ? "Saving..." : "Confirm & Save"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
