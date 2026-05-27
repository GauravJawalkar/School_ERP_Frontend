"use client";

import { DollarSign, AlertCircle, FileText, CheckCircle2 } from "lucide-react";

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

interface SaaSBillingStatsProps {
    transactions: Transaction[];
}

export default function SaaSBillingStats({ transactions = [] }: SaaSBillingStatsProps) {
    // Dynamically calculate metrics
    let settledAmount = 0;
    let pendingAmount = 0;
    let successfulCount = 0;
    let totalCount = transactions.length;

    transactions.forEach(tx => {
        if (tx.status === "PAID") {
            settledAmount += tx.amount;
            successfulCount++;
        } else if (tx.status === "PENDING" || tx.status === "UNPAID") {
            pendingAmount += tx.amount;
        }
    });

    const collectionRate = totalCount > 0 ? Math.round((successfulCount / totalCount) * 100) : 100;

    const stats = [
        {
            title: "Total Settled Revenue",
            value: `₹${settledAmount.toLocaleString()}`,
            description: "Platform payments cleared & settled",
            icon: <DollarSign size={15} className="text-green-600" />,
            bg: "border-green-100 bg-green-50/10"
        },
        {
            title: "Outstanding Receivables",
            value: `₹${pendingAmount.toLocaleString()}`,
            description: "Pending or unpaid client invoices",
            icon: <AlertCircle size={15} className="text-yellow-600" />,
            bg: "border-yellow-100 bg-yellow-50/10"
        },
        {
            title: "Issued Invoice Volume",
            value: totalCount.toString(),
            description: "Total invoice count generated",
            icon: <FileText size={15} className="text-black/70" />,
            bg: "border-light-border bg-white"
        },
        {
            title: "Billing Collection Rate",
            value: `${collectionRate}%`,
            description: "Ratio of invoices paid in full",
            icon: <CheckCircle2 size={15} className="text-black" />,
            bg: "border-light-border bg-white"
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat, idx) => (
                <div key={idx} className={`border rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-black/25 transition-all ${stat.bg}`}>
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] text-black/50 font-bold uppercase tracking-wider">{stat.title}</span>
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-light-border">
                                {stat.icon}
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-black tracking-tight">{stat.value}</h3>
                    </div>
                    <div className="mt-4 pt-3 border-t border-light-border/20 text-[11px] text-black/40 font-medium">
                        {stat.description}
                    </div>
                </div>
            ))}
        </div>
    );
}
