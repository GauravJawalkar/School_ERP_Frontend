"use client"

import React from "react"
import { CreditCard, ArrowUpRight, CheckCircle2, AlertCircle } from "lucide-react"

interface SchoolSubscriptionSectionProps {
    totalStudents: number
    totalStaff: number
}

// Custom mock invoice data for premium appearance
const INVOICES = [
    { id: "INV-2026-004", date: "Apr 15, 2026", amount: "₹45,000", status: "Paid", type: "Annual Renewal" },
    { id: "INV-2025-004", date: "Apr 15, 2025", amount: "₹45,000", status: "Paid", type: "Annual Renewal" },
    { id: "INV-2024-001", date: "Apr 18, 2024", amount: "₹15,000", status: "Paid", type: "Onboarding & Setups" },
]

export default function SchoolSubscriptionSection({
    totalStudents = 0,
    totalStaff = 0,
}: SchoolSubscriptionSectionProps) {
    // Generate quota percentages (using standard caps of 2500 students and 150 staff)
    const studentCapacity = 2500
    const staffCapacity = 150

    const studentPercent = Math.min(Math.round((totalStudents / studentCapacity) * 100), 100)
    const staffPercent = Math.min(Math.round((totalStaff / staffCapacity) * 100), 100)

    return (
        <div className="border border-light-border bg-white rounded-xl p-5 shadow-xs">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-light-border mb-5">
                <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-md bg-black flex items-center justify-center text-white">
                        <CreditCard size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-black">Subscription & Billing</h3>
                        <p className="text-xs text-black/50">Plan limits, tiers, and invoice tracking</p>
                    </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-black text-white">
                    Premium Growth Plan
                </span>
            </div>

            {/* Plan Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="border border-light-border rounded-lg p-3 bg-gray-50/50">
                    <p className="text-[11px] font-medium text-black/40 uppercase tracking-wider">Pricing Tier</p>
                    <p className="text-base font-semibold text-black mt-1">₹45,000 <span className="text-xs font-normal text-black/50">/ year</span></p>
                    <p className="text-xs text-black/50 mt-0.5">Flat annual subscription</p>
                </div>
                <div className="border border-light-border rounded-lg p-3 bg-gray-50/50">
                    <p className="text-[11px] font-medium text-black/40 uppercase tracking-wider">Next Billing Date</p>
                    <p className="text-base font-semibold text-black mt-1">Apr 15, 2027</p>
                    <p className="text-xs text-green-600 mt-0.5 flex items-center gap-1 font-medium">
                        <CheckCircle2 size={11} /> Auto-renew Active
                    </p>
                </div>
                <div className="border border-light-border rounded-lg p-3 bg-gray-50/50">
                    <p className="text-[11px] font-medium text-black/40 uppercase tracking-wider">Billing Status</p>
                    <p className="text-base font-semibold text-green-700 mt-1">Good Standing</p>
                    <p className="text-xs text-black/50 mt-0.5">Last payment Apr 15, 2026</p>
                </div>
            </div>

            {/* Quota Limits / Capacity Progress Bars */}
            <div className="mb-6 space-y-4">
                <h4 className="text-xs font-semibold text-black/80 uppercase tracking-wider">Resource Allocation Quotas</h4>
                
                {/* Students bar */}
                <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-black/60 font-semibold">
                        <span>Student Licenses</span>
                        <span>{totalStudents.toLocaleString()} / {studentCapacity.toLocaleString()} ({studentPercent}%)</span>
                    </div>
                    <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                            className="bg-black h-1.5 rounded-full transition-all duration-500" 
                            style={{ width: `${studentPercent}%` }} 
                        />
                    </div>
                </div>

                {/* Staff bar */}
                <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-black/60 font-semibold">
                        <span>Staff/Teacher Accounts</span>
                        <span>{totalStaff} / {staffCapacity} ({staffPercent}%)</span>
                    </div>
                    <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                            className="bg-black h-1.5 rounded-full transition-all duration-500" 
                            style={{ width: `${staffPercent}%` }} 
                        />
                    </div>
                </div>
            </div>

            {/* Invoice Table */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-semibold text-black/80 uppercase tracking-wider">Payment Transaction History</h4>
                    <span className="text-[11px] text-black/50 flex items-center gap-0.5 hover:text-black cursor-pointer transition">
                        View All Invoices <ArrowUpRight size={12} />
                    </span>
                </div>
                <div className="overflow-x-auto border border-light-border rounded-lg">
                    <table className="text-xs w-full min-w-max">
                        <thead>
                            <tr className="bg-neutral-50 border-b border-light-border text-left text-black/60">
                                <th className="px-3.5 py-2 font-medium">Invoice ID</th>
                                <th className="px-3.5 py-2 font-medium">Type</th>
                                <th className="px-3.5 py-2 font-medium">Billing Date</th>
                                <th className="px-3.5 py-2 font-medium">Amount</th>
                                <th className="px-3.5 py-2 font-medium text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-light-border bg-white text-black/70">
                            {INVOICES.map((inv) => (
                                <tr key={inv.id} className="hover:bg-gray-50/50 transition">
                                    <td className="px-3.5 py-2.5 font-semibold text-black/85">{inv.id}</td>
                                    <td className="px-3.5 py-2.5 text-black/50">{inv.type}</td>
                                    <td className="px-3.5 py-2.5">{inv.date}</td>
                                    <td className="px-3.5 py-2.5 font-medium">{inv.amount}</td>
                                    <td className="px-3.5 py-2.5 text-right">
                                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-medium border border-green-200">
                                            {inv.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
