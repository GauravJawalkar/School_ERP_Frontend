"use client";

import { Calendar, CalendarDays, CheckCircle2, Clock } from "lucide-react";

export interface AcademicYear {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

interface AcademicYearStatsProps {
    years: AcademicYear[];
}

export default function AcademicYearStats({ years = [] }: AcademicYearStatsProps) {
    const totalYears = years.length;
    const activeYear = years.find((y) => y.isActive);
    const activeYearName = activeYear ? activeYear.name : "None Configured";

    // Format Date beautifully
    const formatDate = (dateStr: string) => {
        if (!dateStr) return "N/A";
        try {
            return new Date(dateStr).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        } catch {
            return dateStr;
        }
    };

    const activeRangeStr = activeYear
        ? `${formatDate(activeYear.startDate)} - ${formatDate(activeYear.endDate)}`
        : "No active calendar session";

    const stats = [
        {
            title: "Configured Calendar Cycles",
            value: totalYears.toString(),
            description: "Registered academic timeline sessions",
            icon: <CalendarDays size={16} className="text-black" />,
            bg: "bg-white border-light-border"
        },
        {
            title: "Active Operational Session",
            value: activeYearName,
            description: "Default scope for active rosters",
            icon: <CheckCircle2 size={16} className={activeYear ? "text-emerald-600" : "text-black"} />,
            bg: activeYear ? "bg-emerald-50/10 border-emerald-100" : "bg-white border-light-border"
        },
        {
            title: "Active Session Span",
            value: activeYear ? activeYear.startDate.split("-")[0] + " - " + activeYear.endDate.split("-")[0] : "N/A",
            description: activeRangeStr,
            icon: <Clock size={16} className="text-black" />,
            bg: "bg-white border-light-border"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {stats.map((stat, idx) => (
                <div key={idx} className={`border rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-black/25 transition-all ${stat.bg}`}>
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] text-black/50 font-bold uppercase tracking-wider">{stat.title}</span>
                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-light-border">
                                {stat.icon}
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-black tracking-tight">{stat.value}</h3>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-50 text-[11px] text-black/40 font-medium">
                        {stat.description}
                    </div>
                </div>
            ))}
        </div>
    );
}
