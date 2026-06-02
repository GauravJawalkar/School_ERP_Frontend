"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/interceptors/ApiClient";
import { BASE_URL } from "@/constants/constants";
import { CanAccess } from "@/components/Auth/CanAccess";
import { Loader2, Plus, UserCog, RefreshCw, KeyRound } from "lucide-react";
import { usePermission } from "@/hooks/usePermission";
import toast from "react-hot-toast";

import SchoolUsersStats from "./SchoolUsersStats";
import SchoolUsersTable from "./SchoolUsersTable";
import SchoolUserDrawer from "./SchoolUserDrawer";

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
    const fetchSchoolUsers = async (): Promise<User[]> => {
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
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ["getSchoolUsers"] });

            // Snapshot the previous query data
            const previousUsers = queryClient.getQueryData<User[]>(["getSchoolUsers"]);

            // Optimistically update the list
            queryClient.setQueryData<User[]>(["getSchoolUsers"], (old = []) => {
                return old.map((user) =>
                    user.userId === variables.userId ? { ...user, isActive: variables.isActive } : user
                );
            });

            return { previousUsers };
        },
        onError: (err: any, variables, context) => {
            // Roll back if error occurs
            if (context?.previousUsers) {
                queryClient.setQueryData(["getSchoolUsers"], context.previousUsers);
            }
            const serverMsg = err?.response?.data?.message || "Failed to update user status.";
            toast.error(serverMsg);
        },
        onSuccess: (data, variables) => {
            toast.success(data?.message || `User credentials ${variables.isActive ? "reactivated" : "suspended"} successfully!`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["getSchoolUsers"] });
        }
    });

    const handleCreateUser = (newStaff: any) => {
        let payload = { ...newStaff };
        if (isSuperAdmin && selectedSchoolSlug) {
            const currentSchool = schools.find((s: any) => s.schoolSlug === selectedSchoolSlug);
            if (currentSchool) {
                payload.instituteId = currentSchool.schoolId;
            }
        }
        createStaffMutation.mutate(payload);
    };

    // Toggle user login access via backend patch api
    const handleToggleActive = (userId: string, currentStatus: boolean) => {
        updateUserStatusMutation.mutate({ userId, isActive: !currentStatus });
    };

    if (isLoading) {
        return (
            <div className="h-[70vh] w-full flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
                <span className="text-sm font-semibold text-black/50 tracking-wider uppercase">Querying user credentials registry...</span>
            </div>
        );
    }

    return (
        <CanAccess anyRole={["SUPER_ADMIN", "SCHOOL_ADMIN"]}>
            <div className="pb-12 space-y-7">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-light-border pb-5 gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-black flex items-center gap-2">
                            User Management
                            {isRefetching && <RefreshCw size={14} className="animate-spin text-black/40" />}
                        </h1>
                        <p className="text-xs text-black/50 font-medium">Create administrative login credentials, assign system-wide dashboard roles, and audit access credentials</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="h-9 px-3 rounded-lg border border-light-border bg-white text-black/70 hover:text-black transition flex items-center justify-center hover:bg-neutral-50 cursor-pointer text-xs font-semibold gap-1.5"
                            title="Force Refresh Data"
                        >
                            <RefreshCw size={13} className={isRefetching ? "animate-spin" : ""} />
                            Re-Sync
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsDrawerOpen(true)}
                            className="h-9 px-4 rounded-lg bg-black text-white text-xs font-semibold hover:bg-black/90 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                            <Plus size={14} />
                            Add User
                        </button>
                    </div>
                </div>

                {/* School Selector (SuperAdmin Only) */}
                {isSuperAdmin && schools.length > 0 && (
                    <div className="p-4 bg-white border border-light-border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-black/45 uppercase tracking-widest block font-mono">Active Scope Selector</span>
                            <span className="text-xs font-semibold text-black/70">Viewing and managing credentials as platform SuperAdmin</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs font-bold text-black/50">Selected School:</span>
                            <select
                                value={selectedSchoolSlug}
                                onChange={(e) => setSelectedSchoolSlug(e.target.value)}
                                className="border border-input-border text-xs px-3 py-2 outline-none rounded-lg focus:ring-2 focus:ring-black/10 bg-white font-semibold cursor-pointer min-w-[240px]"
                            >
                                {schools.map((school: any) => (
                                    <option key={school.schoolId} value={school.schoolSlug}>
                                        {school.schoolName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {/* Performance overview Cards */}
                <SchoolUsersStats users={users} />

                {/* System warning panel */}
                <div className="p-3 bg-gray-50 border border-light-border rounded-xl flex items-center gap-3 text-xs text-black/70 leading-none">
                    <KeyRound size={14} className="text-black/80" />
                    <span><strong>Security Standing:</strong> Changes applied to active login states automatically terminate active token sessions.</span>
                </div>

                {/* Table Core */}
                <SchoolUsersTable
                    users={users}
                    onToggleActive={handleToggleActive}
                />

                {/* Right side slide drawer */}
                <SchoolUserDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    onSave={handleCreateUser}
                />

            </div>
        </CanAccess>
    );
}
