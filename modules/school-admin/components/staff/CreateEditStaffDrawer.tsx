"use client";

import React, { useEffect, useState } from "react";
import { X, Save, User, Award, Landmark, ChevronRight, ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";

interface StaffData {
    id?: number;
    userId?: string;
    employeeCode: string;
    firstName: string;
    lastName: string;
    designation: string;
    department: string;
    joiningDate: string;
    salaryBasic: string | number;
    bankDetails?: {
        bankName: string;
        bankAccHolderName: string;
        bankAccNo: string;
        bankIFSC: string;
        bankBranchName: string;
        bankAccType: string;
        upiId: string;
    };
    email: string;
    phone: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    isActive: boolean;
    roleName: string;
}

interface CreateEditStaffDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    isSubmitting: boolean;
    staff: StaffData | null;
    roles: any[];
}

type FormStep = "PROFILE" | "PLACEMENT" | "BANKING";

interface FormState {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    password?: string;
    isActive: boolean;
    employeeCode: string;
    roleName: string;
    designation: string;
    department: string;
    joiningDate: string;
    salaryBasic: number;
    bankName: string;
    bankAccHolderName: string;
    bankAccNo: string;
    bankIFSC: string;
    bankBranchName: string;
    bankAccType: string;
    upiId: string;
}

const getInitialFormState = (staff: StaffData | null): FormState => {
    if (staff) {
        const bank = staff.bankDetails || {
            bankName: "",
            bankAccHolderName: "",
            bankAccNo: "",
            bankIFSC: "",
            bankBranchName: "",
            bankAccType: "SAVINGS",
            upiId: ""
        };
        return {
            firstName: staff.firstName || "",
            lastName: staff.lastName || "",
            email: staff.email || "",
            phone: staff.phone || "",
            gender: staff.gender || "MALE",
            password: "",
            isActive: staff.isActive !== false,
            employeeCode: staff.employeeCode || "",
            roleName: staff.roleName || "",
            designation: staff.designation || "",
            department: staff.department || "",
            joiningDate: staff.joiningDate ? new Date(staff.joiningDate).toISOString().split("T")[0] : "",
            salaryBasic: Number(staff.salaryBasic) || 0,
            bankName: bank.bankName || "",
            bankAccHolderName: bank.bankAccHolderName || "",
            bankAccNo: bank.bankAccNo || "",
            bankIFSC: bank.bankIFSC || "",
            bankBranchName: bank.bankBranchName || "",
            bankAccType: bank.bankAccType || "SAVINGS",
            upiId: bank.upiId || "",
        };
    }
    return {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "MALE",
        password: "",
        isActive: true,
        employeeCode: "",
        roleName: "",
        designation: "",
        department: "",
        joiningDate: new Date().toISOString().split("T")[0],
        salaryBasic: 0,
        bankName: "",
        bankAccHolderName: "",
        bankAccNo: "",
        bankIFSC: "",
        bankBranchName: "",
        bankAccType: "SAVINGS",
        upiId: "",
    };
};

export default function CreateEditStaffDrawer({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting,
    staff,
    roles = []
}: CreateEditStaffDrawerProps) {
    const isEditMode = !!staff;

    // Wizard navigation state
    const [activeStep, setActiveStep] = useState<FormStep>("PROFILE");

    // Unified Form State
    const [formData, setFormData] = useState<FormState>(() => getInitialFormState(staff));

    // Reset or Prefill Form when drawer opens/changes
    useEffect(() => {
        if (isOpen) {
            setActiveStep("PROFILE");
            setFormData(getInitialFormState(staff));
        }
    }, [staff, isOpen]);

    if (!isOpen) return null;

    const handleChange = (field: keyof FormState, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Validate current step before advancing
    const handleNext = () => {
        if (activeStep === "PROFILE") {
            if (!formData.firstName.trim() || !formData.lastName.trim()) {
                toast.error("First name and last name are required");
                return;
            }
            if (!formData.email.trim()) {
                toast.error("Valid email address is required");
                return;
            }
            if (!formData.phone.trim() || formData.phone.trim().length !== 10) {
                toast.error("10-digit phone number is required");
                return;
            }
            if (!isEditMode && !formData.password?.trim()) {
                toast.error("Security password is required for new accounts");
                return;
            }
            setActiveStep("PLACEMENT");
        } else if (activeStep === "PLACEMENT") {
            if (!formData.employeeCode.trim()) {
                toast.error("Employee registration code is required");
                return;
            }
            if (!formData.roleName) {
                toast.error("Access role assignment is required");
                return;
            }
            if (!formData.designation.trim()) {
                toast.error("Job title/designation is required");
                return;
            }
            if (!formData.joiningDate) {
                toast.error("Joining date is required");
                return;
            }
            setActiveStep("BANKING");
        }
    };

    const handleBack = () => {
        if (activeStep === "PLACEMENT") {
            setActiveStep("PROFILE");
        } else if (activeStep === "BANKING") {
            setActiveStep("PLACEMENT");
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.salaryBasic < 0) {
            toast.error("Monthly salary basic cannot be negative");
            return;
        }

        const payload: any = {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            gender: formData.gender,
            isActive: formData.isActive,
            employeeCode: formData.employeeCode.trim(),
            roleName: formData.roleName,
            designation: formData.designation.trim(),
            department: formData.department.trim(),
            joiningDate: formData.joiningDate,
            salaryBasic: formData.salaryBasic,
            bankName: formData.bankName.trim(),
            bankAccHolderName: formData.bankAccHolderName.trim(),
            bankAccNo: formData.bankAccNo.trim(),
            bankIFSC: formData.bankIFSC.trim(),
            bankBranchName: formData.bankBranchName.trim(),
            bankAccType: formData.bankAccType,
            upiId: formData.upiId.trim()
        };

        if (formData.password?.trim()) {
            payload.password = formData.password.trim();
        }

        onSubmit(payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Overlay backdrop */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-xs transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Content panel */}
            <div className="relative w-full max-w-md h-full bg-white border-l border-light-border shadow-2xl flex flex-col justify-between z-10 animate-slide-in">
                {/* Header */}
                <div className="p-5 border-b border-light-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neutral-900 text-white rounded-lg flex items-center justify-center shrink-0">
                            {activeStep === "PROFILE" && <User size={18} />}
                            {activeStep === "PLACEMENT" && <Award size={18} />}
                            {activeStep === "BANKING" && <Landmark size={18} />}
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-black uppercase tracking-wider">
                                {isEditMode ? "Modify Staff Profile" : "Register Staff Member"}
                            </h2>
                            <p className="text-xs text-black/55 mt-0.5">
                                {activeStep === "PROFILE" && "Step 1: Security credentials and contact details"}
                                {activeStep === "PLACEMENT" && "Step 2: Department, roles, and job title"}
                                {activeStep === "BANKING" && "Step 3: Payroll compensation and bank deposits"}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-full border border-light-border hover:border-black/70 flex items-center justify-center text-black/50 hover:text-black transition cursor-pointer"
                    >
                        <X size={14} />
                    </button>
                </div>

                {/* Progress Indicators */}
                <div className="px-5 py-2.5 bg-gray-50/50 border-b border-light-border flex items-center gap-2 text-[10px] font-bold text-black/45 tracking-wider uppercase">
                    <span className={activeStep === "PROFILE" ? "text-black" : "text-black/30"}>1. Profile</span>
                    <ChevronRight size={10} className="text-black/25" />
                    <span className={activeStep === "PLACEMENT" ? "text-black" : "text-black/30"}>2. Job Info</span>
                    <ChevronRight size={10} className="text-black/25" />
                    <span className={activeStep === "BANKING" ? "text-black" : "text-black/30"}>3. Banking</span>
                </div>

                {/* Scrollable form sections */}
                <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 slim-scrollbar">

                    {/* STEP 1: Profile & Credentials */}
                    {activeStep === "PROFILE" && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-black uppercase tracking-wider block">First Name*</label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => handleChange("firstName", e.target.value)}
                                        placeholder="e.g. John"
                                        className="w-full border border-input-border text-xs px-3 py-2 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white font-medium"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-black uppercase tracking-wider block">Last Name*</label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => handleChange("lastName", e.target.value)}
                                        placeholder="e.g. Doe"
                                        className="w-full border border-input-border text-xs px-3 py-2 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-black uppercase tracking-wider block">Email Address*</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    placeholder="johndoe@school.edu"
                                    className="w-full border border-input-border text-xs px-3 py-2 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white font-medium"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-black uppercase tracking-wider block">Phone Number*</label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => handleChange("phone", e.target.value)}
                                    placeholder="10-digit mobile number"
                                    className="w-full border border-input-border text-xs px-3 py-2 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white font-medium"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-black uppercase tracking-wider block">Gender*</label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => handleChange("gender", e.target.value as any)}
                                    className="w-full border border-input-border text-xs px-3 py-2 outline-none rounded-lg focus:ring-2 focus:ring-black/10 bg-white cursor-pointer font-medium"
                                >
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-black uppercase tracking-wider block">
                                    {isEditMode ? "New Password (Leave blank to keep current)" : "ERP Security Password*"}
                                </label>
                                <input
                                    type="password"
                                    value={formData.password || ""}
                                    onChange={(e) => handleChange("password", e.target.value)}
                                    placeholder="Minimum 6 characters"
                                    className="w-full border border-input-border text-xs px-3 py-2 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white font-medium"
                                />
                            </div>

                            <div className="flex items-center justify-between p-3 border border-light-border bg-gray-50/30 rounded-xl mt-4">
                                <div>
                                    <span className="text-[11px] font-bold text-black block">Active Access Status</span>
                                    <span className="text-[10px] text-black/50 mt-0.5 block">Enable or disable login access to the ERP.</span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => handleChange("isActive", e.target.checked)}
                                    className="w-4 h-4 text-black border-input-border rounded-md cursor-pointer accent-black"
                                />
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Placement Details */}
                    {activeStep === "PLACEMENT" && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-black uppercase tracking-wider block">Employee Registry Code*</label>
                                <input
                                    type="text"
                                    value={formData.employeeCode}
                                    onChange={(e) => handleChange("employeeCode", e.target.value)}
                                    placeholder="e.g. EMP-2026-004"
                                    className="w-full border border-input-border text-xs px-3 py-2 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white font-medium"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-black uppercase tracking-wider block">Access Role Assignment*</label>
                                <select
                                    value={formData.roleName}
                                    onChange={(e) => handleChange("roleName", e.target.value)}
                                    className="w-full border border-input-border text-xs px-3 py-2 outline-none rounded-lg focus:ring-2 focus:ring-black/10 bg-white cursor-pointer font-medium"
                                >
                                    <option value="">Choose organizational role</option>
                                    {roles
                                        .filter((r) => r.name !== "SUPER_ADMIN")
                                        .map((r) => (
                                            <option key={r.id} value={r.name}>
                                                {r.name.replace(/_/g, " ")}
                                            </option>
                                        ))}
                                    {/* Fallback standard system roles if query fails */}
                                    {roles.length === 0 && (
                                        <>
                                            <option value="TEACHER">TEACHER</option>
                                            <option value="ACCOUNTANT">ACCOUNTANT</option>
                                            <option value="LIBRARIAN">LIBRARIAN</option>
                                            <option value="CLERK">CLERK</option>
                                            <option value="RECEPTIONIST">RECEPTIONIST</option>
                                        </>
                                    )}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-black uppercase tracking-wider block">Designation / Title*</label>
                                <input
                                    type="text"
                                    value={formData.designation}
                                    onChange={(e) => handleChange("designation", e.target.value)}
                                    placeholder="e.g. Senior Accountant, Science HOD"
                                    className="w-full border border-input-border text-xs px-3 py-2 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white font-medium"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-black uppercase tracking-wider block">Department Placement</label>
                                <input
                                    type="text"
                                    value={formData.department}
                                    onChange={(e) => handleChange("department", e.target.value)}
                                    placeholder="e.g. Finance, Administration, Academics"
                                    className="w-full border border-input-border text-xs px-3 py-2 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white font-medium"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-black uppercase tracking-wider block">Official Joining Date*</label>
                                <input
                                    type="date"
                                    value={formData.joiningDate}
                                    onChange={(e) => handleChange("joiningDate", e.target.value)}
                                    className="w-full border border-input-border text-xs px-3 py-2 outline-none rounded-lg focus:ring-2 focus:ring-black/10 bg-white cursor-pointer font-medium"
                                />
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Banking & Payroll Details */}
                    {activeStep === "BANKING" && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-black uppercase tracking-wider block">Monthly Basic Salary (INR)*</label>
                                <input
                                    type="number"
                                    value={formData.salaryBasic || ""}
                                    onChange={(e) => handleChange("salaryBasic", parseFloat(e.target.value) || 0)}
                                    placeholder="e.g. 45000"
                                    className="w-full border border-input-border text-xs px-3 py-2 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white font-medium"
                                />
                            </div>

                            <div className="border-t border-dashed border-light-border pt-4 mt-2 space-y-4">
                                <span className="text-[11px] font-bold text-black uppercase tracking-wider block">Bank Transfer Credentials</span>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-black/60 uppercase tracking-wider block">Bank Name</label>
                                    <input
                                        type="text"
                                        value={formData.bankName}
                                        onChange={(e) => handleChange("bankName", e.target.value)}
                                        placeholder="e.g. State Bank of India"
                                        className="w-full border border-input-border text-xs px-3 py-2 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white font-medium"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-black/60 uppercase tracking-wider block">Account Holder Name</label>
                                    <input
                                        type="text"
                                        value={formData.bankAccHolderName}
                                        onChange={(e) => handleChange("bankAccHolderName", e.target.value)}
                                        placeholder="Name matching passbook"
                                        className="w-full border border-input-border text-xs px-3 py-2 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white font-medium"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-black/60 uppercase tracking-wider block">Account Number</label>
                                    <input
                                        type="text"
                                        value={formData.bankAccNo}
                                        onChange={(e) => handleChange("bankAccNo", e.target.value)}
                                        placeholder="Direct bank account digits"
                                        className="w-full border border-input-border text-xs px-3 py-2 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white font-medium"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-black/60 uppercase tracking-wider block">IFSC Code</label>
                                        <input
                                            type="text"
                                            value={formData.bankIFSC}
                                            onChange={(e) => handleChange("bankIFSC", e.target.value.toUpperCase())}
                                            placeholder="SBIN0001234"
                                            className="w-full border border-input-border text-xs px-3 py-2 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white font-medium"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-black/60 uppercase tracking-wider block">Account Type</label>
                                        <select
                                            value={formData.bankAccType}
                                            onChange={(e) => handleChange("bankAccType", e.target.value)}
                                            className="w-full border border-input-border text-xs px-3 py-2 outline-none rounded-lg focus:ring-2 focus:ring-black/10 bg-white cursor-pointer font-medium"
                                        >
                                            <option value="SAVINGS">Savings</option>
                                            <option value="CURRENT">Current</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-black/60 uppercase tracking-wider block">UPI Address / ID</label>
                                    <input
                                        type="text"
                                        value={formData.upiId}
                                        onChange={(e) => handleChange("upiId", e.target.value)}
                                        placeholder="username@upi"
                                        className="w-full border border-input-border text-xs px-3 py-2 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white font-medium"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </form>

                {/* Footer Controls */}
                <div className="p-4 border-t border-light-border bg-gray-50 flex items-center justify-between gap-3">
                    {activeStep !== "PROFILE" ? (
                        <button
                            type="button"
                            onClick={handleBack}
                            className="h-9 px-3 border border-light-border hover:bg-neutral-100 rounded-lg text-xs font-semibold text-black/75 flex items-center gap-1.5 cursor-pointer"
                        >
                            <ChevronLeft size={14} />
                            Back
                        </button>
                    ) : (
                        <div />
                    )}

                    {activeStep !== "BANKING" ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="h-9 px-4 bg-black text-white hover:bg-black/90 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer ml-auto"
                        >
                            Continue
                            <ChevronRight size={14} />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleFormSubmit}
                            disabled={isSubmitting}
                            className="h-9 px-5 bg-black text-white hover:bg-black/90 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer ml-auto"
                        >
                            {isSubmitting ? "Processing..." : isEditMode ? "Modify Details" : "Register & Complete"}
                            <Save size={14} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
