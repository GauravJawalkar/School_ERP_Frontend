"use client";

import React, { useState } from "react";
import { Search, BookOpen, Edit, CheckCircle2, XCircle, ShieldAlert } from "lucide-react";
import TableActionMenu from "@/components/Commons/TableActionMenu";
import { Action } from "@/interfaces/interface";
import { usePermission } from "@/hooks/usePermission";

interface Teacher {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    isActive: boolean;
    staffId: number;
    employeeCode: string;
    designation: string;
    department: string;
    joiningDate: string;
    salaryBasic: number;
    bankDetails?: any;
    qualification?: string[];
    majorSubjects?: string[];
    isClassTeacher: boolean;
    schoolName?: string;
    classTeacherFor?: Array<{ classId: number; className: string; sectionId: number; sectionName: string }>;
    subjectTeacherFor?: Array<{ classId: number; className: string; sectionId: number; sectionName: string; subjectId: number; subjectName: string }>;
}

interface TeachersTableProps {
    teachers: Teacher[];
    onEdit: (teacher: Teacher) => void;
    onToggleStatus: (userId: string) => void;
}

export default function TeachersTable({
    teachers = [],
    onEdit,
    onToggleStatus
}: TeachersTableProps) {
    const { can } = usePermission();
    const canUpdate = can("teacher.update");
    
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<"ALL" | "CLASS_TEACHER" | "SUBJECT_TEACHER">("ALL");

    // Search and role filtering
    const filteredTeachers = teachers.filter((teacher) => {
        const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
        
        const matchesSearch =
            fullName.includes(searchQuery.toLowerCase()) ||
            teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            teacher.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            teacher.phone.includes(searchQuery) ||
            teacher.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (teacher.majorSubjects || []).some(sub => sub.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (teacher.subjectTeacherFor || []).some(alloc => alloc.subjectName.toLowerCase().includes(searchQuery.toLowerCase()));

        const isAssignedClassTeacher = (teacher.classTeacherFor && teacher.classTeacherFor.length > 0) || teacher.isClassTeacher;
        const matchesRole =
            roleFilter === "ALL" ||
            (roleFilter === "CLASS_TEACHER" && isAssignedClassTeacher) ||
            (roleFilter === "SUBJECT_TEACHER" && !isAssignedClassTeacher);

        return matchesSearch && matchesRole;
    });

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

    const getInitials = (first: string, last: string) => {
        return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    };

    return (
        <div className="bg-white border border-light-border rounded-xl shadow-xs overflow-hidden">
            {/* Filters Header */}
            <div className="p-4 border-b border-light-border flex flex-col md:flex-row gap-3 items-center justify-between bg-gray-50/20">
                {/* Search */}
                <div className="relative w-full md:w-80">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
                    <input
                        type="text"
                        placeholder="Search by name, subjects, code..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border border-input-border text-xs pl-9 pr-3 py-2 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white"
                    />
                </div>

                {/* Filters Tab */}
                <div className="flex items-center gap-1 overflow-x-auto slim-scrollbar w-full md:w-auto self-start md:self-auto pb-1 md:pb-0">
                    {(["ALL", "CLASS_TEACHER", "SUBJECT_TEACHER"] as const).map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setRoleFilter(filter)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                                roleFilter === filter
                                    ? "bg-black text-white"
                                    : "bg-white text-black/55 hover:bg-neutral-55 hover:text-black border border-light-border"
                            }`}
                        >
                            {filter === "ALL" ? "All Teachers" : filter === "CLASS_TEACHER" ? "Class Teachers" : "Subject Teachers"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-light-border bg-gray-50/50 text-[10px] font-bold text-black/50 uppercase tracking-wider">
                            <th className="p-4">Teacher Profile</th>
                            <th className="p-4">Contact Info</th>
                            <th className="p-4">Registry Details</th>
                            <th className="p-4">Academic Assignments</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-light-border text-xs">
                        {filteredTeachers.map((teacher) => {
                            const actions: Action[] = [];
                            if (canUpdate) {
                                actions.push({
                                    label: "Modify Profile",
                                    icon: <Edit size={14} />,
                                    onClick: () => onEdit(teacher)
                                });
                                actions.push({
                                    label: teacher.isActive ? "Deactivate Access" : "Activate Access",
                                    icon: teacher.isActive ? <XCircle size={14} /> : <CheckCircle2 size={14} />,
                                    onClick: () => onToggleStatus(teacher.userId),
                                    danger: teacher.isActive
                                });
                            }

                            const hasClassTeacherRole = (teacher.classTeacherFor && teacher.classTeacherFor.length > 0) || teacher.isClassTeacher;
                            const hasSubjectAllocations = teacher.subjectTeacherFor && teacher.subjectTeacherFor.length > 0;

                            return (
                                <tr key={teacher.userId} className="hover:bg-neutral-50/50 transition duration-100">
                                    {/* Name & Designation & Department */}
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                                                {getInitials(teacher.firstName, teacher.lastName)}
                                            </div>
                                            <div>
                                                <span className="font-bold text-black block hover:underline cursor-pointer" onClick={() => onEdit(teacher)}>
                                                    {teacher.firstName} {teacher.lastName}
                                                </span>
                                                <span className="text-[10px] text-black/55 font-medium block mt-0.5">
                                                    {teacher.designation} • {teacher.department}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Contact Info */}
                                    <td className="p-4">
                                        <div className="space-y-0.5 text-black/70 font-medium">
                                            <span className="block">{teacher.email}</span>
                                            <span className="text-[10px] text-black/40 block">{teacher.phone}</span>
                                        </div>
                                    </td>

                                    {/* Employee Code & Joining Date */}
                                    <td className="p-4">
                                        <div className="text-black/75">
                                            <span className="font-semibold block">Code: {teacher.employeeCode}</span>
                                            <span className="text-[10px] text-black/40 block mt-0.5">Joined: {formatDate(teacher.joiningDate)}</span>
                                        </div>
                                    </td>

                                    {/* Class & Subject Allocations */}
                                    <td className="p-4">
                                        <div className="space-y-2 max-w-sm">
                                            {/* Class Teacher Section */}
                                            {hasClassTeacherRole && (
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 select-none">
                                                        Class Teacher
                                                    </span>
                                                    <div className="flex flex-wrap gap-1">
                                                        {teacher.classTeacherFor && teacher.classTeacherFor.length > 0 ? (
                                                            teacher.classTeacherFor.map((c, i) => (
                                                                <span key={i} className="text-[10px] text-black font-bold">
                                                                    {c.className}-{c.sectionName}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-[10px] text-black/60 font-semibold">Assigned</span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Subject Teacher Section */}
                                            {hasSubjectAllocations ? (
                                                <div className="space-y-1">
                                                    <span className="text-[9px] font-bold text-black/35 uppercase tracking-wider block">Subject Teacher:</span>
                                                    <div className="flex flex-wrap gap-1">
                                                        {teacher.subjectTeacherFor?.map((alloc, i) => (
                                                            <span key={i} className="text-[9px] bg-neutral-50 border border-light-border text-black/60 px-1.5 py-0.5 rounded font-medium">
                                                                {alloc.className}-{alloc.sectionName} ({alloc.subjectName})
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : teacher.majorSubjects && teacher.majorSubjects.length > 0 ? (
                                                <div className="space-y-0.5">
                                                    <span className="text-[9px] font-bold text-black/35 uppercase tracking-wider block">Subjects:</span>
                                                    <span className="text-[10px] text-black/50 font-medium">
                                                        {teacher.majorSubjects.join(", ")}
                                                    </span>
                                                </div>
                                            ) : null}

                                            {!hasClassTeacherRole && !hasSubjectAllocations && !(teacher.majorSubjects && teacher.majorSubjects.length > 0) && (
                                                <span className="text-[10px] text-black/30 italic block">No assignments</span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Status Badge */}
                                    <td className="p-4 text-center">
                                        <span className={`inline-flex items-center gap-1.5 text-[9px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider select-none ${
                                            teacher.isActive
                                                ? "bg-green-50 text-green-700 border-green-200"
                                                : "bg-red-50 text-red-700 border-red-200"
                                        }`}>
                                            <span className={`w-1 h-1 rounded-full ${teacher.isActive ? "bg-green-500" : "bg-red-500"}`} />
                                            {teacher.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>

                                    {/* Action Dropdown Menu */}
                                    <td className="p-4 text-right">
                                        <div className="inline-flex items-center justify-end">
                                            {actions.length > 0 ? (
                                                <TableActionMenu actions={actions} />
                                            ) : (
                                                <span className="text-black/30 font-medium">—</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}

                        {filteredTeachers.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-12 text-center text-black/40">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <ShieldAlert size={24} className="text-black/20" />
                                        <p className="font-semibold text-xs">No teachers found matching current filter context.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer Summary */}
            <div className="p-4 border-t border-light-border bg-gray-50/30 flex items-center justify-between text-[11px] font-medium text-black/45">
                <span>Showing {filteredTeachers.length} of {teachers.length} teachers</span>
                <span>Institute HR Office</span>
            </div>
        </div>
    );
}
