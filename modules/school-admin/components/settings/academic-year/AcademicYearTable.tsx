"use client";

import React, { useMemo } from "react";
import { Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/helpers/formatDate";
import { AcademicYearTableProps } from "@/interfaces/interface";
import { CanAccess } from "@/shared_components/Auth/CanAccess";
import { DataTable, DataTableColumn } from "@/shared_components/Commons/DataTable";

export default function AcademicYearTable({
    years = [],
    isSuperAdmin,
    onToggleActive,
    updatingId
}: AcademicYearTableProps) {
    const columns: DataTableColumn<any>[] = useMemo(
        () => [
            {
                id: "name",
                header: "Academic Session",
                isAlwaysVisible: true,
                sortable: true,
                accessorKey: "name",
                cell: ({ row }) => (
                    <div className="font-semibold flex items-center gap-2">
                        <Calendar
                            size={14}
                            className={row.isActive ? "text-emerald-600" : "text-black/45"}
                        />
                        <span>{row.name}</span>
                    </div>
                )
            },
            {
                id: "startDate",
                header: "Start Date",
                sortable: true,
                accessorKey: "startDate",
                cell: ({ row }) => (
                    <span className="font-medium text-black/60">{formatDate(row.startDate)}</span>
                )
            },
            {
                id: "endDate",
                header: "End Date",
                sortable: true,
                accessorKey: "endDate",
                cell: ({ row }) => (
                    <span className="font-medium text-black/60">{formatDate(row.endDate)}</span>
                )
            },
            {
                id: "status",
                header: "Operational Status",
                align: "center",
                sortable: true,
                accessorKey: "isActive",
                cell: ({ row }) => (
                    <div className="flex items-center justify-center">
                        {isSuperAdmin ? (
                            <CanAccess role="SUPER_ADMIN" permission="academic_year.update">
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        disabled={updatingId !== null}
                                        onClick={() => onToggleActive(row.id, !row.isActive)}
                                        className={`w-10 h-6 rounded-full p-0.5 transition-all duration-300 focus:outline-hidden cursor-pointer ${
                                            row.isActive ? "bg-black" : "bg-neutral-200"
                                        } ${updatingId !== null ? "opacity-60 cursor-not-allowed" : ""}`}
                                        title={
                                            row.isActive
                                                ? "Click to deactivate this session"
                                                : "Click to activate this session (deactivates others)"
                                        }
                                    >
                                        <div
                                            className={`w-5 h-5 rounded-full bg-white transition-transform duration-300 flex items-center justify-center shadow-xs ${
                                                row.isActive ? "translate-x-4" : "translate-x-0"
                                            }`}
                                        >
                                            {row.isActive && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-black" />
                                            )}
                                        </div>
                                    </button>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-black/50">
                                        {row.isActive ? "Active" : "Inactive"}
                                    </span>
                                </div>
                            </CanAccess>
                        ) : (
                            <div>
                                {row.isActive ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-255 leading-none">
                                        <CheckCircle2 size={11} />
                                        Active Session
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold text-neutral-500 bg-neutral-50 border border-neutral-200 leading-none">
                                        Inactive
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                )
            }
        ],
        [isSuperAdmin, onToggleActive, updatingId]
    );

    return (
        <DataTable<any>
            data={years}
            columns={columns}
            tableId="academic-year-table"
            searchPlaceholder="Search academic years..."
            searchKeys={["name"]}
            emptyState={{
                icon: <AlertCircle size={20} className="text-black/30" />,
                title: "No academic year records matching the active search query."
            }}
            pagination={{ pageSize: 15 }}
        />
    );
}
