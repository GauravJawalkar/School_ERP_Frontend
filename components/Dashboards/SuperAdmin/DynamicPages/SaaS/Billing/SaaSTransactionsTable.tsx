"use client";

import { useState } from "react";
import { Search, Globe, FileText, CheckCircle2, ShieldAlert, AlertCircle, Mail, RotateCw } from "lucide-react";

interface Transaction {
    invoiceId: string;
    schoolName: string;
    schoolSlug: string;
    amount: number;
    paymentMethod: string;
    status: string;
    invoiceDate: string;
    dueDate: string;
}

interface SaaSTransactionsTableProps {
    transactions: Transaction[];
    onReconcile: (invoiceId: string) => void;
    onResendInvoice: (invoiceId: string, schoolName: string) => void;
}

export default function SaaSTransactionsTable({
    transactions = [],
    onReconcile,
    onResendInvoice
}: SaaSTransactionsTableProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filtered = transactions.filter(tx => 
        tx.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.invoiceId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusPill = (status: string) => {
        switch (status) {
            case "PAID":
                return (
                    <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-green-200">
                        <CheckCircle2 size={10} /> Cleared & Settled
                    </span>
                );
            case "UNPAID":
            case "PENDING":
                return (
                    <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-yellow-200">
                        <AlertCircle size={10} /> Outstanding
                    </span>
                );
            case "FAILED":
            default:
                return (
                    <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-red-200">
                        <ShieldAlert size={10} /> Failed Payment
                    </span>
                );
        }
    };

    return (
        <div className="bg-white border border-light-border rounded-xl p-5 shadow-xs space-y-4">
            
            {/* Header and Search */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h3 className="text-sm font-semibold text-black/80 uppercase tracking-wider mb-0.5">Global Statement Ledger</h3>
                    <p className="text-xs text-black/40">Audit payments, issue statements, and manage account balances</p>
                </div>
                
                <div className="relative min-w-xs">
                    <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-black/40" />
                    <input
                        type="text"
                        placeholder="Search invoice ID or school..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-3 py-1.5 w-full text-xs border border-input-border rounded-lg outline-none font-medium focus:ring-2 focus:ring-black/10 placeholder:text-black/30"
                    />
                </div>
            </div>

            {/* Transactions table */}
            <div className="overflow-x-auto border border-light-border rounded-lg">
                <table className="w-full text-xs min-w-max">
                    <thead>
                        <tr className="bg-neutral-50 border-b border-light-border text-left text-black/60 font-semibold uppercase tracking-wider text-[10px]">
                            <th className="px-4 py-3">Invoice ID / Date</th>
                            <th className="px-4 py-3">Client Institute</th>
                            <th className="px-4 py-3">Statement Value</th>
                            <th className="px-4 py-3">Gateway Method</th>
                            <th className="px-4 py-3">Due Milestone</th>
                            <th className="px-4 py-3">Settlement Health</th>
                            <th className="px-4 py-3 text-right">Reconcile Controls</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-light-border bg-white text-black/70">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-8 text-center text-black/30 font-medium">
                                    No transaction logs match your query parameters.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((tx) => {
                                const formattedDate = new Date(tx.invoiceDate).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric"
                                });
                                const formattedDueDate = new Date(tx.dueDate).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric"
                                });

                                return (
                                    <tr key={tx.invoiceId} className="hover:bg-gray-50/40 transition">
                                        
                                        {/* Invoice ID & Date */}
                                        <td className="px-4 py-3.5">
                                            <div className="space-y-0.5">
                                                <span className="font-bold text-black flex items-center gap-1 font-mono uppercase tracking-tight">
                                                    <FileText size={11} className="text-black/30" />
                                                    {tx.invoiceId}
                                                </span>
                                                <span className="text-[10px] text-black/40 font-medium block">
                                                    Issued: {formattedDate}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Client school */}
                                        <td className="px-4 py-3.5">
                                            <div>
                                                <span className="font-bold text-black text-sm block tracking-tight">
                                                    {tx.schoolName}
                                                </span>
                                                <span className="text-xs text-black/40 font-medium flex items-center gap-1 mt-0.5 lowercase font-mono">
                                                    <Globe size={11} className="text-black/30 shrink-0" />
                                                    {tx.schoolSlug}.layernlooms.com
                                                </span>
                                            </div>
                                        </td>

                                        {/* Amount */}
                                        <td className="px-4 py-3.5">
                                            <span className="font-bold text-sm text-black">
                                                ₹{tx.amount.toLocaleString()}
                                            </span>
                                        </td>

                                        {/* Method */}
                                        <td className="px-4 py-3.5">
                                            <span className="font-semibold text-black/60 capitalize font-mono text-[10px] border border-light-border bg-gray-50/50 px-2 py-0.5 rounded-sm">
                                                {tx.paymentMethod.replace("_", " ").toLowerCase()}
                                            </span>
                                        </td>

                                        {/* Due Milestone */}
                                        <td className="px-4 py-3.5">
                                            <span className="font-medium text-black/80">{formattedDueDate}</span>
                                        </td>

                                        {/* Health */}
                                        <td className="px-4 py-3.5">
                                            {getStatusPill(tx.status)}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3.5 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                <button
                                                    type="button"
                                                    title="Resend Statement Email"
                                                    onClick={() => onResendInvoice(tx.invoiceId, tx.schoolName)}
                                                    className="h-8 w-8 rounded-lg border border-light-border bg-white flex items-center justify-center text-black/60 hover:text-black hover:bg-neutral-50 shadow-xs cursor-pointer transition"
                                                >
                                                    <Mail size={13} />
                                                </button>
                                                {tx.status !== "PAID" && (
                                                    <button
                                                        type="button"
                                                        title="Mark as Settled"
                                                        onClick={() => onReconcile(tx.invoiceId)}
                                                        className="h-8 w-8 rounded-lg border border-green-100 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 flex items-center justify-center shadow-xs cursor-pointer transition"
                                                    >
                                                        <RotateCw size={13} />
                                                    </button>
                                                )}
                                            </div>
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
