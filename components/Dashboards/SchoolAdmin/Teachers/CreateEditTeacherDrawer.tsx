"use client";

import React, { useEffect, useState } from "react";
import { X, GraduationCap, Save, Plus } from "lucide-react";
import toast from "react-hot-toast";

interface TeacherData {
    userId?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    password?: string;
    employeeCode: string;
    designation: string;
    department: string;
    joiningDate: string;
    salaryBasic: number;
    bankDetails?: any;
    qualification?: string[];
    majorSubjects?: string[];
    isClassTeacher: boolean;
    isActive?: boolean;
}

interface CreateEditTeacherDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    isSubmitting: boolean;
    teacher: TeacherData | null;
}

export default function CreateEditTeacherDrawer({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting,
    teacher
}: CreateEditTeacherDrawerProps) {
    const isEditMode = !!teacher;

    // Form fields state
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState<"MALE" | "FEMALE" | "OTHER">("MALE");
    const [password, setPassword] = useState("");
    const [employeeCode, setEmployeeCode] = useState("");
    const [designation, setDesignation] = useState("Teacher");
    const [department, setDepartment] = useState("Academic");
    const [joiningDate, setJoiningDate] = useState("");
    const [salaryBasic, setSalaryBasic] = useState<number>(0);
    const [qualification, setQualification] = useState<string[]>([]);
    const [majorSubjects, setMajorSubjects] = useState<string[]>([]);
    const [isClassTeacher, setIsClassTeacher] = useState(false);
    const [isActive, setIsActive] = useState(true);

    const [qualificationInput, setQualificationInput] = useState("");
    const [subjectInput, setSubjectInput] = useState("");

    // Populate state on edit
    useEffect(() => {
        if (isOpen) {
            if (teacher) {
                setFirstName(teacher.firstName || "");
                setLastName(teacher.lastName || "");
                setEmail(teacher.email || "");
                setPhone(teacher.phone || "");
                setGender(teacher.gender || "MALE");
                setPassword(""); // Never prefill password
                setEmployeeCode(teacher.employeeCode || "");
                setDesignation(teacher.designation || "Teacher");
                setDepartment(teacher.department || "Academic");
                setJoiningDate(teacher.joiningDate ? new Date(teacher.joiningDate).toISOString().split("T")[0] : "");
                setSalaryBasic(Number(teacher.salaryBasic) || 0);
                setQualification(Array.isArray(teacher.qualification) ? teacher.qualification : []);
                setMajorSubjects(Array.isArray(teacher.majorSubjects) ? teacher.majorSubjects : []);
                setIsClassTeacher(!!teacher.isClassTeacher);
                setIsActive(teacher.isActive !== false);
            } else {
                setFirstName("");
                setLastName("");
                setEmail("");
                setPhone("");
                setGender("MALE");
                setPassword("");
                setEmployeeCode("");
                setDesignation("Teacher");
                setDepartment("Academic");
                setJoiningDate(new Date().toISOString().split("T")[0]);
                setSalaryBasic(0);
                setQualification([]);
                setMajorSubjects([]);
                setIsClassTeacher(false);
                setIsActive(true);
            }
            setQualificationInput("");
            setSubjectInput("");
        }
    }, [teacher, isOpen]);

    if (!isOpen) return null;

    const addQualification = () => {
        const val = qualificationInput.trim();
        if (val && !qualification.includes(val)) {
            setQualification([...qualification, val]);
            setQualificationInput("");
        }
    };

    const removeQualification = (idx: number) => {
        setQualification(qualification.filter((_, i) => i !== idx));
    };

    const addSubject = () => {
        const val = subjectInput.trim();
        if (val && !majorSubjects.includes(val)) {
            setMajorSubjects([...majorSubjects, val]);
            setSubjectInput("");
        }
    };

    const removeSubject = (idx: number) => {
        setMajorSubjects(majorSubjects.filter((_, i) => i !== idx));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!firstName.trim() || !lastName.trim()) {
            toast.error("First name and Last name are required");
            return;
        }
        if (!email.trim()) {
            toast.error("Email is required");
            return;
        }
        if (!phone.trim() || phone.trim().length !== 10) {
            toast.error("A valid 10-digit phone number is required");
            return;
        }
        if (!isEditMode && !password.trim()) {
            toast.error("Password is required for registration");
            return;
        }
        if (!employeeCode.trim()) {
            toast.error("Employee code is required");
            return;
        }
        if (!joiningDate) {
            toast.error("Joining date is required");
            return;
        }
        if (salaryBasic < 0) {
            toast.error("Salary cannot be negative");
            return;
        }

        const payload: any = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            gender,
            employeeCode: employeeCode.trim(),
            designation: designation.trim(),
            department: department.trim(),
            joiningDate,
            salaryBasic,
            qualification,
            majorSubjects,
            isClassTeacher,
            isActive
        };

        if (password.trim()) {
            payload.password = password.trim();
        }

        onSubmit(payload);
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
                        <div className="w-10 h-10 bg-neutral-50 rounded-lg flex items-center justify-center border border-light-border shrink-0">
                            <GraduationCap size={16} className="text-black" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-black uppercase tracking-wide">
                                {isEditMode ? "Modify Teacher Profile" : "Register New Teacher"}
                            </h2>
                            <p className="text-xs text-black/50">
                                {isEditMode ? "Update credentials, academic assignment and contact info." : "Deploy new staff member with teacher role."}
                            </p>
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
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5 slim-scrollbar">
                    
                    {/* Basic Name Section */}
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

                    {/* Gender Selection */}
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

                    {/* Email and Password */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-black/70 uppercase tracking-widest block">
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            placeholder="e.g. educator@school.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-9 px-3 border border-light-border rounded-lg text-xs text-black focus:border-black focus:outline-hidden transition bg-white"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-black/70 uppercase tracking-widest block">
                            Password {isEditMode && "(Leave empty to keep current)"}
                        </label>
                        <input
                            type="password"
                            required={!isEditMode}
                            placeholder={isEditMode ? "••••••••" : "Enter temporary password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-9 px-3 border border-light-border rounded-lg text-xs text-black focus:border-black focus:outline-hidden transition bg-white"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-black/70 uppercase tracking-widest block">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            required
                            maxLength={10}
                            placeholder="10-digit number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                            className="w-full h-9 px-3 border border-light-border rounded-lg text-xs text-black focus:border-black focus:outline-hidden transition bg-white"
                        />
                    </div>

                    <hr className="border-light-border my-2" />

                    {/* Employee Code & Joining Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-black/70 uppercase tracking-widest block">
                                Employee Code
                            </label>
                            <input
                                type="text"
                                required
                                value={employeeCode}
                                onChange={(e) => setEmployeeCode(e.target.value)}
                                className="w-full h-9 px-3 border border-light-border rounded-lg text-xs text-black focus:border-black focus:outline-hidden transition bg-white"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-black/70 uppercase tracking-widest block">
                                Joining Date
                            </label>
                            <input
                                type="date"
                                required
                                value={joiningDate}
                                onChange={(e) => setJoiningDate(e.target.value)}
                                className="w-full h-9 px-3 border border-light-border rounded-lg text-xs text-black focus:border-black focus:outline-hidden transition bg-white cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Designation & Department */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-black/70 uppercase tracking-widest block">
                                Designation
                            </label>
                            <input
                                type="text"
                                value={designation}
                                onChange={(e) => setDesignation(e.target.value)}
                                className="w-full h-9 px-3 border border-light-border rounded-lg text-xs text-black focus:border-black focus:outline-hidden transition bg-white"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-black/70 uppercase tracking-widest block">
                                Department
                            </label>
                            <input
                                type="text"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                className="w-full h-9 px-3 border border-light-border rounded-lg text-xs text-black focus:border-black focus:outline-hidden transition bg-white"
                            />
                        </div>
                    </div>

                    {/* Salary Basic */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-black/70 uppercase tracking-widest block">
                            Basic Salary (INR)
                        </label>
                        <input
                            type="number"
                            required
                            min={0}
                            value={salaryBasic}
                            onChange={(e) => setSalaryBasic(Number(e.target.value) || 0)}
                            className="w-full h-9 px-3 border border-light-border rounded-lg text-xs text-black focus:border-black focus:outline-hidden transition bg-white"
                        />
                    </div>

                    <hr className="border-light-border my-2" />

                    {/* Qualifications */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-black/70 uppercase tracking-widest block">
                            Qualifications / Degrees
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="e.g. B.Ed, M.Sc Mathematics"
                                value={qualificationInput}
                                onChange={(e) => setQualificationInput(e.target.value)}
                                className="flex-1 h-9 px-3 border border-light-border rounded-lg text-xs text-black focus:border-black focus:outline-hidden transition bg-white"
                            />
                            <button
                                type="button"
                                onClick={addQualification}
                                className="h-9 px-3 border border-light-border hover:border-black/70 text-black text-xs font-semibold rounded-lg bg-neutral-50 transition cursor-pointer flex items-center gap-1 shrink-0"
                            >
                                <Plus size={12} />
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {qualification.map((qual, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1.5 bg-neutral-50 border border-light-border px-2.5 py-1 rounded-md text-[10px] font-medium text-black">
                                    {qual}
                                    <button type="button" onClick={() => removeQualification(idx)} className="text-black/40 hover:text-black font-bold text-xs select-none">×</button>
                                </span>
                            ))}
                            {qualification.length === 0 && (
                                <span className="text-[10px] text-black/30 italic">No qualifications added yet</span>
                            )}
                        </div>
                    </div>

                    {/* Major Subjects */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-black/70 uppercase tracking-widest block">
                            Subjects Taught
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="e.g. Mathematics, Science"
                                value={subjectInput}
                                onChange={(e) => setSubjectInput(e.target.value)}
                                className="flex-1 h-9 px-3 border border-light-border rounded-lg text-xs text-black focus:border-black focus:outline-hidden transition bg-white"
                            />
                            <button
                                type="button"
                                onClick={addSubject}
                                className="h-9 px-3 border border-light-border hover:border-black/70 text-black text-xs font-semibold rounded-lg bg-neutral-50 transition cursor-pointer flex items-center gap-1 shrink-0"
                            >
                                <Plus size={12} />
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {majorSubjects.map((sub, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1.5 bg-neutral-50 border border-light-border px-2.5 py-1 rounded-md text-[10px] font-medium text-black">
                                    {sub}
                                    <button type="button" onClick={() => removeSubject(idx)} className="text-black/40 hover:text-black font-bold text-xs select-none">×</button>
                                </span>
                            ))}
                            {majorSubjects.length === 0 && (
                                <span className="text-[10px] text-black/30 italic">No subjects added yet</span>
                            )}
                        </div>
                    </div>

                    <hr className="border-light-border my-2" />

                    {/* Class Teacher Toggle */}
                    <div className="flex items-center justify-between py-1">
                        <div>
                            <span className="text-xs font-semibold text-black block">Class Teacher Status</span>
                            <span className="text-[10px] text-black/50 block">Designates whether this teacher is assigned as a class teacher.</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsClassTeacher(!isClassTeacher)}
                            className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                                isClassTeacher ? "bg-black" : "bg-neutral-200"
                            }`}
                        >
                            <div className={`w-4.5 h-4.5 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                                isClassTeacher ? "translate-x-4.5" : "translate-x-0"
                            }`} />
                        </button>
                    </div>

                    {/* Active Status (Edit Mode Only) */}
                    {isEditMode && (
                        <div className="flex items-center justify-between py-1 border-t border-light-border pt-4">
                            <div>
                                <span className="text-xs font-semibold text-black block">Active Status</span>
                                <span className="text-[10px] text-black/50 block">Deactivating revokes all credentials and permissions.</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsActive(!isActive)}
                                className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                                    isActive ? "bg-black" : "bg-neutral-200"
                                }`}
                            >
                                <div className={`w-4.5 h-4.5 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                                    isActive ? "translate-x-4.5" : "translate-x-0"
                                }`} />
                            </button>
                        </div>
                    )}
                </form>

                {/* Footer Controls */}
                <div className="p-4 border-t border-light-border bg-neutral-50/75 flex items-center justify-end gap-2.5">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="h-9 px-4 rounded-lg border border-light-border text-xs font-semibold hover:border-black hover:bg-neutral-50 transition cursor-pointer text-black"
                    >
                        Discard
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="h-9 px-5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-black/90 transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                        <Save size={13} />
                        {isSubmitting ? "Deploying..." : isEditMode ? "Save Changes" : "Deploy Teacher"}
                    </button>
                </div>
            </div>
        </div>
    );
}
