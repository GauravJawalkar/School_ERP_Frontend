"use client";

import React, { useState, useEffect } from "react";
import { X, CheckCircle, ShieldAlert, Award, FileText, UserCheck, ChevronRight, Mail, Phone, Calendar } from "lucide-react";
import toast from "react-hot-toast";

interface AdmissionApplication {
    id: number;
    academicYearId: number;
    academicYearName: string;
    admissionDate: string;
    instituteId: number;
    userId: string | null;
    name: string;
    board: string;
    parentPhoneNo: string;
    applicationStatus: "PENDING" | "APPROVED" | "REJECTED" | "INQUIRY";
    classId: number;
    className: string;
    createdAt: string;
    schoolName?: string;
}

interface ViewApproveAdmissionDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    application: AdmissionApplication | null;
    onApprove: (id: number, payload: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        gender: "MALE" | "FEMALE" | "OTHER";
        DOB: string;
        fatherName: string;
        motherName: string;
        address: string;
    }) => void;
    onStatusChange: (id: number, status: string) => void;
    isApproving: boolean;
    isUpdatingStatus: boolean;
}

export default function ViewApproveAdmissionDrawer({
    isOpen,
    onClose,
    application,
    onApprove,
    onStatusChange,
    isApproving,
    isUpdatingStatus
}: ViewApproveAdmissionDrawerProps) {
    // Student Form Fields
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState<"MALE" | "FEMALE" | "OTHER">("MALE");
    const [dob, setDob] = useState("");

    // Parent Form Fields
    const [fatherName, setFatherName] = useState("");
    const [motherName, setMotherName] = useState("");
    const [address, setAddress] = useState("");

    // Form View Tab (For unapproved admissions)
    const [formTab, setFormTab] = useState<"basic" | "student" | "parent">("basic");

    // Initialize fields when application changes
    useEffect(() => {
        if (isOpen && application) {
            setFormTab("basic");

            // Pre-populate names
            const nameParts = application.name.split(" ");
            setFirstName(nameParts[0] || "");
            setLastName(nameParts.slice(1).join(" ") || "");

            // Pre-populate email using a generic standard format based on name
            const sanitizedName = application.name.toLowerCase().replace(/\s+/g, "");
            setEmail(`${sanitizedName}@school.com`);

            setPhone(application.parentPhoneNo);
            setGender("MALE");
            setDob("");
            setFatherName("");
            setMotherName("");
            setAddress("");
        }
    }, [isOpen, application]);

    if (!isOpen || !application) return null;

    const validateStudentTab = () => {
        if (!firstName.trim() || !lastName.trim()) {
            toast.error("Student First and Last name are required");
            setFormTab("student");
            return false;
        }

        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error("Please enter a valid student email address");
            setFormTab("student");
            return false;
        }

        if (!phone.trim() || phone.length > 10) {
            toast.error("Please enter a valid 10-digit phone number");
            setFormTab("student");
            return false;
        }

        if (!dob) {
            toast.error("Student Date of Birth is required");
            setFormTab("student");
            return false;
        }
        return true;
    };

    const handleApproveSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateStudentTab()) {
            return;
        }

        if (!fatherName.trim()) {
            toast.error("Father's Name is required");
            setFormTab("parent");
            return;
        }

        if (!motherName.trim()) {
            toast.error("Mother's Name is required");
            setFormTab("parent");
            return;
        }

        if (!address.trim()) {
            toast.error("Residential Address is required");
            setFormTab("parent");
            return;
        }

        onApprove(application.id, {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            gender,
            DOB: dob,
            fatherName: fatherName.trim(),
            motherName: motherName.trim(),
            address: address.trim()
        });
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
            <div className="relative w-full max-w-lg h-full bg-white border-l border-light-border shadow-2xl flex flex-col justify-between z-10 animate-slide-in">
                {/* Header */}
                <div className="p-5 border-b border-light-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neutral-50 rounded-lg flex items-center justify-center border border-light-border shrink-0">
                            <FileText size={16} className="text-black" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-black uppercase tracking-wide">
                                Admission Details
                            </h2>
                            <p className="text-xs text-black/50">Application ID: #{application.id} • Registered {formatDate(application.createdAt)}</p>
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

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto slim-scrollbar">
                    {/* Status Top Banner */}
                    <div className={`p-4 border-b text-xs flex items-center justify-between ${application.applicationStatus === "APPROVED"
                            ? "bg-green-50/20 border-green-100/30 text-green-800"
                            : application.applicationStatus === "REJECTED"
                                ? "bg-red-50/20 border-red-100/30 text-red-800"
                                : application.applicationStatus === "INQUIRY"
                                    ? "bg-amber-50/20 border-amber-100/30 text-amber-800"
                                    : "bg-neutral-50 border-light-border text-black/75"
                        }`}>
                        <div className="flex items-center gap-2">
                            <span className="font-bold uppercase tracking-wider">Status:</span>
                            <span className="font-extrabold">{application.applicationStatus}</span>
                        </div>

                        {application.applicationStatus !== "APPROVED" && (
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-black/45 font-bold uppercase mr-1">Switch status:</span>
                                {["PENDING", "INQUIRY", "REJECTED"].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => onStatusChange(application.id, status)}
                                        disabled={isUpdatingStatus}
                                        className={`px-2 py-1 rounded text-[10px] font-bold border transition cursor-pointer ${application.applicationStatus === status
                                                ? "bg-black text-white border-black"
                                                : "bg-white text-black/60 border-light-border hover:bg-neutral-50"
                                            }`}
                                    >
                                        {status === "PENDING" ? "Pending" : status === "INQUIRY" ? "Inquiry" : "Reject"}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {application.applicationStatus === "APPROVED" ? (
                        /* APPROVED VIEW: READ-ONLY DETAILS */
                        <div className="px-6 py-1 space-y-6">
                            <div className="p-4 bg-emerald-50/10 border border-emerald-100 rounded-xl flex items-start gap-3.5">
                                <CheckCircle size={18} className="text-emerald-600 mt-0.5 shrink-0" />
                                <div className="space-y-1">
                                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Approved & Enrolled</span>
                                    <p className="text-[11px] text-black/55 leading-normal">
                                        This student application has been successfully processed. The student profile is active, class fees are assigned, and user login credentials have been sent to the parent phone.
                                    </p>
                                </div>
                            </div>

                            {/* Section: Academic profile */}
                            <div className="space-y-3">
                                <h3 className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Academic Assignment</h3>
                                <div className="grid grid-cols-2 gap-4 border border-light-border rounded-xl p-4 bg-gray-50/10">
                                    <div>
                                        <span className="text-[10px] text-black/45 font-semibold block">Student Name</span>
                                        <span className="text-xs font-bold text-black">{application.name}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-black/45 font-semibold block">Education Board</span>
                                        <span className="text-xs font-bold text-black">{application.board}</span>
                                    </div>
                                    <div className="mt-2.5">
                                        <span className="text-[10px] text-black/45 font-semibold block">Assigned class</span>
                                        <span className="text-xs font-bold text-black">Class {application.className}</span>
                                    </div>
                                    <div className="mt-2.5">
                                        <span className="text-[10px] text-black/45 font-semibold block">Academic Year</span>
                                        <span className="text-xs font-bold text-black">{application.academicYearName}</span>
                                    </div>
                                    {application.schoolName && (
                                        <div className="col-span-2 mt-2.5 border-t border-neutral-100 pt-2.5">
                                            <span className="text-[10px] text-black/45 font-semibold block">Registered School</span>
                                            <span className="text-xs font-bold text-black">{application.schoolName}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Section: Contact */}
                            <div className="space-y-3">
                                <h3 className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Contact Info</h3>
                                <div className="border border-light-border rounded-xl p-4 bg-gray-50/10 space-y-2">
                                    <div className="flex items-center gap-2 text-xs">
                                        <Phone size={13} className="text-black/40" />
                                        <span className="font-medium text-black/75">Parent Contact No: {application.parentPhoneNo}</span>
                                    </div>
                                    {application.userId && (
                                        <div className="flex items-center gap-2 text-xs border-t border-neutral-100 pt-2 mt-2">
                                            <UserCheck size={13} className="text-black/40" />
                                            <span className="font-medium text-black/75">Status: Account Directory Registered</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* PENDING/INQUIRY/REJECTED VIEW: APPROVAL FORM STAGES */
                        <div>
                            {/* Tab Switcher */}
                            <div className="flex border-b border-light-border px-5 bg-gray-50/20">
                                {[
                                    { id: "basic", label: "1. Basic Info" },
                                    { id: "student", label: "2. Student Profile" },
                                    { id: "parent", label: "3. Parent & Address" }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setFormTab(tab.id as any)}
                                        className={`py-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer mr-2 ${formTab === tab.id
                                                ? "border-black text-black"
                                                : "border-transparent text-black/40 hover:text-black/75"
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="p-5">
                                {formTab === "basic" && (
                                    <div className="space-y-5">
                                        <div className="p-4 bg-gray-55/10 border border-light-border rounded-xl space-y-3">
                                            <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest block">Application Summary</span>

                                            <div className="grid grid-cols-2 gap-4 text-xs leading-normal">
                                                <div>
                                                    <span className="text-black/45 font-medium block">Applicant Name</span>
                                                    <span className="font-bold text-black">{application.name}</span>
                                                </div>
                                                <div>
                                                    <span className="text-black/45 font-medium block">Education Board</span>
                                                    <span className="font-bold text-black">{application.board}</span>
                                                </div>
                                                <div className="mt-2">
                                                    <span className="text-black/45 font-medium block">Requested Class</span>
                                                    <span className="font-bold text-black">Class {application.className}</span>
                                                </div>
                                                <div className="mt-2">
                                                    <span className="text-black/45 font-medium block">Academic Year</span>
                                                    <span className="font-bold text-black">{application.academicYearName}</span>
                                                </div>
                                                {application.schoolName && (
                                                    <div className="col-span-2 mt-2 border-t border-neutral-100 pt-2">
                                                        <span className="text-black/45 font-medium block">Registered School</span>
                                                        <span className="font-bold text-black">{application.schoolName}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-4 bg-neutral-900 text-white rounded-xl space-y-3 shadow-md">
                                            <div className="flex items-center gap-2 text-white">
                                                <UserCheck size={16} />
                                                <span className="text-xs font-bold uppercase tracking-wider">Approval Procedure</span>
                                            </div>
                                            <p className="text-[11px] text-white/70 leading-relaxed">
                                                To approve this application, complete the Student & Parent profiles in the tabs above. Upon submission:
                                            </p>
                                            <ul className="text-[11px] text-white/80 space-y-1.5 pl-4 list-disc font-medium">
                                                <li>A student user profile is initialized in the system.</li>
                                                <li>Compulsory fees assigned to class {application.className} are mapped to this student.</li>
                                                <li>Login credentials are automatically generated and dispatched to the parent.</li>
                                            </ul>
                                            <button
                                                type="button"
                                                onClick={() => setFormTab("student")}
                                                className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg border border-white/20 transition cursor-pointer select-none"
                                            >
                                                Start Enrolling <ChevronRight size={10} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {formTab === "student" && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-black/70 uppercase tracking-widest block">
                                                    First Name
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                    className="w-full h-9 px-3 border border-light-border rounded-lg text-xs text-black focus:border-black focus:outline-hidden transition bg-white"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-black/70 uppercase tracking-widest block">
                                                    Last Name
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                    className="w-full h-9 px-3 border border-light-border rounded-lg text-xs text-black focus:border-black focus:outline-hidden transition bg-white"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-black/70 uppercase tracking-widest block">
                                                Student Login Email (Username)
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                placeholder="e.g. liam@school.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full h-9 px-3 border border-light-border rounded-lg text-xs text-black focus:border-black focus:outline-hidden transition bg-white"
                                            />
                                            <span className="text-[10px] text-black/40 block leading-tight">
                                                Used for credentials and primary student account login authentication.
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-black/70 uppercase tracking-widest block">
                                                    Gender
                                                </label>
                                                <select
                                                    value={gender}
                                                    onChange={(e) => setGender(e.target.value as any)}
                                                    className="w-full h-9 px-2 border border-light-border rounded-lg text-xs text-black focus:border-black focus:outline-hidden transition bg-white cursor-pointer"
                                                >
                                                    <option value="MALE">Male</option>
                                                    <option value="FEMALE">Female</option>
                                                    <option value="OTHER">Other</option>
                                                </select>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-black/70 uppercase tracking-widest block">
                                                    Date of Birth
                                                </label>
                                                <input
                                                    type="date"
                                                    required
                                                    value={dob}
                                                    onChange={(e) => setDob(e.target.value)}
                                                    className="w-full h-9 px-3 border border-light-border rounded-lg text-xs text-black focus:border-black focus:outline-hidden transition bg-white cursor-pointer"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-black/70 uppercase tracking-widest block">
                                                Student Contact Phone
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                maxLength={10}
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                                                className="w-full h-9 px-3 border border-light-border rounded-lg text-xs text-black focus:border-black focus:outline-hidden transition bg-white"
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setFormTab("parent")}
                                            className="w-full h-9 border border-black text-black hover:bg-neutral-50 transition rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer select-none"
                                        >
                                            Continue to Parent Details <ChevronRight size={12} />
                                        </button>
                                    </div>
                                )}

                                {formTab === "parent" && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-black/70 uppercase tracking-widest block">
                                                    Father's Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={fatherName}
                                                    onChange={(e) => setFatherName(e.target.value)}
                                                    className="w-full h-9 px-3 border border-light-border rounded-lg text-xs text-black focus:border-black focus:outline-hidden transition bg-white"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-black/70 uppercase tracking-widest block">
                                                    Mother's Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={motherName}
                                                    onChange={(e) => setMotherName(e.target.value)}
                                                    className="w-full h-9 px-3 border border-light-border rounded-lg text-xs text-black focus:border-black focus:outline-hidden transition bg-white"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-black/70 uppercase tracking-widest block">
                                                Residential Address
                                            </label>
                                            <textarea
                                                required
                                                rows={3}
                                                placeholder="Enter full physical address..."
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                className="w-full p-3 border border-light-border rounded-lg text-xs text-black focus:border-black focus:outline-hidden transition bg-white resize-none"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="p-4 border-t border-light-border bg-neutral-50/75 flex flex-row items-center justify-between gap-2.5">
                    <div>
                        {application.applicationStatus !== "APPROVED" && formTab !== "basic" && (
                            <button
                                type="button"
                                onClick={() => {
                                    if (formTab === "student") setFormTab("basic");
                                    if (formTab === "parent") setFormTab("student");
                                }}
                                className="h-9 px-4 rounded-lg border border-light-border text-xs font-semibold hover:border-black hover:bg-neutral-55 transition cursor-pointer text-black"
                            >
                                Back
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isApproving || isUpdatingStatus}
                            className="h-9 px-4 rounded-lg border border-light-border text-xs font-semibold hover:border-black hover:bg-neutral-50 transition cursor-pointer text-black"
                        >
                            Close Panel
                        </button>
                        {application.applicationStatus !== "APPROVED" && (
                            formTab === "basic" ? (
                                <button
                                    type="button"
                                    onClick={() => setFormTab("student")}
                                    className="h-9 px-5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-black/90 transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                                >
                                    Continue to Profile
                                    <ChevronRight size={13} />
                                </button>
                            ) : formTab === "student" ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (validateStudentTab()) {
                                            setFormTab("parent");
                                        }
                                    }}
                                    className="h-9 px-5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-black/90 transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                                >
                                    Continue to Parent
                                    <ChevronRight size={13} />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleApproveSubmit}
                                    disabled={isApproving || isUpdatingStatus}
                                    className="h-9 px-5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-black/90 transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                                >
                                    <UserCheck size={13} />
                                    {isApproving ? "Enrolling Student..." : "Approve & Register"}
                                </button>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
