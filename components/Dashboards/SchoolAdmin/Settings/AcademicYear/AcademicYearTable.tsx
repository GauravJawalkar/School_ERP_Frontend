"use client";

import { useState } from "react";
import { Search, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { AcademicYear } from "./AcademicYearStats";

interface AcademicYearTableProps {
    years: AcademicYear[];
}

export default function AcademicYearTable({ years = [] }: AcademicYearTableProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredYears = years.filter((year) =>
        year.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Format Date beautifully
    const formatDate = (dateStr: string) => {
        if (!dateStr) return "N/A";
        try {
            return new Date(dateStr).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="bg-white border border-light-border rounded-xl shadow-xs overflow-hidden">
            {/* Table Filters */}
            <div className="p-4 border-b border-light-border flex flex-col sm:flex-row gap-3 items-center justify-between bg-gray-50/20">
                <div className="relative w-full sm:w-80">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/45" />
                    <input
                        type="text"
                        placeholder="Search academic years..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border border-input-border text-xs pl-9 pr-3 py-2 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white text-black"
                    />
                </div>
            </div>

            {/* Table Structure */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-neutral-50/75 border-b border-light-border text-[10px] font-bold text-black/50 uppercase tracking-widest">
                            <th className="py-3.5 px-6 font-semibold w-1/4">Academic Session</th>
                            <th className="py-3.5 px-6 font-semibold w-1/4">Start Date</th>
                            <th className="py-3.5 px-6 font-semibold w-1/4">End Date</th>
                            <th className="py-3.5 px-6 font-semibold text-center w-1/4">Operational Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-light-border">
                        {filteredYears.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-10 text-center text-xs text-black/40 font-medium">
                                    <AlertCircle size={20} className="mx-auto mb-2 text-black/30" />
                                    No academic year records matching the active search query.
                                </td>
                            </tr>
                        ) : (
                            filteredYears.map((year) => (
                                <tr
                                    key={year.id}
                                    className={`group text-xs text-black/85 transition-colors hover:bg-neutral-50/50 ${
                                        year.isActive ? "bg-emerald-50/5 hover:bg-emerald-50/10" : "bg-white"
                                    }`}
                                >
                                    {/* Name */}
                                    <td className="py-4 px-6 font-semibold flex items-center gap-2">
                                        <Calendar size={14} className={year.isActive ? "text-emerald-600" : "text-black/45"} />
                                        <span>{year.name}</span>
                                    </td>

                                    {/* Start Date */}
                                    <td className="py-4 px-6 font-medium text-black/60">
                                        {formatDate(year.startDate)}
                                    </td>

                                    {/* End Date */}
                                    <td className="py-4 px-6 font-medium text-black/60">
                                        {formatDate(year.endDate)}
                                    </td>

                                    {/* Status */}
                                    <td className="py-4 px-6 text-center">
                                        <div className="flex items-center justify-center">
                                            {year.isActive ? (
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
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
