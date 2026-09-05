"use client";

import React, { useMemo } from "react";
import { Edit, Trash2, CheckCircle2, XCircle, Award, ShieldAlert } from "lucide-react";
import { Action } from "@/interfaces/interface";
import { usePermission } from "@/hooks/usePermission";
import { DataTable, DataTableColumn } from "@/shared_components/Commons/DataTable";

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

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "N/A";
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

    const formatCurrency = (amount?: string | number) => {
        if (amount === undefined || amount === null || amount === "") return "₹0";
        try {
            const num = typeof amount === "string" ? parseFloat(amount) : amount;
            if (isNaN(num)) return "₹0";
            return new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0
            }).format(num);
        } catch {
            return `₹${amount}`;
        }
    };

    const getInitials = (first?: string, last?: string) => {
        const f = first ? first.charAt(0) : "";
        const l = last ? last.charAt(0) : "";
        return `${f}${l}`.toUpperCase() || "ST";
    };

    // Extract unique roles for filter tabs dynamically
    const filterTabs = useMemo(() => {
        const uniqueRoles = Array.from(new Set(staff.map((s) => s.roleName).filter(Boolean))) as string[];
        return [
            { label: "All Staff", value: "ALL" },
            ...uniqueRoles.map((role) => ({
                label: role.replace(/_/g, " "),
                value: role,
                countFilter: (s: StaffMember) => (s.roleName || "").toUpperCase() === role.toUpperCase()
            }))
        ];
    }, [staff]);

    const columns: DataTableColumn<StaffMember>[] = useMemo(
        () => [
            {
                id: "staffMember",
                header: "Staff Member",
                isAlwaysVisible: true,
                sortable: true,
                accessorFn: (row) => `${row.firstName} ${row.lastName}`,
                cell: ({ row }) => (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                            {getInitials(row.firstName, row.lastName)}
                        </div>
                        <div>
                            <span
                                className="font-bold text-black block hover:underline cursor-pointer"
                                onClick={() => onEdit(row)}
                            >
                                {row.firstName || ""} {row.lastName || ""}
                            </span>
                            <span className="text-[10px] text-black/55 font-medium block mt-0.5">
                                Code: {row.employeeCode || "N/A"}
                            </span>
                        </div>
                    </div>
                )
            },
            {
                id: "contactInfo",
                header: "Contact Info",
                cell: ({ row }) => (
                    <div className="space-y-0.5 text-black/70 font-medium">
                        <span className="block">{row.email || "N/A"}</span>
                        <span className="text-[10px] text-black/40 block">{row.phone || "N/A"}</span>
                    </div>
                )
            },
            {
                id: "rolePlacement",
                header: "Role & Placement",
                sortable: true,
                accessorKey: "roleName",
                cell: ({ row }) => (
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                            <Award size={12} className="text-black/55" />
                            <span className="text-[10px] font-bold text-black uppercase tracking-wider">
                                {(row.roleName || "STAFF").replace(/_/g, " ")}
                            </span>
                        </div>
                        <span className="text-[10px] text-black/55 font-medium block">
                            {row.designation || "Staff Member"} • {row.department || "General"}
                        </span>
                    </div>
                )
            },
            {
                id: "compensation",
                header: "Joining & Compensation",
                sortable: true,
                accessorKey: "salaryBasic",
                cell: ({ row }) => (
                    <div className="text-black/75">
                        <span className="font-semibold block">{formatCurrency(row.salaryBasic)} / month</span>
                        <span className="text-[10px] text-black/40 block mt-0.5">
                            Joined: {formatDate(row.joiningDate)}
                        </span>
                    </div>
                )
            },
            {
                id: "status",
                header: "Status",
                align: "center",
                sortable: true,
                accessorKey: "isActive",
                cell: ({ row }) => (
                    <DataTable.StatusBadge
                        status={row.isActive ? "ACTIVE" : "INACTIVE"}
                        variant={row.isActive ? "active" : "inactive"}
                    />
                )
            }
        ],
        [onEdit]
    );

    const getRowActions = (member: StaffMember): Action[] => {
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
                onClick: () => onDelete(Number(member.id)),
                danger: true
            });
        }
        return actions;
    };

    return (
        <DataTable<StaffMember>
            data={staff}
            columns={columns}
            tableId="staff-table"
            searchPlaceholder="Search staff by name, code, dept..."
            searchKeys={["firstName", "lastName", "employeeCode", "email", "phone", "designation", "department", "roleName"]}
            filterTabs={filterTabs}
            filterKey="roleName"
            actions={getRowActions}
            footerText="Campus Registry & Security"
            emptyState={{
                icon: <ShieldAlert size={24} className="text-black/20" />,
                title: "No staff registry entries match the criteria.",
                description: "Try adjusting your search terms or role filters."
            }}
            pagination={{ pageSize: 15 }}
        />
    );
}
