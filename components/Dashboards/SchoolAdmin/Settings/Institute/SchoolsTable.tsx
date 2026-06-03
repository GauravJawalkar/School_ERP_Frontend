"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";

export interface SchoolSummary {
    schoolId: number;
    schoolName: string;
    schoolSlug: string;
    affiliationNumber: string;
    schoolStatus: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING_APPROVAL";
    address: string;
    schoolInfo?: {
        main_phone?: string;
        emails?: {
            primary?: string;
        };
    };
    totalStudents: number;
    totalStaff: number;
    createdAt: string;
}

interface SchoolsTableProps {
    schools: SchoolSummary[];
    isLoading: boolean;
    isError: boolean;
    onManageSchool: (slug: string) => void;
    onStatusChange: (slug: string, newStatus: string) => void;
}

export default function SchoolsTable({
    schools,
    isLoading,
    isError,
    onManageSchool,
    onStatusChange
}: SchoolsTableProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    // Filter logic
    const filteredSchools = schools.filter((school) => {
        const matchesSearch =
            school.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            school.affiliationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            school.schoolSlug.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || school.schoolStatus === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white border border-light-border p-4 rounded-xl shadow-xs">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/35 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Filter by name, slug or affiliation..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-input-border rounded-lg text-xs outline-none focus:ring-1 focus:ring-black focus:border-black placeholder:text-black/30 font-medium"
                    />
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full sm:w-auto px-3 py-2 border border-input-border rounded-lg text-xs outline-none focus:ring-1 focus:ring-black focus:border-black font-semibold text-black/70 bg-white"
                    >
                        <option value="ALL">All Operational Statuses</option>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="SUSPENDED">Suspended</option>
                        <option value="PENDING_APPROVAL">Pending Approval</option>
                    </select>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white border border-light-border rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b border-light-border bg-neutral-50/50 text-[10px] font-bold text-black/45 uppercase tracking-wider">
                                <th className="p-4 font-bold">School Identity</th>
                                <th className="p-4 font-bold">Location</th>
                                <th className="p-4 font-bold">Affiliation</th>
                                <th className="p-4 font-bold text-center">Roster Stats</th>
                                <th className="p-4 font-bold">Operational Status</th>
                                <th className="p-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-light-border text-xs">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-black/40 font-semibold uppercase tracking-wider">
                                        Scanning schools databases...
                                    </td>
                                </tr>
                            ) : isError ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-red-500 font-semibold">
                                        Error fetching campus profiles from directory.
                                    </td>
                                </tr>
                            ) : filteredSchools.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-black/40 font-semibold">
                                        No registered institutes found matching query.
                                    </td>
                                </tr>
                            ) : (
                                filteredSchools.map((school) => (
                                    <tr key={school.schoolId} className="hover:bg-neutral-50/50 transition">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-black text-white font-bold flex items-center justify-center border border-light-border select-none text-xs">
                                                    {school.schoolName.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h2 className="font-bold text-black">{school.schoolName}</h2>
                                                    <p className="text-[10px] text-black/40 font-medium">/{school.schoolSlug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 font-medium text-black/75">
                                            {school.address || "N/A"}
                                        </td>
                                        <td className="p-4 font-mono text-[11px] text-black/60 font-semibold">
                                            {school.affiliationNumber}
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="inline-flex items-center gap-3 text-[11px] font-semibold text-black/70">
                                                <span title="Students">{school.totalStudents || 0} Std</span>
                                                <span className="text-black/20">|</span>
                                                <span title="Staff">{school.totalStaff || 0} Stf</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <select
                                                value={school.schoolStatus}
                                                onChange={(e) => onStatusChange(school.schoolSlug, e.target.value)}
                                                className="px-2.5 py-1 border border-input-border rounded-md text-[11px] font-bold bg-white text-black/80 cursor-pointer"
                                            >
                                                <option value="ACTIVE">Active</option>
                                                <option value="INACTIVE">Inactive</option>
                                                <option value="SUSPENDED">Suspended</option>
                                                <option value="PENDING_APPROVAL">Pending Approval</option>
                                            </select>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => onManageSchool(school.schoolSlug)}
                                                className="h-8 px-3 rounded-lg bg-black text-white hover:bg-black/90 font-bold text-xs transition cursor-pointer"
                                            >
                                                Manage
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
