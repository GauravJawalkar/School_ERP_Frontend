"use client";

import { useState, useEffect } from "react";
import { X, UserPlus, Info, Check } from "lucide-react";

interface SchoolUserDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newStaff: any) => void;
}

export default function SchoolUserDrawer({
    isOpen,
    onClose,
    onSave
}: SchoolUserDrawerProps) {
    const [animateIn, setAnimateIn] = useState(false);

    // Personal details
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("MALE");
    const [password, setPassword] = useState("");

    // Employment details
    const [employeeCode, setEmployeeCode] = useState("");
    const [designation, setDesignation] = useState("");
    const [roleName, setRoleName] = useState("TEACHER");
    const [joiningDate, setJoiningDate] = useState("");
    const [salaryBasic, setSalaryBasic] = useState<number>(35000);

    // Bank details
    const [bankName, setBankName] = useState("");
    const [bankAccHolderName, setBankAccHolderName] = useState("");
    const [bankAccNo, setBankAccNo] = useState("");
    const [bankIFSC, setBankIFSC] = useState("");
    const [bankAccType, setBankAccType] = useState("SAVINGS");
    const [upiId, setUpiId] = useState("");

    useEffect(() => {
        if (isOpen) {
            setFirstName("");
            setLastName("");
            setEmail("");
            setPhone("");
            setGender("MALE");
            setPassword("");
            setEmployeeCode(`EMP-${Date.now().toString().slice(-4)}`);
            setDesignation("");
            setRoleName("TEACHER");
            setJoiningDate(new Date().toISOString().split("T")[0]);
            setSalaryBasic(35000);

            // Default bank templates
            setBankName("");
            setBankAccHolderName("");
            setBankAccNo("");
            setBankIFSC("");
            setBankAccType("SAVINGS");
            setUpiId("");

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

        // Safe validations
        if (!firstName || !lastName || !email || !phone || !password || !designation || !bankName || !bankAccNo || !bankIFSC) {
            alert("Please fill all required fields in the form.");
            return;
        }

        onSave({
            firstName,
            lastName,
            email,
            phone,
            gender,
            password,
            isActive: true,
            roleName,
            employeeCode,
            designation,
            joiningDate,
            salaryBasic: salaryBasic.toString(),
            bankName,
            bankAccHolderName: bankAccHolderName || `${firstName} ${lastName}`,
            bankAccNo,
            bankIFSC,
            bankAccType,
            upiId
        });

        handleClose();
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
                                <UserPlus size={15} />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-black tracking-tight">Create User Account</h3>
                                <p className="text-xs text-black/40 font-normal">Issue credentials & department records</p>
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
                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 slim-scrollbar">

                        <div className="p-3 bg-gray-50 border border-light-border rounded-lg flex gap-2.5 text-xs text-black/60 leading-relaxed">
                            <Info size={16} className="shrink-0 text-black/70 mt-0.5" />
                            <span>Adding a new user automatically configures dashboard logins for the target employee and registers a corresponding profile within your chosen school role.</span>
                        </div>

                        {/* SECTION 1: Credentials & Profile */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-black/40 uppercase tracking-widest border-b border-gray-50 pb-1">1. User Credentials</h4>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">First Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition font-medium"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Last Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Dashboard Email Login</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="e.g. employee@school.com"
                                    className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition font-medium"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Contact Phone</label>
                                    <input
                                        type="tel"
                                        required
                                        maxLength={10}
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                                        className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition font-medium"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Login Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition font-mono"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Gender</label>
                                <select
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white font-medium"
                                >
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* SECTION 2: Employment */}
                        <div className="space-y-4 pt-2">
                            <h4 className="text-xs font-bold text-black/40 uppercase tracking-widest border-b border-gray-50 pb-1">2. Employment Details</h4>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Employee Code</label>
                                    <input
                                        type="text"
                                        required
                                        value={employeeCode}
                                        onChange={(e) => setEmployeeCode(e.target.value)}
                                        className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition font-mono font-bold"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Access Role</label>
                                    <select
                                        value={roleName}
                                        onChange={(e) => setRoleName(e.target.value)}
                                        className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white font-bold"
                                    >
                                        <option value="TEACHER">Educator (Teacher)</option>
                                        <option value="ACCOUNTANT">Accountant</option>
                                        <option value="LIBRARIAN">Librarian</option>
                                        <option value="RECEPTIONIST">Receptionist</option>
                                        <option value="SCHOOL_ADMIN">System Administrator</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Designation Job Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={designation}
                                        onChange={(e) => setDesignation(e.target.value)}
                                        placeholder="e.g. Senior Math Teacher"
                                        className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition font-medium"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Basic Salary (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        value={salaryBasic}
                                        onChange={(e) => setSalaryBasic(Number(e.target.value))}
                                        className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition font-bold"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SECTION 3: Bank details */}
                        <div className="space-y-4 pt-2">
                            <h4 className="text-xs font-bold text-black/40 uppercase tracking-widest border-b border-gray-50 pb-1">3. Compensation & Bank Details</h4>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Bank Name</label>
                                <input
                                    type="text"
                                    required
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    placeholder="e.g. State Bank of India"
                                    className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition font-medium"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Account Number</label>
                                    <input
                                        type="text"
                                        required
                                        value={bankAccNo}
                                        onChange={(e) => setBankAccNo(e.target.value)}
                                        className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition font-mono font-bold"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">IFSC Routing Code</label>
                                    <input
                                        type="text"
                                        required
                                        value={bankIFSC}
                                        onChange={(e) => setBankIFSC(e.target.value.toUpperCase())}
                                        className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition font-mono font-bold"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Account Type</label>
                                    <select
                                        value={bankAccType}
                                        onChange={(e) => setBankAccType(e.target.value)}
                                        className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white font-medium"
                                    >
                                        <option value="SAVINGS">Savings Account</option>
                                        <option value="CURRENT">Current Account</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Optional UPI Address</label>
                                    <input
                                        type="text"
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                        placeholder="e.g. name@upi"
                                        className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                    </form>

                    {/* Actions */}
                    <div className="p-6 border-t border-light-border bg-gray-50/50 flex gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="w-1/2 py-2.5 rounded-lg border border-light-border bg-white text-xs font-semibold text-black hover:bg-neutral-50 transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="w-1/2 py-2.5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-black/90 transition cursor-pointer"
                        >
                            Create User
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
