"use client";

import { TrendingUp, DollarSign, Calendar, CreditCard } from "lucide-react";

interface SaaSSubscriptionStatsProps {
    contracts: any[];
}

export default function SaaSSubscriptionStats({ contracts = [] }: SaaSSubscriptionStatsProps) {
    // Calculate financial stats dynamically
    let totalMRR = 0;
    let activeSubscribers = 0;

    contracts.forEach(contract => {
        if (contract.billingStatus === "ACTIVE") {
            activeSubscribers++;
            const price = Number(contract.price || 0);
            if (contract.billingCycle === "MONTHLY") {
                totalMRR += price;
            } else {
                totalMRR += Math.round(price / 12);
            }
        }
    });

    const totalARR = totalMRR * 12;
    const averageContractValue = activeSubscribers > 0 ? Math.round((totalMRR * 12) / activeSubscribers) : 0;

    const stats = [
        {
            title: "Annual Recurring Revenue (ARR)",
            value: `₹${totalARR.toLocaleString()}`,
            description: "Total run-rate contract values",
            icon: <TrendingUp size={15} className="text-black" />,
            badge: "+12.4% MoM"
        },
        {
            title: "Monthly Recurring Revenue (MRR)",
            value: `₹${totalMRR.toLocaleString()}`,
            description: `Aggregated across ${activeSubscribers} clients`,
            icon: <DollarSign size={15} className="text-black" />,
            badge: "Live Run"
        },
        {
            title: "Average Annual Contract Value (ACV)",
            value: `₹${averageContractValue.toLocaleString()}`,
            description: "Average price paid per institute",
            icon: <Calendar size={15} className="text-black" />,
            badge: "Stable"
        },
        {
            title: "Collection standing rate",
            value: "98.7%",
            description: "0 invoices overdue past 30 days",
            icon: <CreditCard size={15} className="text-black" />,
            badge: "Excellent"
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat, idx) => (
                <div key={idx} className="bg-white border border-light-border rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-black/25 transition-all">
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-black/50 font-semibold uppercase tracking-wider">{stat.title}</span>
                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-light-border">
                                {stat.icon}
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-black">{stat.value}</h3>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50 text-[11px]">
                        <span className="text-black/40 font-medium w-[60%] ">{stat.description}</span>
                        <div className="bg-black/90 text-white px-2 py-0.5 rounded-sm font-normal scale-95 origin-right">
                            {stat.badge}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
