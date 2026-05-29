"use client";

import { Users, GraduationCap, DollarSign, ShieldAlert } from "lucide-react";

interface User {
    id: number;
    firstName: string;
    lastName: string;
    employeeCode: string;
    designation: string;
    email?: string;
    phone?: string;
    roleName: string;
    isActive: boolean;
}

interface SchoolUsersStatsProps {
    users: User[];
}

export default function SchoolUsersStats({ users = [] }: SchoolUsersStatsProps) {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.isActive).length;
    const teachersCount = users.filter(u => u.roleName === "TEACHER").length;
    const financeCount = users.filter(u => u.roleName === "ACCOUNTANT").length;
    const suspendedCount = users.filter(u => !u.isActive).length;

    const stats = [
        {
            title: "Authorized Accounts",
            value: totalUsers.toString(),
            description: `${activeUsers} active dashboard keys`,
            icon: <Users size={16} className="text-black" />,
            bg: "bg-white border-light-border"
        },
        {
            title: "Teaching Staff",
            value: teachersCount.toString(),
            description: "Managed academic educators",
            icon: <GraduationCap size={16} className="text-black" />,
            bg: "bg-white border-light-border"
        },
        {
            title: "Finance & Accounts",
            value: financeCount.toString(),
            description: "Authorized transaction managers",
            icon: <DollarSign size={16} className="text-black" />,
            bg: "bg-white border-light-border"
        },
        {
            title: "Suspended Logins",
            value: suspendedCount.toString(),
            description: "Blocked system credentials",
            icon: <ShieldAlert size={16} className="text-red-600" />,
            bg: suspendedCount > 0 ? "bg-red-50/10 border-red-100" : "bg-white border-light-border"
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat, idx) => (
                <div key={idx} className={`border rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-black/25 transition-all ${stat.bg}`}>
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] text-black/50 font-bold uppercase tracking-wider">{stat.title}</span>
                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-light-border">
                                {stat.icon}
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-black tracking-tight">{stat.value}</h3>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-50 text-[11px] text-black/40 font-medium">
                        {stat.description}
                    </div>
                </div>
            ))}
        </div>
    );
}
