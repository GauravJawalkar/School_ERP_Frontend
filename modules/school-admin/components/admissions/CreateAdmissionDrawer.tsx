"use client";

import React, { useState, useEffect } from "react";
import { X, UserPlus, FileText } from "lucide-react";
import toast from "react-hot-toast";

interface AcademicYear {
    id: number;
    name: string;
    isActive: boolean;
}

interface CampusClass {
    id: number;
    className: string;
    academicYearId: number;
}

interface CreateAdmissionDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (payload: {
        academicYearId: number;
        admissionDate: string;
        name: string;
        board: string;
        parentPhoneNo: string;
        applicationStatus: string;
        classId: number;
        instituteId?: number;
    }) => void;
    isPending: boolean;
    academicYears: AcademicYear[];
    classes: CampusClass[];
    selectedInstituteId?: number;
}

export default function CreateAdmissionDrawer({
    isOpen,
    onClose,
    onSave,
    isPending,
    academicYears = [],
    classes = [],
    selectedInstituteId
}: CreateAdmissionDrawerProps) {
    const [name, setName] = useState("");
    const [board, setBoard] = useState("CBSE");
    const [parentPhoneNo, setParentPhoneNo] = useState("");
    const [classId, setClassId] = useState<number | "">("");
    const [academicYearId, setAcademicYearId] = useState<number | "">("");
    const [applicationStatus, setApplicationStatus] = useState("PENDING");
    const [admissionDate, setAdmissionDate] = useState("");

    // Initialize with active academic year and current date
    useEffect(() => {
        if (isOpen) {
            setName("");
            setBoard("CBSE");
            setParentPhoneNo("");
            setClassId("");
            setApplicationStatus("PENDING");
            
            // Set today's date in YYYY-MM-DD format
            const today = new Date().toISOString().split("T")[0];
            setAdmissionDate(today);

            // Default to active academic year
            const activeYear = academicYears.find((ay) => ay.isActive);
            if (activeYear) {
                setAcademicYearId(activeYear.id);
            } else if (academicYears.length > 0) {
                setAcademicYearId(academicYears[0].id);
            } else {
                setAcademicYearId("");
            }
        }
    }, [isOpen, academicYears]);

    // Filter classes based on selected academic year
    const filteredClasses = classes.filter(
        (cls) => !academicYearId || cls.academicYearId === Number(academicYearId)
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Applicant Name is required");
            return;
        }

        if (!board.trim()) {
            toast.error("Board is required");
            return;
        }

        if (!parentPhoneNo.trim()) {
            toast.error("Parent Phone Number is required");
            return;
        }

        if (parentPhoneNo.trim().length > 10) {
            toast.error("Phone number cannot be more than 10 digits");
            return;
        }

        if (!classId) {
            toast.error("Please select a target class");
            return;
        }

        if (!academicYearId) {
            toast.error("Please select an academic year");
            return;
        }

        if (!admissionDate) {
            toast.error("Admission Date is required");
            return;
        }

        onSave({
            academicYearId: Number(academicYearId),
            admissionDate,
            name: name.trim(),
            board: board.trim(),
            parentPhoneNo: parentPhoneNo.trim(),
            applicationStatus,
            classId: Number(classId),
            ...(selectedInstituteId ? { instituteId: selectedInstituteId } : {})
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
                            <UserPlus size={16} className="text-black" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-black uppercase tracking-wide">
                                Add Admission Application
                            </h2>
                            <p className="text-xs text-black/50">Register a new applicant request for evaluation.</p>
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
                    {/* Applicant Name */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-black/70 uppercase tracking-widest block">
                            Applicant Full Name
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Liam Johnson"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full h-9 px-3 border border-light-border rounded-lg text-xs text-black placeholder-black/30 focus:border-black focus:outline-hidden transition bg-white"
                        />
                    </div>

                    {/* Academic Session & Class Group */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-black/70 uppercase tracking-widest block">
                                Academic Year
                            </label>
                            <select
                                value={academicYearId}
                                onChange={(e) => {
                                    setAcademicYearId(e.target.value ? Number(e.target.value) : "");
                                    setClassId(""); // Reset class selection
                                }}
                                className="w-full h-9 px-2 border border-light-border rounded-lg text-xs text-black focus:border-black focus:outline-hidden transition bg-white cursor-pointer"
                            >
                                <option value="">Select Session</option>
                                {academicYears.map((ay) => (
                                    <option key={ay.id} value={ay.id}>
                                        {ay.name} {ay.isActive ? "(Active)" : ""}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-black/70 uppercase tracking-widest block">
                                Target Class
                            </label>
                            <select
                                value={classId}
                                onChange={(e) => setClassId(e.target.value ? Number(e.target.value) : "")}
                                className="w-full h-9 px-2 border border-light-border rounded-lg text-xs text-black focus:border-black focus:outline-hidden transition bg-white cursor-pointer"
                                disabled={!academicYearId}
                            >
                                <option value="">Select Class</option>
                                {filteredClasses.map((cls) => (
                                    <option key={cls.id} value={cls.id}>
                                        Class {cls.className}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Education Board & parent Phone */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-black/70 uppercase tracking-widest block">
                                Education Board
                            </label>
                            <select
                                value={board}
                                onChange={(e) => setBoard(e.target.value)}
                                className="w-full h-9 px-2 border border-light-border rounded-lg text-xs text-black focus:border-black focus:outline-hidden transition bg-white cursor-pointer"
                            >
                                <option value="CBSE">CBSE Board</option>
                                <option value="ICSE">ICSE Board</option>
                                <option value="STATE">State Board</option>
                                <option value="IB">IB Board</option>
                                <option value="IGCSE">IGCSE Board</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-black/70 uppercase tracking-widest block">
                                Parent Phone Number
                            </label>
                            <input
                                type="text"
                                required
                                maxLength={10}
                                placeholder="10-digit phone number"
                                value={parentPhoneNo}
                                onChange={(e) => setParentPhoneNo(e.target.value.replace(/\D/g, ""))}
                                className="w-full h-9 px-3 border border-light-border rounded-lg text-xs text-black placeholder-black/30 focus:border-black focus:outline-hidden transition bg-white"
                            />
                        </div>
                    </div>

                    {/* Application Status & Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-black/70 uppercase tracking-widest block">
                                Initial Status
                            </label>
                            <select
                                value={applicationStatus}
                                onChange={(e) => setApplicationStatus(e.target.value)}
                                className="w-full h-9 px-2 border border-light-border rounded-lg text-xs text-black focus:border-black focus:outline-hidden transition bg-white cursor-pointer"
                            >
                                <option value="PENDING">Pending Evaluation</option>
                                <option value="INQUIRY">Inquiry/Lead</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-black/70 uppercase tracking-widest block">
                                Admission Date
                            </label>
                            <input
                                type="date"
                                required
                                value={admissionDate}
                                onChange={(e) => setAdmissionDate(e.target.value)}
                                className="w-full h-9 px-3 border border-light-border rounded-lg text-xs text-black focus:border-black focus:outline-hidden transition bg-white cursor-pointer"
                            />
                        </div>
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
                        <FileText size={13} />
                        {isPending ? "Submitting..." : "Submit Application"}
                    </button>
                </div>
            </div>
        </div>
    );
}
