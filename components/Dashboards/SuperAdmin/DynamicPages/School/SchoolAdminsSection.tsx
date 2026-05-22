"use client"

import React, { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ApiClient } from "@/interceptors/ApiClient"
import { BASE_URL } from "@/constants/constants"
import { ShieldCheck, BadgeCheck, BadgeX, Loader2, Plus } from "lucide-react"
import AddAdminModal from "../../Modals/AddAdminModal"
import toast from "react-hot-toast"
import Link from "next/link"
import { AdminUser, SchoolAdminsSectionProps } from "@/interfaces/interface"

export default function SchoolAdminsSection({
    schoolId,
    schoolName,
    schoolEmail,
    schoolSlug,
}: SchoolAdminsSectionProps) {
    const queryClient = useQueryClient()
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

    // Query specific admins for this school
    const getSchoolAdmins = async () => {
        const response = await ApiClient.get(`${BASE_URL}/admin/${schoolSlug}`)
        return response.data
    }

    const { data: adminsData, isLoading, isError, refetch } = useQuery({
        queryKey: ["schoolAdmins", schoolId],
        queryFn: getSchoolAdmins,
        refetchOnWindowFocus: false,
    })

    const adminsList: AdminUser[] = adminsData?.data || []
    console.log("Admins Data: ", adminsList);

    // Mutation to activate/deactivate admin status
    const toggleAdminStatusMutation = useMutation({
        mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
            const response = await ApiClient.patch(`${BASE_URL}/institute/updateUserStatus`, {
                userId,
                isActive,
            })
            return response.data.data
        },
        onSuccess: (data) => {
            toast.success(`Admin has been ${data.isActive ? "activated" : "deactivated"}!`)
            queryClient.invalidateQueries({ queryKey: ["schoolAdmins", schoolId] })
            queryClient.invalidateQueries({ queryKey: ["schoolDetails"] })
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to update admin status.")
        },
    })

    const handleToggleStatus = (userId: string, currentStatus: boolean) => {
        toggleAdminStatusMutation.mutate({ userId, isActive: !currentStatus })
    }

    return (
        <div className="border border-light-border bg-white rounded-xl p-5 shadow-xs">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-light-border mb-4">
                <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-md bg-black flex items-center justify-center text-white">
                        <ShieldCheck size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-black">Administrators</h3>
                        <p className="text-xs text-black/50">Manage school portal accounts ({adminsList.length})</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 border border-light-border hover:bg-neutral-50 transition rounded-md text-black cursor-pointer">
                    <Plus size={14} />
                    Add Admin
                </button>
            </div>

            {/* List/Table */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-black/40" />
                    <p className="text-xs text-black/40">Loading administrators...</p>
                </div>
            ) : isError ? (
                <div className="text-center py-6">
                    <p className="text-xs text-red-500 mb-2">Failed to load administrators.</p>
                    <button
                        onClick={() => refetch()}
                        className="text-xs px-3 py-1 border border-light-border rounded-md hover:bg-gray-50 transition cursor-pointer"
                    >
                        Try Again
                    </button>
                </div>
            ) : adminsList?.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-light-border rounded-lg bg-gray-50/50">
                    <p className="text-sm text-black/50 font-medium">No administrators assigned yet</p>
                    <p className="text-xs text-black/40 mt-1">Assign an administrator to manage this school's portal.</p>
                </div>
            ) : (
                <div className="overflow-x-auto slim-scrollbar border border-light-border rounded-lg">
                    <table className="text-xs w-full min-w-max">
                        <thead>
                            <tr className="bg-neutral-50 border-b border-light-border text-left text-black/60 font-medium">
                                <th className="px-3.5 py-2.5 font-medium">Name</th>
                                <th className="px-3.5 py-2.5 font-medium">Email</th>
                                <th className="px-3.5 py-2.5 font-medium">Phone</th>
                                <th className="px-3.5 py-2.5 font-medium">Status</th>
                                <th className="px-3.5 py-2.5 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-light-border bg-white">
                            {adminsList?.map((admin) => (
                                <tr key={admin.userId} className="hover:bg-gray-50/60 transition-colors">
                                    <td className="px-3.5 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-gray-100 border border-light-border flex items-center justify-center text-black/40 shrink-0 font-medium">
                                                {admin.firstName[0]}
                                                {admin.lastName[0]}
                                            </div>
                                            <span className="font-semibold text-black/85">
                                                {admin.firstName} {admin.lastName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-3.5 py-3">
                                        <Link
                                            href={`mailto:${admin.email}`}
                                            className="text-black/60 hover:text-black transition hover:font-medium"
                                        >
                                            {admin.email}
                                        </Link>
                                    </td>
                                    <td className="px-3.5 py-3 text-black/60">{admin.phone || "—"}</td>
                                    <td className="px-3.5 py-3">
                                        <span
                                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${admin.isActive
                                                ? "bg-green-50 text-green-700 border-green-200"
                                                : "bg-red-50 text-red-700 border-red-200"
                                                }`}
                                        >
                                            {admin.isActive ? (
                                                <>
                                                    <BadgeCheck size={11} /> Active
                                                </>
                                            ) : (
                                                <>
                                                    <BadgeX size={11} /> Suspended
                                                </>
                                            )}
                                        </span>
                                    </td>
                                    <td className="px-3.5 py-3 text-right">
                                        <button
                                            type="button"
                                            onClick={() => handleToggleStatus(admin.userId, admin.isActive)}
                                            disabled={toggleAdminStatusMutation.isPending}
                                            className={`px-2.5 py-1 text-[11px] font-medium border rounded-md transition cursor-pointer disabled:opacity-50 ${admin.isActive
                                                ? "text-red-600 border-red-200 hover:bg-red-50"
                                                : "text-black border-light-border hover:bg-neutral-50"
                                                }`}
                                        >
                                            {toggleAdminStatusMutation.isPending &&
                                                toggleAdminStatusMutation.variables?.userId === admin.userId ? (
                                                <Loader2 size={10} className="animate-spin inline" />
                                            ) : admin.isActive ? (
                                                "Suspend"
                                            ) : (
                                                "Activate"
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isAddModalOpen && (
                <AddAdminModal
                    isOpen={isAddModalOpen}
                    school={{
                        schoolId,
                        schoolName,
                        schoolEmail,
                    }}
                    onClose={() => {
                        setIsAddModalOpen(false)
                        refetch()
                    }}
                />
            )}
        </div>
    )
}
