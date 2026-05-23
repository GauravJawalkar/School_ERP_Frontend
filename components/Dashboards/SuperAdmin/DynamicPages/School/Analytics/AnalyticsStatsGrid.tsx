"use client";

import { TrendingUp, School, Users, GraduationCap, Sparkles } from "lucide-react";

interface AnalyticsStatsGridProps {
    totalSchools: number;
    activeSchools: number;
    totalStudents: number;
    totalStaff: number;
}

export default function AnalyticsStatsGrid({
    totalSchools = 0,
    activeSchools = 0,
    totalStudents = 0,
    totalStaff = 0,
}: AnalyticsStatsGridProps) {
    const activeRate = totalSchools > 0 ? Math.round((activeSchools / totalSchools) * 100) : 0;
    const avgStudentRatio = totalStaff > 0 ? (totalStudents / totalStaff).toFixed(1) : "0.0";

    const stats = [
        {
            title: "Total Registered Schools",
            value: totalSchools,
            description: "Onboarded institutions",
            change: "+12.4%",
            icon: <School className="w-5 h-5 text-black" />,
            badge: "MoM Growth"
        },
        {
            title: "Active Subscriptions",
            value: `${activeSchools} / ${totalSchools}`,
            description: `${activeRate}% active rate system-wide`,
            change: "Optimal",
            icon: <Sparkles className="w-5 h-5 text-black" />,
            badge: "Status"
        },
        {
            title: "Active Students",
            value: totalStudents.toLocaleString(),
            description: "Enrolled active pupils",
            change: "+8.2%",
            icon: <GraduationCap className="w-5 h-5 text-black" />,
            badge: "Active"
        },
        {
            title: "Staff & Teacher Ratio",
            value: `1 : ${avgStudentRatio}`,
            description: `Across ${totalStaff.toLocaleString()} teachers`,
            change: "Balanced",
            icon: <Users className="w-5 h-5 text-black" />,
            badge: "System Ratio"
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
                        <h3 className="text-2xl font-bold text-black tracking-tight">
                            {stat.value}
                        </h3>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50 text-[11px]">
                        <span className="text-black/40 font-medium">{stat.description}</span>
                        <div className="flex items-center gap-1 bg-black/90 text-white px-2 py-1 rounded-sm font-normal capitalize scale-95 origin-right">
                            {stat.change.startsWith("+") && <TrendingUp size={10} />}
                            {stat.change}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
