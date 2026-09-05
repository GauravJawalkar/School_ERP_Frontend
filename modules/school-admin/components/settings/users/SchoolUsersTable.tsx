"use client";

import React, { useMemo } from "react";
import { Mail, Shield } from "lucide-react";
import Link from "next/link";
import { DataTable, DataTableColumn, FilterTabOption } from "@/shared_components/Commons/DataTable";

interface User {
    id: number;
    userId: string | null;
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
    onToggleActive: (userId: string, currentStatus: boolean) => void;
}

const ROLE_FILTERS: FilterTabOption<User>[] = [
    { label: "All Roles", value: "ALL" },
    { label: "Admins", value: "SCHOOL_ADMIN", countFilter: (u) => u.roleName === "SCHOOL_ADMIN" },
    { label: "Teachers", value: "TEACHER", countFilter: (u) => u.roleName === "TEACHER" },
    { label: "Accountants", value: "ACCOUNTANT", countFilter: (u) => u.roleName === "ACCOUNTANT" },
    { label: "Staff", value: "STAFF", countFilter: (u) => u.roleName !== "TEACHER" && u.roleName !== "SCHOOL_ADMIN" && u.roleName !== "SUPER_ADMIN" }
];

export default function SchoolUsersTable({
    users = [],
    onToggleActive
}: SchoolUsersTableProps) {
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

    const columns: DataTableColumn<User>[] = useMemo(
        () => [
            {
                id: "profile",
                header: "User Profile Details",
                isAlwaysVisible: true,
                cell: ({ row }) => (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center border border-light-border shrink-0">
                            {row.firstName?.[0] || ""}
                            {row.lastName?.[0] || ""}
                        </div>
                        <div>
                            <span className="font-bold text-black block hover:underline cursor-pointer">
                                {row.firstName} {row.lastName}
                            </span>
                            <div className="flex items-center gap-2.5 text-[10px] text-black/40 font-medium mt-0.5">
                                <span className="flex items-center gap-1">
                                    <Mail size={10} />
                                    {row.email || "No Email"}
                                </span>
                                {row.employeeCode && (
                                    <span>• Code: {row.employeeCode}</span>
                                )}
                            </div>
                        </div>
                    </div>
                )
            },
            {
                id: "contact",
                header: "Contact",
                cell: ({ row }) =>
                    row.phone ? (
                        <Link
                            href={`tel:${row.phone}`}
                            className="font-medium text-black/60 hover:text-black text-xs"
                        >
                            {row.phone}
                        </Link>
                    ) : (
                        <span className="text-black/30 font-medium">No Phone</span>
                    )
            },
            {
                id: "role",
                header: "Access Role & Designation",
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <span
                            className={`text-[9px] px-2 py-0.5 font-semibold uppercase border rounded-md tracking-wider ${getRoleBadge(
                                row.roleName
                            )}`}
                        >
                            {row.roleName.replace(/_/g, " ")}
                        </span>
                        {row.designation && (
                            <span className="text-[10px] text-black/45 font-medium">
                                • {row.designation}
                            </span>
                        )}
                    </div>
                )
            },
            {
                id: "status",
                header: "Login Status",
                align: "center",
                cell: ({ row }) => (
                    <DataTable.StatusBadge
                        status={row.isActive ? "ACTIVE" : "SUSPENDED"}
                        variant={row.isActive ? "active" : "suspended"}
                    />
                )
            },
            {
                id: "controls",
                header: "Access Controls",
                align: "right",
                cell: ({ row }) => (
                    <div className="flex items-center justify-end gap-1.5">
                        {row.userId ? (
                            row.isActive ? (
                                <button
                                    type="button"
                                    onClick={() => row.userId && onToggleActive(row.userId, true)}
                                    title="Suspend Credentials"
                                    className="h-7 px-2.5 rounded-lg border border-red-100 bg-red-50/20 text-red-600 hover:bg-red-50 flex items-center gap-1 text-[11px] font-bold hover:text-red-700 transition cursor-pointer"
                                >
                                    Suspend
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => row.userId && onToggleActive(row.userId, false)}
                                    title="Restore Credentials"
                                    className="h-7 px-2.5 rounded-lg border border-green-100 bg-green-50/20 text-green-600 hover:bg-green-50 flex items-center gap-1 text-[11px] font-bold hover:text-green-700 transition cursor-pointer"
                                >
                                    Activate
                                </button>
                            )
                        ) : (
                            <span className="text-[10px] text-black/35 font-medium italic select-none">
                                Read-only Profile
                            </span>
                        )}
                    </div>
                )
            }
        ],
        [onToggleActive]
    );

    return (
        <DataTable<User>
            data={users}
            columns={columns}
            tableId="school-users-table"
            searchPlaceholder="Search by name, email or ID..."
            searchKeys={["firstName", "lastName", "email", "employeeCode", "phone"]}
            filterTabs={ROLE_FILTERS}
            filterKey="roleName"
            footerText="System Directory Active"
            emptyState={{
                icon: <Shield size={24} className="text-black/20" />,
                title: "No dashboard user credentials match your parameters",
                description: "Refine the search term or role filter group and try again."
            }}
            pagination={{ pageSize: 15 }}
        />
    );
}
