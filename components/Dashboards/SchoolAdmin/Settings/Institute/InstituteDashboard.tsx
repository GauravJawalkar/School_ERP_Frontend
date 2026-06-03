"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { ApiClient } from "@/interceptors/ApiClient";
import { BASE_URL } from "@/constants/constants";
import AddSchoolForm from "@/components/Dashboards/SchoolAdmin/AddSchoolForm";

// Modular Sub-components
import SchoolsTable, { SchoolSummary } from "./SchoolsTable";
import SchoolProfileOverview from "./SchoolProfileOverview";
import FacultyTable from "./FacultyTable";
import ClassesTable from "./ClassesTable";
import FeesTable from "./FeesTable";

import {
    Landmark,
    Users,
    BookOpen,
    Receipt,
    Plus,
    ArrowLeft,
    Shield,
    AlertCircle,
    Pencil
} from "lucide-react";
import toast from "react-hot-toast";

export default function InstituteDashboard() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    const isSuperAdmin = user?.roles?.includes("SUPER_ADMIN");
    const userSchoolSlug = user?.instituteDetails?.slug || "";

    // If Super Admin, allow selecting a school from the directory registry, otherwise default to user's own school
    const [selectedSchoolSlug, setSelectedSchoolSlug] = useState<string>(
        isSuperAdmin ? "" : userSchoolSlug
    );
    const [activeTab, setActiveTab] = useState<"overview" | "staff" | "classes" | "fees" | "edit">("overview");

    // 1. Query: Get All Schools (Only for Super Admin)
    const { data: schools = [], isLoading: isSchoolsLoading, isError: isSchoolsError } = useQuery<SchoolSummary[]>({
        queryKey: ["getSchoolsSettingsList"],
        queryFn: async () => {
            const response = await ApiClient.get(`${BASE_URL}/institute/allSchools`);
            return response.data?.data || [];
        },
        enabled: isSuperAdmin,
    });

    // 2. Query: Get Selected School Details
    const { data: schoolDetails, isLoading: isDetailsLoading, isError: isDetailsError, refetch: refetchDetails } = useQuery({
        queryKey: ["getSchoolDetails", selectedSchoolSlug],
        queryFn: async () => {
            const response = await ApiClient.get(`${BASE_URL}/institute/${selectedSchoolSlug}`);
            return response.data?.data;
        },
        enabled: !!selectedSchoolSlug,
    });

    // 3. Mutation: Update School Operational Status (Super Admin Only)
    const updateSchoolStatusMutation = useMutation({
        mutationFn: async ({ slug, status }: { slug: string; status: string }) => {
            const response = await ApiClient.patch(`${BASE_URL}/institute/${slug}/status`, { status });
            return response.data;
        },
        onSuccess: (_, variables) => {
            toast.success(`Institute status updated to ${variables.status}`);
            queryClient.invalidateQueries({ queryKey: ["getSchoolsSettingsList"] });
            if (variables.slug === selectedSchoolSlug) {
                queryClient.invalidateQueries({ queryKey: ["getSchoolDetails", selectedSchoolSlug] });
            }
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to update status.");
        }
    });

    const handleStatusChange = (slug: string, newStatus: string) => {
        updateSchoolStatusMutation.mutate({ slug, status: newStatus });
    };

    // Helper: Map school details API schema into AddSchoolForm flat schema
    const getMappedSchoolData = () => {
        if (!schoolDetails) return null;
        const { contactInfo, additionalInfo, ...rest } = schoolDetails;
        return {
            schoolName: rest.schoolName || "",
            primaryEmail: contactInfo?.emails?.primary || "",
            affiliationNumber: rest.affiliationNumber || "",
            instituteLogo: rest.logoUrl || "",
            medium: rest.medium || "",
            establishedYear: String(additionalInfo?.establishedYear || "") || "",
            main_phone: contactInfo?.main_phone || "",
            website: contactInfo?.website || "",
            city: contactInfo?.address_details?.city || "",
            state: contactInfo?.address_details?.state || "",
            address: rest.address || "",
            landmark: contactInfo?.address_details?.landmark || "",
            office_hours_Mon_Fri: contactInfo?.office_hours?.monday_to_friday || "",
            office_hours_Sat: contactInfo?.office_hours?.saturday || "",
            pincode: contactInfo?.address_details?.pincode || "",
            founderName: additionalInfo?.founderName || "",
            missionStatement: additionalInfo?.missionStatement || "",
            visionStatement: additionalInfo?.visionStatement || "",
            coreValues: additionalInfo?.coreValues || [],
            tags: additionalInfo?.tags || [],
            boardsAffiliated: additionalInfo?.boardsAffiliated || [],
            notableAlumni: additionalInfo?.notableAlumni || [],
        };
    };

    // --- RENDER 1: All Schools Listing (Super Admin View) ---
    if (isSuperAdmin && !selectedSchoolSlug) {
        return (
            <div className="pb-12 space-y-6">
                <div>
                    <h1 className="text-xl font-bold text-black flex items-center gap-2">
                        Institute Settings Registry
                    </h1>
                    <p className="text-xs text-black/50 font-medium mt-1">
                        Manage global educational campuses, modify core licensing parameters, and update administrative states.
                    </p>
                </div>

                <SchoolsTable
                    schools={schools}
                    isLoading={isSchoolsLoading}
                    isError={isSchoolsError}
                    onManageSchool={(slug) => {
                        setSelectedSchoolSlug(slug);
                        setActiveTab("overview");
                    }}
                    onStatusChange={handleStatusChange}
                />
            </div>
        );
    }

    // --- RENDER 2: Specific School Detailed Workspace ---
    if (isDetailsLoading) {
        return (
            <div className="h-[60vh] w-full flex flex-col items-center justify-center gap-3">
                <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-semibold text-black/50 tracking-wider uppercase">Loading campus configurations...</span>
            </div>
        );
    }

    if (isDetailsError || !schoolDetails) {
        return (
            <div className="h-[60vh] w-full flex flex-col items-center justify-center gap-2 border border-dashed border-red-200 rounded-xl bg-red-50/10">
                <AlertCircle className="w-8 h-8 text-red-500" />
                <span className="text-sm font-semibold text-red-600">Failed to load school credentials</span>
                <button
                    onClick={() => refetchDetails()}
                    className="mt-2 h-8 px-3 rounded-lg border border-red-200 bg-white hover:bg-red-50 text-red-700 text-xs font-bold transition"
                >
                    Retry Query
                </button>
            </div>
        );
    }

    return (
        <div className="pb-16 space-y-6">
            {/* Header / Nav Back */}
            <div className="flex flex-col gap-3 border-b border-light-border pb-5">
                {isSuperAdmin && (
                    <button
                        onClick={() => setSelectedSchoolSlug("")}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-black/55 hover:text-black transition cursor-pointer w-fit"
                    >
                        <ArrowLeft size={13} />
                        Back to campuses directory
                    </button>
                )}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {schoolDetails.logoUrl ? (
                            <img
                                src={schoolDetails.logoUrl}
                                alt="Logo"
                                className="w-12 h-12 rounded-xl object-contain border border-light-border p-1 bg-white select-none"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-xl bg-black text-white font-black flex items-center justify-center border border-light-border text-lg select-none">
                                {schoolDetails.schoolName.substring(0, 2).toUpperCase()}
                            </div>
                        )}
                        <div>
                            <div className="flex items-center gap-2.5">
                                <h1 className="text-xl font-bold text-black">{schoolDetails.schoolName}</h1>
                                <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-full select-none ${
                                    schoolDetails.status === "ACTIVE"
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : schoolDetails.status === "INACTIVE"
                                        ? "bg-neutral-50 text-neutral-600 border-neutral-200"
                                        : "bg-red-50 text-red-700 border-red-200"
                                }`}>
                                    {schoolDetails.status}
                                </span>
                            </div>
                            <p className="text-xs text-black/50 font-medium mt-0.5">
                                Affiliation No: {schoolDetails.affiliationNumber} • Medium: {schoolDetails.medium || "N/A"}
                            </p>
                        </div>
                    </div>

                    {/* Super Admin status control directly on the profile */}
                    {isSuperAdmin && (
                        <div className="flex items-center gap-2 bg-neutral-50 border border-light-border p-2 rounded-lg">
                            <span className="text-[10px] font-bold text-black/45 uppercase tracking-wider">License Status:</span>
                            <select
                                value={schoolDetails.status}
                                onChange={(e) => handleStatusChange(schoolDetails.slug, e.target.value)}
                                className="px-2.5 py-1 border border-input-border rounded-md text-[11px] font-bold bg-white text-black/80 cursor-pointer"
                            >
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                                <option value="SUSPENDED">Suspended</option>
                                <option value="PENDING_APPROVAL">Pending Approval</option>
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Cards Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-light-border p-4 rounded-xl flex items-center gap-3 shadow-xs">
                    <div className="p-2 bg-neutral-100 rounded-lg text-black">
                        <Users size={16} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-black/40 uppercase tracking-wider">Roster Students</p>
                        <p className="text-sm font-bold text-black">{schoolDetails.totalStudents || 0}</p>
                    </div>
                </div>

                <div className="bg-white border border-light-border p-4 rounded-xl flex items-center gap-3 shadow-xs">
                    <div className="p-2 bg-neutral-100 rounded-lg text-black">
                        <Shield size={16} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-black/40 uppercase tracking-wider">Roster Faculty</p>
                        <p className="text-sm font-bold text-black">{schoolDetails.staff?.length || 0}</p>
                    </div>
                </div>

                <div className="bg-white border border-light-border p-4 rounded-xl flex items-center gap-3 shadow-xs">
                    <div className="p-2 bg-neutral-100 rounded-lg text-black">
                        <BookOpen size={16} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-black/40 uppercase tracking-wider">Classes Count</p>
                        <p className="text-sm font-bold text-black">{schoolDetails.classes?.length || 0}</p>
                    </div>
                </div>

                <div className="bg-white border border-light-border p-4 rounded-xl flex items-center gap-3 shadow-xs">
                    <div className="p-2 bg-neutral-100 rounded-lg text-black">
                        <Receipt size={16} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-black/40 uppercase tracking-wider">Fee Models</p>
                        <p className="text-sm font-bold text-black">{schoolDetails.feeStructures?.length || 0}</p>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex border-b border-light-border overflow-x-auto slim-scrollbar">
                {[
                    { id: "overview", label: "Overview & Info", icon: Landmark },
                    { id: "staff", label: "Faculty & Staff", icon: Users },
                    { id: "classes", label: "Academic Classes", icon: BookOpen },
                    { id: "fees", label: "Fee Structure", icon: Receipt },
                    { id: "edit", label: "Edit Configurations", icon: Pencil }
                ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs whitespace-nowrap transition cursor-pointer ${
                                activeTab === tab.id
                                    ? "border-black text-black"
                                    : "border-transparent text-black/45 hover:text-black/85"
                            }`}
                        >
                            <Icon size={14} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* TAB CONTENT panels */}
            <div>
                {activeTab === "overview" && (
                    <SchoolProfileOverview schoolDetails={schoolDetails} />
                )}

                {activeTab === "staff" && (
                    <FacultyTable staff={schoolDetails.staff || []} />
                )}

                {activeTab === "classes" && (
                    <ClassesTable
                        classes={schoolDetails.classes || []}
                        staff={schoolDetails.staff || []}
                        schoolId={schoolDetails.id}
                        canEdit={isSuperAdmin || user?.instituteDetails?.id === schoolDetails.id}
                        refetchSchoolDetails={refetchDetails}
                    />
                )}

                {activeTab === "fees" && (
                    <FeesTable
                        feeStructures={schoolDetails.feeStructures || []}
                        classes={schoolDetails.classes || []}
                        schoolId={schoolDetails.id}
                        canEdit={isSuperAdmin || user?.instituteDetails?.id === schoolDetails.id}
                        refetchSchoolDetails={refetchDetails}
                    />
                )}

                {activeTab === "edit" && (
                    <div className="bg-white border border-light-border p-6 rounded-xl shadow-xs">
                        <AddSchoolForm
                            mode="edit"
                            schoolSlug={selectedSchoolSlug}
                            defaultData={getMappedSchoolData() as any}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
