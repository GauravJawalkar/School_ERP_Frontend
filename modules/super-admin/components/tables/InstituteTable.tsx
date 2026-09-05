"use client";

import React, { useMemo } from "react";
import { CanAccess } from "@/shared_components/Auth/CanAccess";
import { Ban, Pencil, Trash2, UserCog, CirclePlus } from "lucide-react";
import Link from "next/link";
import { ApiClient } from "@/interceptors/ApiClient";
import { BASE_URL } from "@/constants/constants";
import { useQuery } from "@tanstack/react-query";
import { schoolDataApi } from "@/interfaces/interface";
import { formatDate } from "@/lib/helpers/formatDate";
import { useRouter } from "next/navigation";
import { DataTable, DataTableColumn } from "@/shared_components/Commons/DataTable";

export function InstituteTable() {
    const router = useRouter();

    const getAllSchools = async () => {
        const response = await ApiClient.get(`${BASE_URL}/institute/allSchools`);
        return response.data.data;
    };

    const { data: allSchools = [], isFetching, isError, error, refetch } = useQuery({
        queryKey: ["getAllSchools"],
        queryFn: getAllSchools,
        refetchOnWindowFocus: false
    });

    const columns: DataTableColumn<schoolDataApi>[] = useMemo(
        () => [
            {
                id: "schoolName",
                header: "School Name",
                isAlwaysVisible: true,
                sortable: true,
                accessorKey: "schoolName",
                cell: ({ row }) => (
                    <Link
                        className="hover:text-black transition-all hover:font-medium text-black/80 font-medium"
                        href={`/schools/${row.schoolSlug}`}
                    >
                        {row.schoolName}
                    </Link>
                )
            },
            {
                id: "city",
                header: "City",
                sortable: true,
                accessorFn: (row) => row.schoolInfo?.address_details?.city,
                cell: ({ row }) => (
                    <span className="text-black/70">
                        {row.schoolInfo?.address_details?.city || "—"}
                    </span>
                )
            },
            {
                id: "email",
                header: "Email",
                accessorFn: (row) => row?.schoolInfo?.emails?.primary,
                cell: ({ row }) =>
                    row?.schoolInfo?.emails?.primary ? (
                        <Link
                            className="hover:text-black transition-all hover:font-medium text-black/70"
                            href={`mailto:${row?.schoolInfo?.emails?.primary}`}
                        >
                            {row?.schoolInfo?.emails?.primary}
                        </Link>
                    ) : (
                        <span className="text-black/30">—</span>
                    )
            },
            {
                id: "phone",
                header: "Phone",
                accessorFn: (row) => row?.schoolInfo?.main_phone,
                cell: ({ row }) =>
                    row?.schoolInfo?.main_phone ? (
                        <Link
                            className="hover:text-black transition-all hover:font-medium text-black/70"
                            href={`tel:${row?.schoolInfo?.main_phone}`}
                        >
                            {row?.schoolInfo?.main_phone}
                        </Link>
                    ) : (
                        <span className="text-black/30">—</span>
                    )
            },
            {
                id: "students",
                header: "Students",
                sortable: true,
                accessorKey: "totalStudents",
                align: "center",
                cell: ({ row }) => (
                    <span className="text-black/70 font-semibold">{row.totalStudents ?? 0}</span>
                )
            },
            {
                id: "staff",
                header: "Staff",
                sortable: true,
                accessorKey: "totalStaff",
                align: "center",
                cell: ({ row }) => (
                    <span className="text-black/70 font-semibold">{row.totalStaff ?? 0}</span>
                )
            },
            {
                id: "status",
                header: "Status",
                sortable: true,
                accessorKey: "schoolStatus",
                align: "center",
                cell: ({ row }) => (
                    <DataTable.StatusBadge
                        status={row.schoolStatus}
                        variant={
                            row.schoolStatus?.toLowerCase() === "active"
                                ? "active"
                                : row.schoolStatus?.toLowerCase() === "expired"
                                ? "expired"
                                : "neutral"
                        }
                    />
                )
            },
            {
                id: "createdAt",
                header: "Created At",
                sortable: true,
                accessorKey: "createdAt",
                cell: ({ row }) => (
                    <span className="text-black/70">{formatDate(row?.createdAt)}</span>
                )
            }
        ],
        []
    );

    return (
        <CanAccess permission="saas.institute.create">
            <DataTable<schoolDataApi>
                title="Enrolled Schools"
                data={allSchools}
                columns={columns}
                tableId="enrolled-schools"
                isLoading={isFetching}
                error={isError ? (error as Error) : null}
                onRetry={refetch}
                getRowId={(row) => row.schoolId}
                searchPlaceholder="Filter Schools ...."
                searchKeys={["schoolName", "schoolSlug"]}
                searchFn={(row, query) =>
                    row.schoolName.toLowerCase().includes(query) ||
                    (row.schoolInfo?.address_details?.city || "").toLowerCase().includes(query) ||
                    (row.schoolInfo?.emails?.primary || "").toLowerCase().includes(query) ||
                    (row.schoolInfo?.main_phone || "").includes(query)
                }
                primaryAction={{
                    label: "Add School",
                    icon: <CirclePlus size={15} />,
                    variant: "dashed",
                    onClick: () => router.push("/schools/new"),
                    disabled: isFetching || isError
                }}
                selectable
                actions={(school) => [
                    {
                        label: "Edit",
                        icon: <Pencil size={15} />,
                        onClick: () => router.push(`/schools/edit/${school.schoolSlug}`)
                    },
                    {
                        label: "Admins",
                        icon: <UserCog size={15} />,
                        onClick: () => router.push(`schools/admins`)
                    },
                    {
                        label: "Suspend",
                        icon: <Ban size={15} />,
                        onClick: () => console.log("Suspend School")
                    },
                    {
                        label: "Delete",
                        icon: <Trash2 size={15} />,
                        danger: true,
                        onClick: () => console.log("Delete School")
                    }
                ]}
                pagination={{ pageSize: 15 }}
            />
        </CanAccess>
    );
}

export default InstituteTable;
