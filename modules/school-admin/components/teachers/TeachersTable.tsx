"use client";

import React, { useMemo } from "react";
import { Edit, CheckCircle2, XCircle, ShieldAlert } from "lucide-react";
import { Action } from "@/interfaces/interface";
import { usePermission } from "@/hooks/usePermission";
import { DataTable, DataTableColumn, FilterTabOption } from "@/shared_components/Commons/DataTable";

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

const TEACHER_FILTERS: FilterTabOption<Teacher>[] = [
    { label: "All Teachers", value: "ALL" },
    {
        label: "Class Teachers",
        value: "CLASS_TEACHER",
        countFilter: (t) => (t.classTeacherFor && t.classTeacherFor.length > 0) || t.isClassTeacher
    },
    {
        label: "Subject Teachers",
        value: "SUBJECT_TEACHER",
        countFilter: (t) => !((t.classTeacherFor && t.classTeacherFor.length > 0) || t.isClassTeacher)
    }
];

export default function TeachersTable({
    teachers = [],
    onEdit,
    onToggleStatus
}: TeachersTableProps) {
    const { can } = usePermission();
    const canUpdate = can("teacher.update");

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

    const columns: DataTableColumn<Teacher>[] = useMemo(
        () => [
            {
                id: "teacherProfile",
                header: "Teacher Profile",
                isAlwaysVisible: true,
                sortable: true,
                accessorFn: (row) => `${row.firstName} ${row.lastName}`,
                cell: ({ row }) => (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                            {getInitials(row.firstName, row.lastName)}
                        </div>
                        <div>
                            <span
                                className="font-bold text-black block hover:underline cursor-pointer"
                                onClick={() => onEdit(row)}
                            >
                                {row.firstName} {row.lastName}
                            </span>
                            <span className="text-[10px] text-black/55 font-medium block mt-0.5">
                                {row.designation} • {row.department}
                            </span>
                        </div>
                    </div>
                )
            },
            {
                id: "contactInfo",
                header: "Contact Info",
                cell: ({ row }) => (
                    <div className="space-y-0.5 text-black/70 font-medium">
                        <span className="block">{row.email}</span>
                        <span className="text-[10px] text-black/40 block">{row.phone}</span>
                    </div>
                )
            },
            {
                id: "registryDetails",
                header: "Registry Details",
                sortable: true,
                accessorKey: "employeeCode",
                cell: ({ row }) => (
                    <div className="text-black/75">
                        <span className="font-semibold block">Code: {row.employeeCode}</span>
                        <span className="text-[10px] text-black/40 block mt-0.5">
                            Joined: {formatDate(row.joiningDate)}
                        </span>
                    </div>
                )
            },
            {
                id: "academicAssignments",
                header: "Academic Assignments",
                cell: ({ row }) => {
                    const hasClassTeacherRole =
                        (row.classTeacherFor && row.classTeacherFor.length > 0) || row.isClassTeacher;
                    const hasSubjectAllocations =
                        row.subjectTeacherFor && row.subjectTeacherFor.length > 0;

                    return (
                        <div className="space-y-2 max-w-sm">
                            {/* Class Teacher Section */}
                            {hasClassTeacherRole && (
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 select-none">
                                        Class Teacher
                                    </span>
                                    <div className="flex flex-wrap gap-1">
                                        {row.classTeacherFor && row.classTeacherFor.length > 0 ? (
                                            row.classTeacherFor.map((c, i) => (
                                                <span key={i} className="text-[10px] text-black font-bold">
                                                    {c.className}-{c.sectionName}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-[10px] text-black/60 font-semibold">
                                                Assigned
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Subject Teacher Section */}
                            {hasSubjectAllocations ? (
                                <div className="space-y-1">
                                    <span className="text-[9px] font-bold text-black/35 uppercase tracking-wider block">
                                        Subject Teacher:
                                    </span>
                                    <div className="flex flex-wrap gap-1">
                                        {row.subjectTeacherFor?.map((alloc, i) => (
                                            <span
                                                key={i}
                                                className="text-[9px] bg-neutral-50 border border-light-border text-black/60 px-1.5 py-0.5 rounded font-medium"
                                            >
                                                {alloc.className}-{alloc.sectionName} ({alloc.subjectName})
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ) : row.majorSubjects && row.majorSubjects.length > 0 ? (
                                <div className="space-y-0.5">
                                    <span className="text-[9px] font-bold text-black/35 uppercase tracking-wider block">
                                        Subjects:
                                    </span>
                                    <span className="text-[10px] text-black/50 font-medium">
                                        {row.majorSubjects.join(", ")}
                                    </span>
                                </div>
                            ) : null}

                            {!hasClassTeacherRole &&
                                !hasSubjectAllocations &&
                                !(row.majorSubjects && row.majorSubjects.length > 0) && (
                                    <span className="text-[10px] text-black/30 italic block">
                                        No assignments
                                    </span>
                                )}
                        </div>
                    );
                }
            },
            {
                id: "status",
                header: "Status",
                align: "center",
                sortable: true,
                accessorKey: "isActive",
                cell: ({ row }) => (
                    <DataTable.StatusBadge
                        status={row.isActive ? "ACTIVE" : "INACTIVE"}
                        variant={row.isActive ? "active" : "inactive"}
                    />
                )
            }
        ],
        [onEdit]
    );

    const getRowActions = (teacher: Teacher): Action[] => {
        if (!canUpdate) return [];

        return [
            {
                label: "Modify Profile",
                icon: <Edit size={14} />,
                onClick: () => onEdit(teacher)
            },
            {
                label: teacher.isActive ? "Deactivate Access" : "Activate Access",
                icon: teacher.isActive ? <XCircle size={14} /> : <CheckCircle2 size={14} />,
                onClick: () => onToggleStatus(teacher.userId),
                danger: teacher.isActive
            }
        ];
    };

    return (
        <DataTable<Teacher>
            data={teachers}
            columns={columns}
            tableId="teachers-table"
            searchPlaceholder="Search by name, subjects, code..."
            searchKeys={["firstName", "lastName", "employeeCode", "email", "phone", "designation", "department"]}
            searchFn={(teacher, query) =>
                `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(query) ||
                teacher.email.toLowerCase().includes(query) ||
                teacher.employeeCode.toLowerCase().includes(query) ||
                teacher.phone.includes(query) ||
                teacher.designation.toLowerCase().includes(query) ||
                (teacher.majorSubjects || []).some((sub) => sub.toLowerCase().includes(query)) ||
                (teacher.subjectTeacherFor || []).some((alloc) =>
                    alloc.subjectName.toLowerCase().includes(query)
                )
            }
            filterTabs={TEACHER_FILTERS}
            actions={canUpdate ? getRowActions : undefined}
            footerText="Institute HR Office"
            emptyState={{
                icon: <ShieldAlert size={24} className="text-black/20" />,
                title: "No teachers found matching current filter context.",
                description: "Adjust your search keywords or switch the filter tab."
            }}
            pagination={{ pageSize: 15 }}
        />
    );
}
