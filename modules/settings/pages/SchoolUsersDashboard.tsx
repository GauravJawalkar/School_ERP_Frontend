"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/interceptors/ApiClient";
import { BASE_URL } from "@/constants/constants";
import { CanAccess } from "@/components/Auth/CanAccess";
import { Loader2, Plus, UserCog, RefreshCw, KeyRound } from "lucide-react";
import { usePermission } from "@/hooks/usePermission";
import toast from "react-hot-toast";

import SchoolUsersStats from "../components/users/SchoolUsersStats";
import SchoolUsersTable from "../components/users/SchoolUsersTable";
import SchoolUserDrawer from "../components/users/SchoolUserDrawer";
import { SystemUser } from "../types/settings.types";

export default function SchoolUsersDashboard() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const queryClient = useQueryClient();
    const { isSuperAdmin } = usePermission();
    const [selectedSchoolSlug, setSelectedSchoolSlug] = useState<string>("");

    // Query: Fetch All Schools (Super Admin Only)
    const { data: schools = [] } = useQuery({
        queryKey: ["getAllSchools"],
        queryFn: async () => {
            if (!isSuperAdmin) return [];
            const response = await ApiClient.get(`${BASE_URL}/institute/allSchools`);
            return response.data?.data || [];
        },
        enabled: isSuperAdmin
    });

    useEffect(() => {
        if (isSuperAdmin && schools.length > 0 && !selectedSchoolSlug) {
            setSelectedSchoolSlug(schools[0].schoolSlug);
        }
    }, [schools, isSuperAdmin, selectedSchoolSlug]);

    // Query: Fetch All Institute Staff & Users
    const fetchSchoolUsers = async (): Promise<SystemUser[]> => {
        let url = `${BASE_URL}/admin/directory`;
        const params = new URLSearchParams();

        if (isSuperAdmin && selectedSchoolSlug) {
            const currentSchool = schools.find((s: any) => s.schoolSlug === selectedSchoolSlug);
            if (currentSchool) {
                params.append("instituteId", currentSchool.schoolId.toString());
            }
        }

        const queryString = params.toString();
        const finalUrl = queryString ? `${url}?${queryString}` : url;
        const response = await ApiClient.get(finalUrl);
        return response.data?.data || [];
    };

    const { data: users = [], isLoading, isRefetching, refetch } = useQuery({
        queryKey: ["getSchoolUsers", selectedSchoolSlug],
        queryFn: fetchSchoolUsers,
        refetchOnWindowFocus: false,
    });

    // Mutation: Create New Staff Credentials
    const createStaffMutation = useMutation({
        mutationFn: async (newStaffPayload: any) => {
            const response = await ApiClient.post(`${BASE_URL}/admin/createStaff`, newStaffPayload);
            return response.data;
        },
        onSuccess: () => {
            toast.success("School user credentials registered successfully!");
            queryClient.invalidateQueries({ queryKey: ["getSchoolUsers"] });
        },
        onError: (err: any) => {
            const serverMsg = err?.response?.data?.message || "Failed to submit staff details.";
            toast.error(serverMsg);
        }
    });

    // Mutation: Update User status
    const updateUserStatusMutation = useMutation({
        mutationFn: async (payload: { userId: string; isActive: boolean }) => {
            const response = await ApiClient.patch(`${BASE_URL}/institute/updateUserStatus`, payload);
            return response.data;
        },
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ["getSchoolUsers"] });
            const previousUsers = queryClient.getQueryData<SystemUser[]>(["getSchoolUsers", selectedSchoolSlug]);

            if (previousUsers) {
                queryClient.setQueryData<SystemUser[]>(["getSchoolUsers", selectedSchoolSlug], (old) => {
                    if (!old) return [];
                    return old.map(u => u.userId === variables.userId ? { ...u, isActive: variables.isActive } : u);
                });
            }
            return { previousUsers };
        },
        onError: (err, variables, context: any) => {
            if (context?.previousUsers) {
                queryClient.setQueryData(["getSchoolUsers", selectedSchoolSlug], context.previousUsers);
            }
            toast.error("Failed to update user login state.");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["getSchoolUsers"] });
        }
    });

    const handleSaveNewUser = (newStaffPayload: any) => {
        let finalPayload = { ...newStaffPayload };
        if (isSuperAdmin && selectedSchoolSlug) {
            const currentSchool = schools.find((s: any) => s.schoolSlug === selectedSchoolSlug);
            if (currentSchool) {
                finalPayload.instituteId = currentSchool.schoolId;
            }
        }
        createStaffMutation.mutate(finalPayload);
    };

    const handleToggleActive = (userId: string, currentStatus: boolean) => {
        updateUserStatusMutation.mutate({
            userId,
            isActive: !currentStatus
        });
    };

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-light-border pb-5 gap-4">
                <div>
                    <h1 className="text-xl font-bold text-black flex items-center gap-2">
                        User Credentials Directory
                        <UserCog size={18} className="text-black/80" />
                    </h1>
                    <p className="text-xs text-black/50 font-medium mt-0.5">
                        Manage authorized portal logins, staff assignments, and credentials status.
                    </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={() => refetch()}
                        disabled={isRefetching}
                        className="h-9 w-9 rounded-lg border border-light-border bg-white flex items-center justify-center text-black/60 hover:text-black transition hover:bg-neutral-50 shadow-xs cursor-pointer disabled:opacity-50"
                        title="Refresh Directory"
                    >
                        <RefreshCw size={14} className={isRefetching ? "animate-spin" : ""} />
                    </button>

                    <CanAccess role={["SCHOOL_ADMIN", "SUPER_ADMIN"]}>
                        <button
                            onClick={() => setIsDrawerOpen(true)}
                            className="h-9 px-4 rounded-lg bg-black text-white text-xs font-semibold hover:bg-black/90 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                            <Plus size={14} />
                            Issue User Credentials
                        </button>
                    </CanAccess>
                </div>
            </div>

            {/* Super Admin School Switcher */}
            {isSuperAdmin && schools.length > 0 && (
                <div className="p-4 bg-gray-50 border border-light-border rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-black/70 font-semibold">
                        <KeyRound size={15} />
                        <span>Platform Administration: Switch Target School Scope</span>
                    </div>
                    <select
                        value={selectedSchoolSlug}
                        onChange={(e) => setSelectedSchoolSlug(e.target.value)}
                        className="border border-input-border text-xs px-3 py-1.5 outline-none rounded-lg font-bold text-black bg-white cursor-pointer"
                    >
                        {schools.map((school: any) => (
                            <option key={school.schoolId} value={school.schoolSlug}>
                                {school.schoolName} ({school.schoolSlug})
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Loading Spinner */}
            {isLoading ? (
                <div className="h-[40vh] w-full flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-semibold text-black/50 tracking-wider uppercase">Fetching user profiles...</span>
                </div>
            ) : (
                <>
                    {/* Stats overview */}
                    <SchoolUsersStats users={users} />

                    {/* Table View */}
                    <SchoolUsersTable
                        users={users}
                        onToggleActive={handleToggleActive}
                    />
                </>
            )}

            {/* Slide-over Drawer for User Creation */}
            <SchoolUserDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                onSave={handleSaveNewUser}
            />
        </div>
    );
}
