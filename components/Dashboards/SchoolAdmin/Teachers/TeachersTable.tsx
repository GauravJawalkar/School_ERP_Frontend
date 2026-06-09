"use client";

import React, { useState } from "react";
import { Search, Mail, Phone, Calendar, BookOpen, Trash2, Edit, CheckCircle2, XCircle, ShieldAlert } from "lucide-react";
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
            (teacher.majorSubjects || []).some(sub => sub.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesRole =
            roleFilter === "ALL" ||
            (roleFilter === "CLASS_TEACHER" && teacher.isClassTeacher) ||
            (roleFilter === "SUBJECT_TEACHER" && !teacher.isClassTeacher);

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

    return (
        <div className="bg-white border border-light-border rounded-xl shadow-xs overflow-hidden">
            {/* Filters Header */}
            <div className="p-4 border-b border-light-border flex flex-col md:flex-row gap-3 items-center justify-between bg-gray-50/20">
                {/* Search */}
                <div className="relative w-full md:w-80">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
                    <input
                        type="text"
                        placeholder="Search by teacher name, subjects, code..."
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
                            <th className="p-4">Teacher Name</th>
                            <th className="p-4">Contact Info</th>
                            <th className="p-4">Role & Dept</th>
                            <th className="p-4">Subjects & Qualifications</th>
                            <th className="p-4">Joining Date</th>
                            <th className="p-4 text-center">Class Teacher</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-right">Actions</th>
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

                            return (
                                <tr key={teacher.userId} className="hover:bg-neutral-50/50 transition duration-100">
                                    {/* Name & Code */}
                                    <td className="p-4">
                                        <div>
                                            <span className="font-bold text-black block hover:underline cursor-pointer" onClick={() => onEdit(teacher)}>
                                                {teacher.firstName} {teacher.lastName}
                                            </span>
                                            <span className="text-[10px] text-black/40 font-medium block mt-0.5">
                                                Code: {teacher.employeeCode}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Contact */}
                                    <td className="p-4 text-black/75 font-medium">
                                        <div>
                                            <span className="block">{teacher.email}</span>
                                            <span className="text-[10px] text-black/40 font-medium block mt-0.5">{teacher.phone}</span>
                                        </div>
                                    </td>

                                    {/* Academic Scope */}
                                    <td className="p-4 text-black/75 font-medium">
                                        <div>
                                            <span className="block">{teacher.designation}</span>
                                            <span className="text-[10px] text-black/40 font-medium block mt-0.5">{teacher.department}</span>
                                        </div>
                                    </td>

                                    {/* Qualifications & Subjects */}
                                    <td className="p-4">
                                        <div className="space-y-1">
                                            <div className="flex flex-wrap gap-1">
                                                {teacher.qualification && teacher.qualification.length > 0 ? (
                                                    teacher.qualification.map((qual, i) => (
                                                        <span key={i} className="text-[9px] bg-neutral-50 border border-neutral-200 text-neutral-600 px-1.5 py-0.5 rounded font-semibold">
                                                            {qual}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-[10px] text-black/30 italic">No qualifications listed</span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-1 mt-1 text-[10px] text-black/65 font-medium">
                                                {teacher.majorSubjects && teacher.majorSubjects.length > 0 ? (
                                                    <div className="flex items-center gap-1">
                                                        <BookOpen size={10} className="text-black/30" />
                                                        <span>{teacher.majorSubjects.join(", ")}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] text-black/30 italic">No subjects specified</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Joining Date */}
                                    <td className="p-4 text-black/65 font-medium">
                                        {formatDate(teacher.joiningDate)}
                                    </td>

                                    {/* Class Teacher Indicator */}
                                    <td className="p-4 text-center">
                                        {teacher.isClassTeacher ? (
                                            <span className="text-[9px] px-2.5 py-0.5 bg-green-50 border border-green-200 text-green-700 rounded-full font-bold uppercase tracking-wider select-none">
                                                Yes
                                            </span>
                                        ) : (
                                            <span className="text-[9px] px-2.5 py-0.5 bg-neutral-50 border border-neutral-200 text-neutral-500 rounded-full font-medium uppercase tracking-wider select-none">
                                                No
                                            </span>
                                        )}
                                    </td>

                                    {/* Status Badge */}
                                    <td className="p-4 text-center">
                                        <span className={`text-[9px] px-2.5 py-0.5 border rounded-full uppercase tracking-wider select-none ${
                                            teacher.isActive
                                                ? "bg-green-50 text-green-700 border-green-200 font-bold"
                                                : "bg-red-50 text-red-700 border-red-200 font-bold"
                                        }`}>
                                            {teacher.isActive ? "ACTIVE" : "INACTIVE"}
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
                                <td colSpan={8} className="p-12 text-center text-black/40">
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
