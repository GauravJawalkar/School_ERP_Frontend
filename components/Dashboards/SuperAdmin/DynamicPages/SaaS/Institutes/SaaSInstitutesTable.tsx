"use client";

import { useState } from "react";
import { Search, Globe, ShieldAlert, Sliders, Ban, CheckCircle2, ChevronDown } from "lucide-react";
import SaaSChangeTierDrawer from "./SaaSChangeTierDrawer";
import SaaSQuotaOverrideDrawer from "./SaaSQuotaOverrideDrawer";
import { School } from "@/interfaces/interface";

interface SaaSInstitutesTableProps {
    schools: School[];
    onUpdateTier: (schoolSlug: string, newTier: string) => void;
    onUpdateStatus: (schoolSlug: string, newStatus: string) => void;
    onOverrideQuotas: (schoolSlug: string, newCap: number) => void;
}

export default function SaaSInstitutesTable({
    schools = [],
    onUpdateTier,
    onUpdateStatus,
    onOverrideQuotas
}: SaaSInstitutesTableProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeDropdownRow, setActiveDropdownRow] = useState<number | null>(null);

    // Drawer state controllers
    const [selectedSchoolForTier, setSelectedSchoolForTier] = useState<School | null>(null);
    const [selectedSchoolForQuota, setSelectedSchoolForQuota] = useState<School | null>(null);
    const [isTierDrawerOpen, setIsTierDrawerOpen] = useState(false);
    const [isQuotaDrawerOpen, setIsQuotaDrawerOpen] = useState(false);

    const getPlanDetails = (studentCount: number) => {
        if (studentCount > 2500) {
            return { name: "Enterprise Suite", cap: 10000, price: "₹95,000", bg: "bg-neutral-100 text-black border-neutral-200" };
        } else if (studentCount > 500) {
            return { name: "Premium Growth", cap: 2500, price: "₹45,000", bg: "bg-black text-white border-black/90" };
        } else {
            return { name: "Basic Tier", cap: 500, price: "₹15,000", bg: "bg-gray-50 text-black/60 border-light-border" };
        }
    };

    const filtered = schools.filter(s =>
        s.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.schoolSlug ?? "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-white border border-light-border rounded-xl p-5 shadow-xs space-y-4 relative">

            {/* Header and Search */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h3 className="text-sm font-semibold text-black/80 uppercase tracking-wider mb-0.5">SaaS Platform Institutes</h3>
                    <p className="text-xs text-black/40">Audit subdomains, quota meters, and adjust parameters on the fly</p>
                </div>

                <div className="relative min-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/40" />
                    <input
                        type="text"
                        placeholder="Search subdomains or names..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-3 py-1.5 w-full text-xs border border-input-border rounded-lg outline-none font-medium focus:ring-2 focus:ring-black/10 placeholder:text-black/30"
                    />
                </div>
            </div>

            {/* Main Table */}
            <div className="overflow-x-auto border border-light-border rounded-lg">
                <table className="w-full text-xs min-w-max">
                    <thead>
                        <tr className="bg-neutral-50 border-b border-light-border text-left text-black/60 font-semibold uppercase tracking-wider text-[10px]">
                            <th className="px-4 py-3">Institute Name & Domain</th>
                            <th className="px-4 py-3">Subscribed Tier</th>
                            <th className="px-4 py-3">Resource License Cap (Seats)</th>
                            <th className="px-4 py-3">System Health</th>
                            <th className="px-4 py-3 text-right">Licensing Control</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-light-border bg-white text-black/70">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-black/30 font-medium">
                                    No institutes match your query.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((school, idx) => {
                                const students = Number(school.totalStudents || school.students || 0);
                                const details = getPlanDetails(students);
                                const status = school.schoolStatus || school.status || "INACTIVE";

                                // Quota calculations
                                const quotaPercent = Math.min(Math.round((students / details.cap) * 100), 100);

                                return (
                                    <tr key={school.schoolId} className="hover:bg-gray-50/40 transition">

                                        {/* Name & Domain */}
                                        <td className="px-4 py-3.5">
                                            <div>
                                                <span className="font-medium text-black text-sm block tracking-tight">
                                                    {school.schoolName}
                                                </span>
                                                <span className="text-xs text-black/40 font-medium flex items-center gap-1 mt-0.5 lowercase font-mono">
                                                    <Globe size={11} className="text-black/30 shrink-0" />
                                                    {school.schoolSlug ?? ""}.layernlooms.com
                                                </span>
                                            </div>
                                        </td>

                                        {/* Plan Badge */}
                                        <td className="px-4 py-3.5">
                                            <div className="flex flex-col gap-0.5">
                                                <span className={`inline-flex self-start px-2 py-0.5 rounded-full text-[10px] font-bold border ${details.bg}`}>
                                                    {details.name}
                                                </span>
                                                <span className="text-[10px] text-black/40 font-medium mt-0.5">Annually cycle</span>
                                            </div>
                                        </td>

                                        {/* Seat utilization */}
                                        <td className="px-4 py-3.5">
                                            <div className="space-y-1.5 max-w-[180px]">
                                                <div className="flex justify-between text-[10px] font-semibold text-black/60">
                                                    <span>{students} Seats active</span>
                                                    <span>{quotaPercent}% cap</span>
                                                </div>
                                                <div className="w-full bg-neutral-100 rounded-full h-1 overflow-hidden">
                                                    <div
                                                        className="bg-black h-1 rounded-full transition-all duration-300"
                                                        style={{ width: `${quotaPercent}%` }}
                                                    />
                                                </div>
                                                <div className="text-[9px] text-black/40 font-medium">Licensed Cap: {details.cap.toLocaleString()}</div>
                                            </div>
                                        </td>

                                        {/* Health */}
                                        <td className="px-4 py-3.5">
                                            {status === "ACTIVE" ? (
                                                <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-green-200">
                                                    <CheckCircle2 size={10} /> Active standing
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-red-200">
                                                    <ShieldAlert size={10} /> Suspended block
                                                </span>
                                            )}
                                        </td>

                                        {/* Controls */}
                                        <td className="px-4 py-3.5 text-right relative">
                                            <div className="flex justify-end gap-2">
                                                {/* Action Selector */}
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setActiveDropdownRow(activeDropdownRow === school.schoolId ? null : school.schoolId)}
                                                        className="h-8 px-2.5 rounded-lg border border-light-border bg-white text-xs font-semibold text-black/70 hover:text-black hover:bg-neutral-50 shadow-xs cursor-pointer transition flex items-center gap-1"
                                                    >
                                                        Actions <ChevronDown size={12} />
                                                    </button>

                                                    {/* Dropdown Menu */}
                                                    {activeDropdownRow === school.schoolId && (
                                                        <div className={`absolute right-0 w-40 bg-white border border-light-border rounded-lg shadow-lg z-30 py-1 text-left text-xs divide-y divide-gray-50 ${(idx >= 3 || idx === filtered.length - 1) ? "bottom-full mb-1.5 animate-in fade-in slide-in-from-bottom-2 duration-150" : "top-full mt-1.5 animate-in fade-in slide-in-from-top-2 duration-150"
                                                            }`}>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedSchoolForTier(school);
                                                                    setIsTierDrawerOpen(true);
                                                                    setActiveDropdownRow(null);
                                                                }}
                                                                className="w-full px-3 py-2 text-black/70 hover:text-black hover:bg-neutral-50 font-medium transition cursor-pointer flex items-center gap-2"
                                                            >
                                                                <Sliders size={12} /> Change Tier
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedSchoolForQuota(school);
                                                                    setIsQuotaDrawerOpen(true);
                                                                    setActiveDropdownRow(null);
                                                                }}
                                                                className="w-full px-3 py-2 text-black/70 hover:text-black hover:bg-neutral-50 font-medium transition cursor-pointer flex items-center gap-2"
                                                            >
                                                                <Sliders size={12} /> Override Quota
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    onUpdateStatus(school.schoolSlug ?? "", status === "ACTIVE" ? "SUSPENDED" : "ACTIVE");
                                                                    setActiveDropdownRow(null);
                                                                }}
                                                                className={`w-full px-3 py-2 hover:bg-neutral-50 font-semibold transition cursor-pointer flex items-center gap-2 ${status === "ACTIVE" ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"
                                                                    }`}
                                                            >
                                                                <Ban size={12} /> {status === "ACTIVE" ? "Suspend Access" : "Activate Access"}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* ── HIGH-END SLIDE-OVER DRAWER 1: CHANGE TIER ── */}
            <SaaSChangeTierDrawer
                school={selectedSchoolForTier}
                isOpen={isTierDrawerOpen}
                onClose={() => {
                    setIsTierDrawerOpen(false);
                    setSelectedSchoolForTier(null);
                }}
                onSave={onUpdateTier}
            />

            {/* ── HIGH-END SLIDE-OVER DRAWER 2: OVERRIDE QUOTAS ── */}
            <SaaSQuotaOverrideDrawer
                school={selectedSchoolForQuota}
                isOpen={isQuotaDrawerOpen}
                onClose={() => {
                    setIsQuotaDrawerOpen(false);
                    setSelectedSchoolForQuota(null);
                }}
                onSave={onOverrideQuotas}
            />

        </div>
    );
}
