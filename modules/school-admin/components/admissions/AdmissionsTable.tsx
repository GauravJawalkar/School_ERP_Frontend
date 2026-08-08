"use client";

import React, { useState } from "react";
import { Search, Mail, Phone, Calendar, BookOpen, Trash2, CheckCircle2, AlertTriangle, ArrowUpRight, Check, Eye } from "lucide-react";
import TableActionMenu from "@/components/Commons/TableActionMenu";
import { Action } from "@/interfaces/interface";

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

export default function AdmissionsTable({
    applications = [],
    onView,
    onApproveClick,
    onDelete,
    onStatusChange
}: AdmissionsTableProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED" | "INQUIRY">("ALL");

    // Search and status filter logic
    const filteredApplications = applications.filter((app) => {
        const matchesSearch =
            app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.parentPhoneNo.includes(searchQuery) ||
            app.className.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "ALL" || app.applicationStatus === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "APPROVED":
                return "bg-green-50 text-green-700 border-green-200 font-bold";
            case "REJECTED":
                return "bg-red-50 text-red-700 border-red-200 font-bold";
            case "INQUIRY":
                return "bg-amber-50 text-amber-800 border-amber-200 font-semibold";
            case "PENDING":
            default:
                return "bg-neutral-50 text-neutral-600 border-neutral-200 font-medium";
        }
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
        <div className="bg-white border border-light-border rounded-xl shadow-xs overflow-hidden">
            {/* Table Filters */}
            <div className="p-4 border-b border-light-border flex flex-col md:flex-row gap-3 items-center justify-between bg-gray-50/20">
                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
                    <input
                        type="text"
                        placeholder="Search by student name, class or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border border-input-border text-xs pl-9 pr-3 py-2 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white"
                    />
                </div>

                {/* Status Badges Filter Tab */}
                <div className="flex items-center gap-1 overflow-x-auto slim-scrollbar w-full md:w-auto self-start md:self-auto pb-1 md:pb-0">
                    {(["ALL", "PENDING", "INQUIRY", "APPROVED", "REJECTED"] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                                statusFilter === status
                                    ? "bg-black text-white"
                                    : "bg-white text-black/55 hover:bg-neutral-55 hover:text-black border border-light-border"
                            }`}
                        >
                            {status === "ALL" ? "All Requests" : status === "PENDING" ? "Pending" : status === "INQUIRY" ? "Inquiry" : status === "APPROVED" ? "Approved" : "Rejected"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Core */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-light-border bg-gray-50/50 text-[10px] font-bold text-black/50 uppercase tracking-wider">
                            <th className="p-4">Applicant details</th>
                            <th className="p-4 text-center">Class target</th>
                            <th className="p-4 text-center">Academic Year</th>
                            <th className="p-4">Parent phone</th>
                            <th className="p-4 text-center">App status</th>
                            <th className="p-4">Reg Date</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-light-border text-xs">
                        {filteredApplications.length > 0 ? (
                            filteredApplications.map((app) => {
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

                                return (
                                    <tr key={app.id} className="hover:bg-neutral-50/50 transition duration-100">
                                        {/* Applicant Name & Board */}
                                        <td className="p-4">
                                            <div>
                                                <span className="font-bold text-black block hover:underline cursor-pointer" onClick={() => onView(app)}>
                                                    {app.name}
                                                </span>
                                                <span className="text-[10px] text-black/40 font-medium block mt-0.5">
                                                    Board: {app.board}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Target Class */}
                                        <td className="p-4 text-center font-semibold text-black/75">
                                            Class {app.className}
                                        </td>

                                        {/* Academic Session */}
                                        <td className="p-4 text-center font-semibold text-black/60">
                                            {app.academicYearName}
                                        </td>

                                        {/* Parent Phone */}
                                        <td className="p-4 font-medium text-black/75">
                                            {app.parentPhoneNo}
                                        </td>

                                        {/* Application Status */}
                                        <td className="p-4 text-center">
                                            <span className={`text-[9px] px-2.5 py-0.5 border rounded-full uppercase tracking-wider select-none ${getStatusBadge(app.applicationStatus)}`}>
                                                {app.applicationStatus}
                                            </span>
                                        </td>

                                        {/* Admission Date */}
                                        <td className="p-4 text-black/65 font-medium">
                                            {formatDate(app.admissionDate)}
                                        </td>

                                        {/* Access Controls */}
                                        <td className="p-4 text-right">
                                            <div className="inline-flex items-center justify-end">
                                                <TableActionMenu actions={actionList} />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={7} className="p-12 text-center text-black/40">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <BookOpen size={24} className="text-black/20" />
                                        <p className="font-semibold text-xs">No admission applications found</p>
                                        <p className="text-[10px] text-black/30">Refine filters or add a new application request</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer Summary */}
            <div className="p-4 border-t border-light-border bg-gray-50/30 flex items-center justify-between text-[11px] font-medium text-black/45">
                <span>Showing {filteredApplications.length} of {applications.length} applications</span>
                <span>Institute Admission Office</span>
            </div>
        </div>
    );
}
