"use client";

import React, { useState } from "react";
import { Search, Edit, Trash2, CheckCircle2, XCircle, ShieldAlert, Award } from "lucide-react";
import TableActionMenu from "@/components/Commons/TableActionMenu";
import { Action } from "@/interfaces/interface";
import { usePermission } from "@/hooks/usePermission";

interface StaffMember {
    id: number;
    userId: string;
    employeeCode: string;
    firstName: string;
    lastName: string;
    designation: string;
    department: string;
    joiningDate: string;
    salaryBasic: string;
    bankDetails?: any;
    email: string;
    phone: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    isActive: boolean;
    roleName: string;
}

interface StaffTableProps {
    staff: StaffMember[];
    onEdit: (staff: StaffMember) => void;
    onDelete: (staffId: number) => void;
    onToggleStatus: (userId: string, isActive: boolean) => void;
}

export default function StaffTable({
    staff = [],
    onEdit,
    onDelete,
    onToggleStatus
}: StaffTableProps) {
    const { can } = usePermission();
    const canUpdate = can("staff.update");
    const canDelete = can("staff.delete");

    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("ALL");

    // Extract all unique roles present in the staff registry dynamically
    const rolesList = Array.from(new Set(staff.map((s) => s.roleName))).filter(Boolean);

    // Search and role filtering
    const filteredStaff = staff.filter((member) => {
        const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
        const matchesSearch =
            fullName.includes(searchQuery.toLowerCase()) ||
            member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.phone.includes(searchQuery) ||
            member.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.roleName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRole = roleFilter === "ALL" || member.roleName === roleFilter;

        return matchesSearch && matchesRole;
    });

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
            });
        } catch {
            return dateStr;
        }
    };

    const formatCurrency = (amount: string | number) => {
        try {
            const num = typeof amount === "string" ? parseFloat(amount) : amount;
            return new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0
            }).format(num);
        } catch {
            return `₹${amount}`;
        }
    };

    const getInitials = (first: string, last: string) => {
        return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    };

    return (
        <div className="bg-white border border-light-border rounded-xl shadow-xs overflow-hidden">
            {/* Filters Header */}
            <div className="p-4 border-b border-light-border flex flex-col md:flex-row gap-3 items-center justify-between bg-gray-50/20">
                {/* Search */}
                <div className="relative w-full md:w-80">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
                    <input
                        type="text"
                        placeholder="Search staff by name, code, dept..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border border-input-border text-xs pl-9 pr-3 py-2 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white"
                    />
                </div>

                {/* Filters Tab */}
                <div className="flex items-center gap-1 overflow-x-auto slim-scrollbar w-full md:w-auto self-start md:self-auto pb-1 md:pb-0">
                    <button
                        onClick={() => setRoleFilter("ALL")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                            roleFilter === "ALL"
                                ? "bg-black text-white"
                                : "bg-white text-black/55 hover:bg-neutral-55 hover:text-black border border-light-border"
                        }`}
                    >
                        All Staff
                    </button>
                    {rolesList.map((role) => (
                        <button
                            key={role}
                            onClick={() => setRoleFilter(role)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                                roleFilter === role
                                    ? "bg-black text-white"
                                    : "bg-white text-black/55 hover:bg-neutral-55 hover:text-black border border-light-border"
                            }`}
                        >
                            {role.replace(/_/g, " ")}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-light-border bg-gray-50/50 text-[10px] font-bold text-black/50 uppercase tracking-wider">
                            <th className="p-4">Staff Member</th>
                            <th className="p-4">Contact Info</th>
                            <th className="p-4">Role & Placement</th>
                            <th className="p-4">Joining & Compensation</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-light-border text-xs">
                        {filteredStaff.map((member) => {
                            const actions: Action[] = [];
                            if (canUpdate) {
                                actions.push({
                                    label: "Modify Profile",
                                    icon: <Edit size={14} />,
                                    onClick: () => onEdit(member)
                                });
                                actions.push({
                                    label: member.isActive ? "Deactivate Access" : "Activate Access",
                                    icon: member.isActive ? <XCircle size={14} /> : <CheckCircle2 size={14} />,
                                    onClick: () => onToggleStatus(member.userId, !member.isActive),
                                    danger: member.isActive
                                });
                            }
                            if (canDelete) {
                                actions.push({
                                    label: "Permanently Delete",
                                    icon: <Trash2 size={14} />,
                                    onClick: () => onDelete(member.id),
                                    danger: true
                                });
                            }

                            return (
                                <tr key={member.userId} className="hover:bg-neutral-50/50 transition duration-100">
                                    {/* Avatar & Name */}
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                                                {getInitials(member.firstName, member.lastName)}
                                            </div>
                                            <div>
                                                <span className="font-bold text-black block hover:underline cursor-pointer" onClick={() => onEdit(member)}>
                                                    {member.firstName} {member.lastName}
                                                </span>
                                                <span className="text-[10px] text-black/55 font-medium block mt-0.5">
                                                    Code: {member.employeeCode}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Contact */}
                                    <td className="p-4">
                                        <div className="space-y-0.5 text-black/70 font-medium">
                                            <span className="block">{member.email}</span>
                                            <span className="text-[10px] text-black/40 block">{member.phone}</span>
                                        </div>
                                    </td>

                                    {/* Role & Designation */}
                                    <td className="p-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5">
                                                <Award size={12} className="text-black/55" />
                                                <span className="text-[10px] font-bold text-black uppercase tracking-wider">
                                                    {member.roleName.replace(/_/g, " ")}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-black/55 font-medium block">
                                                {member.designation} • {member.department || "General"}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Joined & Salary */}
                                    <td className="p-4">
                                        <div className="text-black/75">
                                            <span className="font-semibold block">{formatCurrency(member.salaryBasic)} / month</span>
                                            <span className="text-[10px] text-black/40 block mt-0.5">Joined: {formatDate(member.joiningDate)}</span>
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="p-4 text-center">
                                        <span className={`inline-flex items-center gap-1.5 text-[9px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider select-none ${
                                            member.isActive
                                                ? "bg-green-50 text-green-700 border-green-200"
                                                : "bg-red-50 text-red-700 border-red-200"
                                        }`}>
                                            <span className={`w-1 h-1 rounded-full ${member.isActive ? "bg-green-500" : "bg-red-500"}`} />
                                            {member.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="p-4 text-right">
                                        <div className="inline-flex items-center justify-end">
                                            {actions.length > 0 ? (
                                                <TableActionMenu actions={actions} />
                                            ) : (
                                                <span className="text-black/30 font-medium">—</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}

                        {filteredStaff.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-12 text-center text-black/40">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <ShieldAlert size={24} className="text-black/20" />
                                        <p className="font-semibold text-xs">No staff registry entries match the criteria.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer Summary */}
            <div className="p-4 border-t border-light-border bg-gray-50/30 flex items-center justify-between text-[11px] font-medium text-black/45">
                <span>Showing {filteredStaff.length} of {staff.length} staff members</span>
                <span>Campus Registry & Security</span>
            </div>
        </div>
    );
}
