"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MapPin, Users, GraduationCap, CheckCircle2, ChevronRight, Ban } from "lucide-react";
import { ActiveSubscriptionsTableProps } from "@/interfaces/interface";

export default function ActiveSubscriptionsTable({ schools = [] }: ActiveSubscriptionsTableProps) {
    const [searchQuery, setSearchQuery] = useState("");

    // Calculate details dynamically based on school limits
    const getPlanBadgeStyle = (planName: string) => {
        if (!planName || planName === "No Active Plan") {
            return "bg-neutral-100 text-black border-neutral-200";
        }
        if (planName.toLowerCase().includes("premium") || planName.toLowerCase().includes("enterprise")) {
            return "bg-black text-white border-black/90";
        }
        return "bg-gray-50 text-black/60 border-light-border";
    };

    // Format billing dates cleanly relative to when they were created
    const getNextBillingDate = (renewalDateStr: string | Date | null | undefined, createdAtStr: string) => {
        if (renewalDateStr) {
            try {
                const date = new Date(renewalDateStr);
                return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
            } catch { }
        }
        try {
            const date = new Date(createdAtStr);
            date.setFullYear(date.getFullYear() + 1); // 1 year cycle
            return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        } catch {
            return "N/A";
        }
    };

    const filtered = schools.filter(s =>
        s.schoolName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-white border border-light-border rounded-xl p-5 shadow-xs space-y-4">

            {/* Table Header and Search */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h3 className="text-sm font-semibold text-black/80 uppercase tracking-wider mb-0.5">School Billing Registry</h3>
                    <p className="text-xs text-black/40">Listing details, quotas, and licensing for {schools.length} institutions</p>
                </div>

                <div className="relative min-w-xs">
                    <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-black/40" />
                    <input
                        type="text"
                        placeholder="Search schools by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-3 py-1.5 w-full text-xs border border-input-border rounded-lg outline-none font-medium focus:ring-2 focus:ring-black/10 placeholder:text-black/30"
                    />
                </div>
            </div>

            {/* Table wrapper */}
            <div className="overflow-x-auto border border-light-border rounded-lg">
                <table className="w-full text-xs min-w-max">
                    <thead>
                        <tr className="bg-neutral-50 border-b border-light-border text-left text-black/60 font-medium uppercase tracking-wider text-xs">
                            <th className="px-4 py-3">School Name</th>
                            <th className="px-4 py-3">Assigned Plan</th>
                            <th className="px-4 py-3 text-center">Student Quota</th>
                            <th className="px-4 py-3 text-center">Staff Quota</th>
                            <th className="px-4 py-3">Recurring Price</th>
                            <th className="px-4 py-3">Next Renewal</th>
                            <th className="px-4 py-3">Billing Status</th>
                            <th className="px-4 py-3 text-right">Visit</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-light-border bg-white text-black/70">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-4 py-8 text-center text-black/30 font-medium">
                                    No active school subscriptions found matching query.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((school) => {
                                const students = Number(school.totalStudents || school.students || 0);
                                const staff = Number(school.totalStaff || school.staff || 0);
                                const planName = school.planName || "No Active Plan";
                                const planBadge = getPlanBadgeStyle(planName);
                                const price = school.planPrice ? `₹${Number(school.planPrice).toLocaleString()}` : "₹0";
                                const cycleLabel = school.billingCycle === "ANNUALLY" ? "/ yr" : school.billingCycle === "MONTHLY" ? "/ mo" : "";
                                const city = school.schoolInfo?.address_details?.city || school.city || "N/A";
                                const renewalDate = getNextBillingDate(school.renewalDate, school.createdAt);
                                const subStatus = school.subscriptionStatus || "INACTIVE";

                                return (
                                    <tr key={school.schoolId + Math.floor(Math.random() * 10000)} className="hover:bg-gray-50/40 transition">

                                        {/* School & City */}
                                        <td className="px-4 py-3.5">
                                            <div>
                                                <span className="font-medium text-black text-sm block tracking-tight">
                                                    {school.schoolName}
                                                </span>
                                                <span className="text-xs text-black/40 font-medium uppercase tracking-wider flex items-center gap-0.5 mt-0.5">
                                                    <MapPin size={9} /> {city}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Plan Name */}
                                        <td className="px-4 py-3.5">
                                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${planBadge}`}>
                                                {planName}
                                            </span>
                                        </td>

                                        {/* Students */}
                                        <td className="px-4 py-3.5 text-center">
                                            <div className="flex items-center justify-center gap-1 font-semibold text-black text-sm">
                                                <GraduationCap size={14} className="text-black/55" />
                                                {students.toLocaleString()}
                                            </div>
                                        </td>

                                        {/* Staff */}
                                        <td className="px-4 py-3.5 text-center">
                                            <div className="flex items-center justify-center gap-1 font-semibold text-black text-sm">
                                                <Users size={14} className="text-black/55" />
                                                {staff}
                                            </div>
                                        </td>

                                        {/* Price */}
                                        <td className="px-4 py-3.5">
                                            <span className="font-semibold text-sm text-black">
                                                {price}
                                            </span>
                                            {cycleLabel && (
                                                <span className="text-xs text-black/40 font-medium ml-1">{cycleLabel}</span>
                                            )}
                                        </td>

                                        {/* Next Renewal */}
                                        <td className="px-4 py-3.5 font-medium text-black/80">
                                            {renewalDate}
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3.5">
                                            {["ACTIVE", "TRIALING"].includes(subStatus) ? (
                                                <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-green-200">
                                                    <CheckCircle2 size={10} /> Good Standing
                                                </span>
                                            ) : subStatus === "PAST_DUE" ? (
                                                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-amber-200">
                                                    <CheckCircle2 size={10} /> Grace Period
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-red-200">
                                                    <Ban size={10} /> Suspended
                                                </span>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3.5 text-right">
                                            <Link
                                                href={`/schools/${school?.schoolSlug ?? '/'}`}
                                                className="h-7 w-7 rounded-md border border-light-border bg-white flex items-center justify-center text-black/60 hover:text-black hover:bg-neutral-50 shadow-xs cursor-pointer transition"
                                            >
                                                <ChevronRight size={14} />
                                            </Link>
                                        </td>

                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
