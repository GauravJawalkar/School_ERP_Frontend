"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ApiClient } from "@/interceptors/ApiClient";
import { BASE_URL } from "@/constants/constants";
import toast from "react-hot-toast";
import {
    Plus,
    Pencil,
    Trash2,
    BookOpen,
    X
} from "lucide-react";

import AddClassDrawer from "./AddClassDrawer";
import EditClassDrawer from "./EditClassDrawer";
import AddSectionDrawer from "./AddSectionDrawer";
import EditSectionDrawer from "./EditSectionDrawer";
import DeleteClassDrawer from "./DeleteClassDrawer";
import DeleteSectionDrawer from "./DeleteSectionDrawer";
import TableActionMenu from "@/components/Commons/TableActionMenu";

interface CampusSection {
    id: number;
    name: string;
    capacity: number | null;
    roomNumber: string | null;
    classTeacherId: number | null;
}

interface CampusClass {
    id: number;
    className: string;
    capacity: number | null;
    orderIndex: number | null;
    academicYearId: number;
    academicYearName?: string;
    sections?: CampusSection[];
}

interface ClassesTableProps {
    classes: CampusClass[];
    staff: any[];
    schoolId: number;
    canEdit: boolean;
    refetchSchoolDetails: () => void;
}

export default function ClassesTable({
    classes,
    staff,
    schoolId,
    canEdit,
    refetchSchoolDetails
}: ClassesTableProps) {
    // Class Drawer States
    const [isAddClassDrawerOpen, setIsAddClassDrawerOpen] = useState(false);
    const [isEditClassDrawerOpen, setIsEditClassDrawerOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<CampusClass | null>(null);

    // Section Drawer States
    const [isAddSectionDrawerOpen, setIsAddSectionDrawerOpen] = useState(false);
    const [isEditSectionDrawerOpen, setIsEditSectionDrawerOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState<CampusSection | null>(null);
    const [targetClassForSection, setTargetClassForSection] = useState<CampusClass | null>(null);

    // Delete Drawer States
    const [isDeleteClassDrawerOpen, setIsDeleteClassDrawerOpen] = useState(false);
    const [classToDelete, setClassToDelete] = useState<CampusClass | null>(null);
    
    const [isDeleteSectionDrawerOpen, setIsDeleteSectionDrawerOpen] = useState(false);
    const [sectionToDelete, setSectionToDelete] = useState<CampusSection | null>(null);
    const [parentClassOfSectionToDelete, setParentClassOfSectionToDelete] = useState<CampusClass | null>(null);

    // 1. Query: Fetch Academic Years for this school
    const { data: academicYears = [] } = useQuery({
        queryKey: ["getAcademicYearsList", schoolId],
        queryFn: async () => {
            const response = await ApiClient.get(`${BASE_URL}/admin/academicYears?instituteId=${schoolId}`);
            return response.data?.data || [];
        },
        enabled: !!schoolId
    });

    // 2. Mutations: Class CRUD
    const createClassMutation = useMutation({
        mutationFn: async (payload: {
            className: string;
            academicYearId: number;
            capacity: number | null;
        }) => {
            const response = await ApiClient.post(`${BASE_URL}/institute/createClass`, {
                ...payload,
                instituteId: schoolId
            });
            return response.data;
        },
        onSuccess: () => {
            toast.success("Class created successfully");
            refetchSchoolDetails();
            setIsAddClassDrawerOpen(false);
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to create class");
        }
    });

    const updateClassMutation = useMutation({
        mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
            const response = await ApiClient.patch(`${BASE_URL}/institute/class/${id}`, payload);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Class updated successfully");
            refetchSchoolDetails();
            setIsEditClassDrawerOpen(false);
            setSelectedClass(null);
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to update class");
        }
    });

    const deleteClassMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await ApiClient.delete(`${BASE_URL}/institute/class/${id}`);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Class deleted successfully");
            refetchSchoolDetails();
            setIsDeleteClassDrawerOpen(false);
            setClassToDelete(null);
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to delete class");
        }
    });

    // 3. Mutations: Section CRUD
    const createSectionMutation = useMutation({
        mutationFn: async (payload: {
            name: string;
            classId: number;
            capacity: number | null;
            roomNumber: string;
            classTeacherId: number | null;
        }) => {
            const response = await ApiClient.post(`${BASE_URL}/institute/createSection`, payload);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Section added successfully");
            refetchSchoolDetails();
            setIsAddSectionDrawerOpen(false);
            setTargetClassForSection(null);
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to add section");
        }
    });

    const updateSectionMutation = useMutation({
        mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
            const response = await ApiClient.patch(`${BASE_URL}/institute/section/${id}`, payload);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Section updated successfully");
            refetchSchoolDetails();
            setIsEditSectionDrawerOpen(false);
            setSelectedSection(null);
            setTargetClassForSection(null);
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to update section");
        }
    });

    const deleteSectionMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await ApiClient.delete(`${BASE_URL}/institute/section/${id}`);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Section deleted successfully");
            refetchSchoolDetails();
            setIsDeleteSectionDrawerOpen(false);
            setSectionToDelete(null);
            setParentClassOfSectionToDelete(null);
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to delete section");
        }
    });

    // Action Helpers
    const handleCreateClass = (payload: any) => {
        createClassMutation.mutate(payload);
    };

    const handleUpdateClass = (payload: any) => {
        if (!selectedClass) return;
        updateClassMutation.mutate({
            id: selectedClass.id,
            payload
        });
    };

    const triggerDeleteClass = (cls: CampusClass) => {
        setClassToDelete(cls);
        setIsDeleteClassDrawerOpen(true);
    };

    const handleConfirmDeleteClass = () => {
        if (!classToDelete) return;
        deleteClassMutation.mutate(classToDelete.id);
    };

    const handleCreateSection = (payload: any) => {
        createSectionMutation.mutate(payload);
    };

    const handleUpdateSection = (payload: any) => {
        if (!selectedSection) return;
        updateSectionMutation.mutate({
            id: selectedSection.id,
            payload
        });
    };

    const triggerDeleteSection = (sec: CampusSection, cls: CampusClass) => {
        setSectionToDelete(sec);
        setParentClassOfSectionToDelete(cls);
        setIsDeleteSectionDrawerOpen(true);
    };

    const handleConfirmDeleteSection = () => {
        if (!sectionToDelete) return;
        deleteSectionMutation.mutate(sectionToDelete.id);
    };

    const openAddSectionDrawer = (cls: CampusClass) => {
        setTargetClassForSection(cls);
        setIsAddSectionDrawerOpen(true);
    };

    const openEditSectionDrawer = (sec: CampusSection, cls: CampusClass) => {
        setTargetClassForSection(cls);
        setSelectedSection(sec);
        setIsEditSectionDrawerOpen(true);
    };

    return (
        <div className="space-y-4">
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-sm font-bold text-black uppercase tracking-wider flex items-center gap-1.5 select-none">
                        <BookOpen size={14} />
                        Campus Academic Classes
                    </h2>
                    <p className="text-[10px] text-black/45 font-medium mt-0.5">
                        Manage classroom levels, configure capacity limits, partition sections, and allocate class teachers.
                    </p>
                </div>
                {canEdit && (
                    <button
                        onClick={() => setIsAddClassDrawerOpen(true)}
                        className="h-8 px-3 rounded-lg bg-black text-white hover:bg-black/90 font-bold text-xs transition cursor-pointer flex items-center gap-1 self-start sm:self-auto"
                    >
                        <Plus size={14} />
                        Add Class
                    </button>
                )}
            </div>

            {/* Classes Table */}
            <div className="bg-white border border-light-border rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b border-light-border bg-neutral-50/50 text-[10px] font-bold text-black/45 uppercase tracking-wider">
                                <th className="p-4 font-bold">Class & Sections</th>
                                <th className="p-4 font-bold text-center">Class capacity limit</th>
                                <th className="p-4 font-bold text-center">Academic Year</th>
                                {canEdit && <th className="p-4 font-bold text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-light-border text-xs">
                            {!classes || classes.length === 0 ? (
                                <tr>
                                    <td colSpan={canEdit ? 4 : 3} className="p-8 text-center text-black/40 font-semibold">
                                        No classroom configurations registered in this profile query.
                                    </td>
                                </tr>
                            ) : (
                                classes.map((cls) => {
                                    const matchedYear = academicYears.find((ay: any) => ay.id === cls.academicYearId);
                                    const formatYear = cls.academicYearName || (matchedYear ? matchedYear.name : "N/A");
                                    return (
                                        <tr key={cls.id} className="hover:bg-neutral-50/50 transition">
                                            <td className="p-4">
                                                <div className="font-bold text-black text-xs">
                                                    Class {cls.className}
                                                </div>
                                                {/* Inline Sections Display */}
                                                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                                                    {cls.sections && cls.sections.length > 0 ? (
                                                        cls.sections.map((sec) => {
                                                            const matchedTeacher = staff?.find((s: any) => s.id === sec.classTeacherId);
                                                            return (
                                                                <div
                                                                    key={sec.id}
                                                                    className="group/sec inline-flex items-center gap-1 px-2 py-0.5 border border-light-border bg-neutral-50 rounded-md text-[10px] font-medium text-black/70 hover:bg-neutral-100 transition select-none"
                                                                >
                                                                    <span className="font-bold">Sec {sec.name}</span>
                                                                    <span className="text-black/35 font-normal">({sec.capacity || "N/A"} seats)</span>
                                                                    {matchedTeacher && (
                                                                        <span className="text-[9px] text-black/45 italic font-normal">
                                                                            • {matchedTeacher.firstName} {matchedTeacher.lastName.substring(0,1)}.
                                                                        </span>
                                                                    )}
                                                                    {canEdit && (
                                                                        <div className="flex items-center gap-1 ml-1 border-l border-neutral-200 pl-1">
                                                                            <button
                                                                                onClick={() => openEditSectionDrawer(sec, cls)}
                                                                                className="p-0.2 hover:text-black text-black/30 cursor-pointer transition"
                                                                                title="Edit Section"
                                                                            >
                                                                                <Pencil size={8} />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => triggerDeleteSection(sec, cls)}
                                                                                className="p-0.2 hover:text-red-600 text-red-400 cursor-pointer transition"
                                                                                title="Delete Section"
                                                                            >
                                                                                <X size={8} />
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })
                                                    ) : (
                                                        <span className="text-[10px] text-black/35 italic">No sections configured</span>
                                                    )}
                                                    {canEdit && (
                                                        <button
                                                            onClick={() => openAddSectionDrawer(cls)}
                                                            className="inline-flex items-center gap-0.5 px-2 py-0.5 border border-dashed border-light-border hover:border-black text-[9px] font-bold text-black/55 hover:text-black rounded-md transition cursor-pointer"
                                                        >
                                                            + Section
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4 text-center font-semibold text-black/75">
                                                {cls.capacity || "N/A"} seats
                                            </td>
                                            <td className="p-4 text-center font-semibold text-black/60">
                                                {formatYear}
                                            </td>
                                            {canEdit && (
                                                <td className="p-4 text-right">
                                                    <div className="inline-flex items-center justify-end">
                                                        <TableActionMenu
                                                            actions={[
                                                                {
                                                                    label: "Edit Class",
                                                                    icon: <Pencil size={14} />,
                                                                    onClick: () => {
                                                                        setSelectedClass(cls);
                                                                        setIsEditClassDrawerOpen(true);
                                                                    }
                                                                },
                                                                {
                                                                    label: "Delete Class",
                                                                    icon: <Trash2 size={14} />,
                                                                    danger: true,
                                                                    onClick: () => triggerDeleteClass(cls)
                                                                }
                                                            ]}
                                                        />
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modular Slide-over Drawers (Class) */}
            <AddClassDrawer
                isOpen={isAddClassDrawerOpen}
                onClose={() => setIsAddClassDrawerOpen(false)}
                onSave={handleCreateClass}
                isPending={createClassMutation.isPending}
                academicYears={academicYears}
            />

            <EditClassDrawer
                isOpen={isEditClassDrawerOpen}
                onClose={() => setIsEditClassDrawerOpen(false)}
                onSave={handleUpdateClass}
                isPending={updateClassMutation.isPending}
                selectedClass={selectedClass}
                academicYears={academicYears}
            />

            {/* Modular Slide-over Drawers (Section) */}
            {targetClassForSection && (
                <AddSectionDrawer
                    isOpen={isAddSectionDrawerOpen}
                    onClose={() => {
                        setIsAddSectionDrawerOpen(false);
                        setTargetClassForSection(null);
                    }}
                    onSave={handleCreateSection}
                    isPending={createSectionMutation.isPending}
                    classId={targetClassForSection.id}
                    className={targetClassForSection.className}
                    classCapacity={targetClassForSection.capacity}
                    currentSections={targetClassForSection.sections || []}
                    staff={staff}
                />
            )}

            {targetClassForSection && selectedSection && (
                <EditSectionDrawer
                    isOpen={isEditSectionDrawerOpen}
                    onClose={() => {
                        setIsEditSectionDrawerOpen(false);
                        setSelectedSection(null);
                        setTargetClassForSection(null);
                    }}
                    onSave={handleUpdateSection}
                    isPending={updateSectionMutation.isPending}
                    selectedSection={selectedSection}
                    className={targetClassForSection.className}
                    classCapacity={targetClassForSection.capacity}
                    currentSections={targetClassForSection.sections || []}
                    staff={staff}
                />
            )}

            {/* Delete Drawers */}
            <DeleteClassDrawer
                isOpen={isDeleteClassDrawerOpen}
                className={classToDelete?.className || ""}
                onClose={() => {
                    setIsDeleteClassDrawerOpen(false);
                    setClassToDelete(null);
                }}
                onConfirm={handleConfirmDeleteClass}
                isPending={deleteClassMutation.isPending}
            />

            {sectionToDelete && parentClassOfSectionToDelete && (
                <DeleteSectionDrawer
                    isOpen={isDeleteSectionDrawerOpen}
                    sectionName={sectionToDelete.name}
                    className={parentClassOfSectionToDelete.className}
                    onClose={() => {
                        setIsDeleteSectionDrawerOpen(false);
                        setSectionToDelete(null);
                        setParentClassOfSectionToDelete(null);
                    }}
                    onConfirm={handleConfirmDeleteSection}
                    isPending={deleteSectionMutation.isPending}
                />
            )}
        </div>
    );
}
