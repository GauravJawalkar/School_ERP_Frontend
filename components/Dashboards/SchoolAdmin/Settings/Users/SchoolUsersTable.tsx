"use client";

import { useState } from "react";
import { Search, Mail, Shield, Circle } from "lucide-react";

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

interface SchoolUsersTableProps {
    users: User[];
    onToggleActive: (id: number, currentStatus: boolean) => void;
}

export default function SchoolUsersTable({
    users = [],
    onToggleActive
}: SchoolUsersTableProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");

    // Search and filter logic
    const filteredUsers = users.filter(user => {
        const matchesSearch =
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesRole = roleFilter === "ALL" || user.roleName === roleFilter;

        return matchesSearch && matchesRole;
    });

    const getRoleBadge = (role: string) => {
        switch (role) {
            case "SUPER_ADMIN":
                return "bg-black text-white border-black font-semibold";
            case "SCHOOL_ADMIN":
                return "bg-neutral-900 text-white border-neutral-950 font-semibold";
            case "TEACHER":
                return "bg-neutral-100 text-black border-neutral-200 font-medium";
            case "ACCOUNTANT":
                return "bg-gray-100 text-black border-gray-250 font-medium";
            case "LIBRARIAN":
                return "bg-slate-100 text-slate-700 border-slate-200 font-medium";
            case "RECEPTIONIST":
                return "bg-stone-100 text-stone-700 border-stone-200 font-medium";
            case "TRANSPORT_MANAGER":
                return "bg-amber-50 text-amber-800 border-amber-250 font-medium";
            case "STUDENT":
                return "bg-violet-50 text-violet-800 border-violet-200 font-bold tracking-normal";
            case "PARENT":
                return "bg-emerald-50 text-emerald-800 border-emerald-250 font-medium";
            default:
                return "bg-neutral-50 text-neutral-600 border-neutral-200";
        }
    };

    return (
        <div className="bg-white border border-light-border rounded-xl shadow-xs overflow-hidden">

            {/* Table Filters */}
            <div className="p-4 border-b border-light-border flex flex-col sm:flex-row gap-3 items-center justify-between bg-gray-50/20">
                <div className="relative w-full sm:w-80">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
                    <input
                        type="text"
                        placeholder="Search by name, email or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border border-input-border text-xs pl-9 pr-3 py-2 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                    <span className="text-[10px] font-bold text-black/40 uppercase tracking-wider hidden sm:inline">Role Group:</span>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="border border-input-border text-xs px-2.5 py-1.5 outline-none rounded-lg focus:ring-2 focus:ring-black/10 bg-white font-medium cursor-pointer"
                    >
                        <option value="ALL">All Roles</option>
                        <option value="SUPER_ADMIN">Platform Super Admin</option>
                        <option value="SCHOOL_ADMIN">School Admin</option>
                        <option value="TEACHER">Educator (Teacher)</option>
                        <option value="ACCOUNTANT">Accountant</option>
                        <option value="LIBRARIAN">Librarian</option>
                        <option value="RECEPTIONIST">Receptionist</option>
                        <option value="TRANSPORT_MANAGER">Transport Manager</option>
                        <option value="STUDENT">Active Student</option>
                        <option value="PARENT">Parent / Guardian</option>
                    </select>
                </div>
            </div>

            {/* Table Core */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-light-border bg-gray-50/50 text-[10px] font-bold text-black/50 uppercase tracking-wider">
                            <th className="p-4">User profile details</th>
                            <th className="p-4">Employee ID</th>
                            <th className="p-4">Access Role & Designation</th>
                            <th className="p-4">Login status</th>
                            <th className="p-4 text-right">Access Controls</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-light-border text-xs">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-neutral-50/50 transition duration-100">

                                    {/* Column 1: Profile Details */}
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center border border-light-border">
                                                {user.firstName[0]}{user.lastName[0]}
                                            </div>
                                            <div>
                                                <span className="font-bold text-black block hover:underline cursor-pointer">
                                                    {user.firstName} {user.lastName}
                                                </span>
                                                <div className="flex items-center gap-2.5 text-[10px] text-black/40 font-medium mt-0.5">
                                                    <span className="flex items-center gap-0.5">
                                                        <Mail size={10} />
                                                        {user.email || "No Email"}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{user.phone || "No Phone"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Column 2: Employee Code */}
                                    <td className="p-4">
                                        <span className="font-mono font-bold text-black/60 bg-gray-50 border border-light-border px-2 py-0.5 rounded-md text-[10px]">
                                            {user.employeeCode}
                                        </span>
                                    </td>

                                    {/* Column 3: Designation & Role */}
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[9px] px-2 py-0.5 font-bold uppercase border rounded-md tracking-wider ${getRoleBadge(user.roleName)}`}>
                                                {user.roleName}
                                            </span>
                                            <span className="text-[11px] text-black/55 font-medium">
                                                {user.designation}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Column 4: Login Status */}
                                    <td className="p-4">
                                        <div className="flex items-center gap-1.5">
                                            {user.isActive ? (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                                                    <Circle size={6} className="fill-green-600 text-green-600" />
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                                                    <Circle size={6} className="fill-red-600 text-red-600 animate-pulse" />
                                                    Suspended
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Column 5: Controls */}
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            {user.isActive ? (
                                                <button
                                                    onClick={() => onToggleActive(user.id, true)}
                                                    title="Suspend Credentials"
                                                    className="h-8 px-2.5 rounded-lg border border-red-100 bg-red-50/20 text-red-600 hover:bg-red-50 flex items-center gap-1 text-xs font-bold hover:text-red-700 transition cursor-pointer"
                                                >
                                                    Suspend
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => onToggleActive(user.id, false)}
                                                    title="Restore Credentials"
                                                    className="h-8 px-2.5 rounded-lg border border-green-100 bg-green-50/20 text-green-600 hover:bg-green-50 flex items-center gap-1 text-xs font-bold hover:text-green-700 transition cursor-pointer"
                                                >
                                                    Activate
                                                </button>
                                            )}
                                        </div>
                                    </td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-black/40">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Shield size={24} className="text-black/20" />
                                        <p className="font-semibold text-xs">No dashboard user credentials match your parameters</p>
                                        <p className="text-[10px] text-black/30">Refine the search term or role filter group and try again</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination / Table Footer summary */}
            <div className="p-4 border-t border-light-border bg-gray-50/30 flex items-center justify-between text-[11px] font-medium text-black/45">
                <span>Showing {filteredUsers.length} of {users.length} accounts configured</span>
                <span>Security Sandbox Mode Active</span>
            </div>

        </div>
    );
}
