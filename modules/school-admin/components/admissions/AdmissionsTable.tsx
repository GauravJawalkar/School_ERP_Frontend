"use client";

import React, { useMemo } from "react";
import { Trash2, AlertTriangle, ArrowUpRight, Check, Eye, BookOpen } from "lucide-react";
import { Action } from "@/interfaces/interface";
import { DataTable, DataTableColumn, FilterTabOption } from "@/shared_components/Commons/DataTable";

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
}

interface AdmissionsTableProps {
    applications: AdmissionApplication[];
    onView: (app: AdmissionApplication) => void;
    onApproveClick: (app: AdmissionApplication) => void;
    onDelete: (app: AdmissionApplication) => void;
    onStatusChange: (id: number, status: string) => void;
}

const STATUS_FILTERS: FilterTabOption<AdmissionApplication>[] = [
    { label: "All Requests", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "Inquiry", value: "INQUIRY" },
    { label: "Approved", value: "APPROVED" },
    { label: "Rejected", value: "REJECTED" }
];

export default function AdmissionsTable({
    applications = [],
    onView,
    onApproveClick,
    onDelete,
    onStatusChange
}: AdmissionsTableProps) {
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

    const columns: DataTableColumn<AdmissionApplication>[] = useMemo(
        () => [
            {
                id: "name",
                header: "Applicant Details",
                isAlwaysVisible: true,
                sortable: true,
                accessorKey: "name",
                cell: ({ row }) => (
                    <div>
                        <span
                            className="font-bold text-black block hover:underline cursor-pointer"
                            onClick={() => onView(row)}
                        >
                            {row.name}
                        </span>
                        <span className="text-[10px] text-black/40 font-medium block mt-0.5">
                            Board: {row.board}
                        </span>
                    </div>
                )
            },
            {
                id: "className",
                header: "Target Class",
                align: "center",
                sortable: true,
                accessorKey: "className",
                cell: ({ row }) => (
                    <span className="font-semibold text-black/75">Class {row.className}</span>
                )
            },
            {
                id: "academicYear",
                header: "Academic Year",
                align: "center",
                sortable: true,
                accessorKey: "academicYearName",
                cell: ({ row }) => (
                    <span className="font-semibold text-black/60">{row.academicYearName}</span>
                )
            },
            {
                id: "parentPhone",
                header: "Parent Phone",
                accessorKey: "parentPhoneNo",
                cell: ({ row }) => (
                    <span className="font-medium text-black/75">{row.parentPhoneNo}</span>
                )
            },
            {
                id: "status",
                header: "App Status",
                align: "center",
                sortable: true,
                accessorKey: "applicationStatus",
                cell: ({ row }) => (
                    <DataTable.StatusBadge
                        status={row.applicationStatus}
                        variant={
                            row.applicationStatus === "APPROVED"
                                ? "approved"
                                : row.applicationStatus === "REJECTED"
                                ? "rejected"
                                : row.applicationStatus === "INQUIRY"
                                ? "inquiry"
                                : "pending"
                        }
                    />
                )
            },
            {
                id: "regDate",
                header: "Reg Date",
                sortable: true,
                accessorKey: "admissionDate",
                cell: ({ row }) => (
                    <span className="text-black/65 font-medium">{formatDate(row.admissionDate)}</span>
                )
            }
        ],
        [onView]
    );

    const getRowActions = (app: AdmissionApplication): Action[] => {
        const actionList: Action[] = [
            {
                label: "View & Review Details",
                icon: <Eye size={14} />,
                onClick: () => onView(app)
            }
        ];

        if (app.applicationStatus !== "APPROVED") {
            actionList.push(
                {
                    label: "Approve & Enroll Student",
                    icon: <Check size={14} />,
                    onClick: () => onApproveClick(app)
                },
                {
                    label: "Change Status to Inquiry",
                    icon: <ArrowUpRight size={14} />,
                    onClick: () => onStatusChange(app.id, "INQUIRY")
                },
                {
                    label: "Reject Application",
                    icon: <AlertTriangle size={14} />,
                    onClick: () => onStatusChange(app.id, "REJECTED")
                }
            );
        }

        actionList.push({
            label: "Delete Application",
            icon: <Trash2 size={14} />,
            danger: true,
            onClick: () => onDelete(app)
        });

        return actionList;
    };

    return (
        <DataTable<AdmissionApplication>
            data={applications}
            columns={columns}
            tableId="admissions-table"
            searchPlaceholder="Search by student name, class or phone..."
            searchKeys={["name", "parentPhoneNo", "className", "board"]}
            filterTabs={STATUS_FILTERS}
            filterKey="applicationStatus"
            actions={getRowActions}
            footerText="Institute Admission Office"
            emptyState={{
                icon: <BookOpen size={24} className="text-black/20" />,
                title: "No admission applications found",
                description: "Refine filters or add a new application request."
            }}
            pagination={{ pageSize: 15 }}
        />
    );
}
