"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import AddSchoolForm from "../components/forms/AddSchoolForm";

// Custom Hooks, Utils & Types from settings module
import {
    useSchoolsList,
    useSchoolDetails,
    useSchoolAdminMutations,
    getMappedSchoolData
} from "@/modules/settings";


import LoadingSpinner from "@/shared_components/Commons/LoadingSpinner";

// Sub-components
import SchoolsTable from "../components/institute/SchoolsTable";
import SchoolProfileOverview from "../components/institute/SchoolProfileOverview";
import FacultyTable from "../components/institute/FacultyTable";
import ClassesTable from "../components/institute/ClassesTable";
import FeesTable from "../components/institute/FeesTable";

import {
    Landmark,
    Users,
    BookOpen,
    Receipt,
    ArrowLeft,
    Shield,
    AlertCircle,
    Pencil
} from "lucide-react";

export default function InstituteDashboard() {
    const { user } = useAuthStore();

    const isSuperAdmin = user?.roles?.includes("SUPER_ADMIN");
    const userSchoolSlug = user?.instituteDetails?.slug || "";

    // If Super Admin, allow selecting a school from the directory registry, otherwise default to user's own school
    const [selectedSchoolSlug, setSelectedSchoolSlug] = useState<string>(
        isSuperAdmin ? "" : userSchoolSlug
    );
    const [activeTab, setActiveTab] = useState<"overview" | "staff" | "classes" | "fees" | "edit">("overview");

    // 1. Query: Get All Schools (Only for Super Admin)
    const {
        data: schools = [],
        isLoading: isSchoolsLoading,
        isError: isSchoolsError
    } = useSchoolsList(!!isSuperAdmin);

    // 2. Query: Get Selected School Details
    const {
        data: schoolDetails,
        isLoading: isDetailsLoading,
        isError: isDetailsError,
        refetch: refetchDetails
    } = useSchoolDetails(selectedSchoolSlug);

    // 3. Mutations
    const { updateSchoolStatus } = useSchoolAdminMutations({
        slug: selectedSchoolSlug
    });

    const handleStatusChange = (slug: string, newStatus: string) => {
        updateSchoolStatus.mutate({ slug, status: newStatus });
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
        return <LoadingSpinner message="Loading campus configurations..." containerHeight="h-[60vh]" />;
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
                                <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-full select-none ${schoolDetails.status === "ACTIVE"
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
                        <p className="text-[10px] font-bold text-black/40 uppercase tracking-wider">Active Classes</p>
                        <p className="text-sm font-bold text-black">{schoolDetails.classes?.length || 0}</p>
                    </div>
                </div>

                <div className="bg-white border border-light-border p-4 rounded-xl flex items-center gap-3 shadow-xs">
                    <div className="p-2 bg-neutral-100 rounded-lg text-black">
                        <Receipt size={16} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-black/40 uppercase tracking-wider">Fee Structures</p>
                        <p className="text-sm font-bold text-black">{schoolDetails.feeStructures?.length || 0}</p>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-light-border gap-6 text-xs font-bold text-black/45 select-none overflow-x-auto slim-scrollbar">
                <button
                    onClick={() => setActiveTab("overview")}
                    className={`pb-3 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${activeTab === "overview"
                            ? "border-b-2 border-black text-black"
                            : "hover:text-black"
                        }`}
                >
                    <Landmark size={14} />
                    Campus Profile & Info
                </button>
                <button
                    onClick={() => setActiveTab("staff")}
                    className={`pb-3 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${activeTab === "staff"
                            ? "border-b-2 border-black text-black"
                            : "hover:text-black"
                        }`}
                >
                    <Users size={14} />
                    Rostered Faculty ({schoolDetails.staff?.length || 0})
                </button>
                <button
                    onClick={() => setActiveTab("classes")}
                    className={`pb-3 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${activeTab === "classes"
                            ? "border-b-2 border-black text-black"
                            : "hover:text-black"
                        }`}
                >
                    <BookOpen size={14} />
                    Classes & Sections ({schoolDetails.classes?.length || 0})
                </button>
                <button
                    onClick={() => setActiveTab("fees")}
                    className={`pb-3 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${activeTab === "fees"
                            ? "border-b-2 border-black text-black"
                            : "hover:text-black"
                        }`}
                >
                    <Receipt size={14} />
                    Fee Structures ({schoolDetails.feeStructures?.length || 0})
                </button>
                <button
                    onClick={() => setActiveTab("edit")}
                    className={`pb-3 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${activeTab === "edit"
                            ? "border-b-2 border-black text-black"
                            : "hover:text-black"
                        }`}
                >
                    <Pencil size={14} />
                    Edit Campus Profile
                </button>
            </div>

            {/* Tab Views */}
            <div>
                {activeTab === "overview" && (
                    <SchoolProfileOverview details={schoolDetails} />
                )}

                {activeTab === "staff" && (
                    <FacultyTable staff={schoolDetails.staff || []} />
                )}

                {activeTab === "classes" && (
                    <ClassesTable
                        classes={schoolDetails.classes || []}
                        staff={schoolDetails.staff || []}
                        schoolId={schoolDetails.id}
                        canEdit={isSuperAdmin || user?.roles?.includes("SCHOOL_ADMIN")}
                        refetchSchoolDetails={refetchDetails}
                        affiliatedBoards={schoolDetails.additionalInfo?.boardsAffiliated || []}
                    />
                )}

                {activeTab === "fees" && (
                    <FeesTable
                        feeStructures={schoolDetails.feeStructures || []}
                        classes={schoolDetails.classes || []}
                        schoolId={schoolDetails.id}
                        canEdit={isSuperAdmin || user?.roles?.includes("SCHOOL_ADMIN")}
                        refetchSchoolDetails={refetchDetails}
                    />
                )}

                {activeTab === "edit" && (
                    <div className="bg-white border border-light-border rounded-xl p-6 shadow-xs">
                        <div className="mb-6">
                            <h2 className="text-sm font-bold text-black uppercase tracking-wider">Edit School Profile Settings</h2>
                            <p className="text-xs text-black/45 mt-0.5">Update contact info, vision statement, mission, and accreditation headers.</p>
                        </div>
                        <AddSchoolForm
                            initialData={getMappedSchoolData(schoolDetails)}
                            schoolId={schoolDetails.id}
                            isEditMode={true}
                            onSuccess={() => {
                                refetchDetails();
                                setActiveTab("overview");
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
