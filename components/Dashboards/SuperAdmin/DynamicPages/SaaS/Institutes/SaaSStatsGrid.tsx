"use client";

import { Activity, ShieldAlert, Users, Landmark } from "lucide-react";

interface SaaSStatsGridProps {
    schools: any[];
}

export default function SaaSStatsGrid({ schools = [] }: SaaSStatsGridProps) {
    const activeSchools = schools.filter(s => s.schoolStatus === "ACTIVE" || s.status === "ACTIVE").length;
    const suspendedSchools = schools.length - activeSchools;
    
    // Calculate total student licenses allocated vs theoretical limits
    let totalStudentsAllocated = 0;
    let totalCap = 0;

    schools.forEach(school => {
        const students = Number(school.totalStudents || school.students || 0);
        totalStudentsAllocated += students;
        
        if (students > 2500) {
            totalCap += 10000; // Enterprise threshold assumption
        } else if (students > 500) {
            totalCap += 2500; // Premium cap
        } else {
            totalCap += 500; // Basic cap
        }
    });

    const licenseUtilizationPercent = totalCap > 0 ? Math.round((totalStudentsAllocated / totalCap) * 100) : 0;

    const stats = [
        {
            title: "Managed Institutes",
            value: schools.length.toString(),
            description: `${activeSchools} active, ${suspendedSchools} suspended`,
            icon: <Landmark size={15} className="text-black" />,
            badge: "SaaS Scale"
        },
        {
            title: "Total Account Seats",
            value: totalStudentsAllocated.toLocaleString(),
            description: `Utilizing ${licenseUtilizationPercent}% of active caps`,
            icon: <Users size={15} className="text-black" />,
            badge: `${licenseUtilizationPercent}% Utilization`
        },
        {
            title: "Platform Health",
            value: "99.98%",
            description: "All cluster systems operational",
            icon: <Activity size={15} className="text-black" />,
            badge: "Normal"
        },
        {
            title: "Licensing Risks",
            value: suspendedSchools > 0 ? `${suspendedSchools} Suspended` : "0 Flags",
            description: suspendedSchools > 0 ? "Institutes locked for delinquent payments" : "All accounts in good standing",
            icon: <ShieldAlert size={15} className="text-black" />,
            badge: "Risk Audit"
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
                        <h3 className="text-2xl font-bold text-black tracking-tight">{stat.value}</h3>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50 text-[11px]">
                        <span className="text-black/40 font-medium">{stat.description}</span>
                        <div className="bg-black/90 text-white px-2 py-0.5 rounded-sm font-normal scale-95 origin-right">
                            {stat.badge}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
