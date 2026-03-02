"use client";

import { StatItem } from "@/interfaces/interface";
import { CircleCheckBig, CircleQuestionMark, Gift, ShieldAlert, ShieldCheck, ShieldOff } from "lucide-react";

const subscriptionStats: StatItem[] = [
    {
        label: "Active Subscriptions",
        value: 842,
        percentage: 78,
        type: "active",
    },
    {
        label: "Expired Subscriptions",
        value: 124,
        percentage: 12,
        type: "expired",
    },
    {
        label: "Expiring in 7 Days",
        value: 36,
        type: "expiring",
        percentage: 2,
    },
    {
        label: "Free Trial Institutes",
        value: 58,
        percentage: 8,
        type: "free",
    },
    {
        label: "Expiring in 39 Days",
        value: 58,
        percentage: 8,
        type: "expiring",
    },
];

export default function SubscriptionStatus() {
    return (
        <div className="w-full bg-white rounded-2xl border border-light-border p-4">
            <div className="mb-4">
                <h2 className="text-lg">Subscription Health</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {subscriptionStats.map((stat) => {
                    const Icon = stat.type === "active" ? <ShieldCheck size={17} /> : stat.type === "expired" ? <ShieldOff size={17} /> : stat.type === "expiring" ? <CircleQuestionMark size={17} /> : <Gift size={17} />;
                    return (
                        <div key={stat.label} className="rounded-xl border border-light-border p-4">
                            <p className="text-xs text-black/50 mb-1">{stat.label}</p>

                            <div className="flex items-end justify-between">
                                <p className="text-2xl font-semibold">{stat.value}</p>

                                {stat.percentage !== undefined && (
                                    <span className={`text-xs px-2 py-1 rounded-md border border-light-border flex items-center gap-2 justify-center`}>
                                        {Icon}  {stat.percentage}%
                                    </span>
                                )}
                            </div>

                            {stat.helper && (
                                <p className="text-xs text-amber-600 mt-2">{stat.helper}</p>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}