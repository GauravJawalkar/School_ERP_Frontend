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
    Coins,
    PlusCircle
} from "lucide-react";

import MapClassFeeDrawer from "./MapClassFeeDrawer";
import AddFeeCategoryDrawer from "./AddFeeCategoryDrawer";
import EditClassFeeDrawer from "./EditClassFeeDrawer";
import DeleteFeeStructureDrawer from "./DeleteFeeStructureDrawer";
import TableActionMenu from "@/components/Commons/TableActionMenu";

interface FeeStructure {
    id: number;
    classId: number;
    feeHeadId: number;
    feeHeadName: string | null;
    feeType: string | null;
    amount: string;
    frequency: string;
    isCompulsory: boolean;
    dueDay: number | null;
}

interface FeesTableProps {
    feeStructures: FeeStructure[];
    classes: any[];
    schoolId: number;
    canEdit: boolean;
    refetchSchoolDetails: () => void;
}

export default function FeesTable({
    feeStructures,
    classes,
    schoolId,
    canEdit,
    refetchSchoolDetails
}: FeesTableProps) {
    // Drawer open/close states
    const [isStructureDrawerOpen, setIsStructureDrawerOpen] = useState(false);
    const [isFeeHeadDrawerOpen, setIsFeeHeadDrawerOpen] = useState(false);
    const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
    const [selectedStructure, setSelectedStructure] = useState<FeeStructure | null>(null);

    // Delete drawer states
    const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
    const [feeToDelete, setFeeToDelete] = useState<FeeStructure | null>(null);

    // 1. Query: Fetch Fee Heads for this school
    const { data: feeHeads = [], refetch: refetchFeeHeads } = useQuery({
        queryKey: ["getFeeHeadsList", schoolId],
        queryFn: async () => {
            const response = await ApiClient.get(`${BASE_URL}/finance/feeHeads?instituteId=${schoolId}`);
            return response.data?.data || [];
        },
        enabled: !!schoolId
    });

    // 2. Query: Fetch Academic Years for this school
    const { data: academicYears = [] } = useQuery({
        queryKey: ["getAcademicYearsList", schoolId],
        queryFn: async () => {
            const response = await ApiClient.get(`${BASE_URL}/admin/academicYears?instituteId=${schoolId}`);
            return response.data?.data || [];
        },
        enabled: !!schoolId
    });

    // 3. Mutation: Create Fee Head (Category)
    const createFeeHeadMutation = useMutation({
        mutationFn: async (payload: {
            feeName: string;
            feeType: string;
            description: string;
        }) => {
            const response = await ApiClient.post(`${BASE_URL}/finance/createFeeHead`, {
                ...payload,
                instituteId: schoolId
            });
            return response.data;
        },
        onSuccess: () => {
            toast.success("Fee category created successfully");
            refetchFeeHeads();
            setIsFeeHeadDrawerOpen(false);
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to create fee head");
        }
    });

    // 4. Mutation: Create Fee Structure Mapping
    const createFeeStructureMutation = useMutation({
        mutationFn: async (payload: {
            classId: number;
            feeHeadId: number;
            amount: number;
            frequency: string;
            isCompulsory: boolean;
            dueDay: number | null;
        }) => {
            const response = await ApiClient.post(`${BASE_URL}/finance/createFeeStructure`, {
                ...payload,
                instituteId: schoolId
            });
            return response.data;
        },
        onSuccess: () => {
            toast.success("Fee structure mapped successfully");
            refetchSchoolDetails();
            setIsStructureDrawerOpen(false);
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to create fee structure mapping");
        }
    });

    // 5. Mutation: Update Fee Structure
    const updateFeeStructureMutation = useMutation({
        mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
            const response = await ApiClient.patch(`${BASE_URL}/finance/feeStructure/${id}`, payload);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Fee structure updated successfully");
            refetchSchoolDetails();
            setIsEditDrawerOpen(false);
            setSelectedStructure(null);
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to update fee structure");
        }
    });

    // 6. Mutation: Delete Fee Structure
    const deleteFeeStructureMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await ApiClient.delete(`${BASE_URL}/finance/feeStructure/${id}`);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Fee structure deleted successfully");
            refetchSchoolDetails();
            setIsDeleteDrawerOpen(false);
            setFeeToDelete(null);
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to delete fee structure");
        }
    });

    const handleCreateFeeHead = (payload: any) => {
        createFeeHeadMutation.mutate(payload);
    };

    const handleCreateFeeStructure = (payload: any) => {
        createFeeStructureMutation.mutate(payload);
    };

    const handleUpdateFeeStructure = (payload: any) => {
        if (!selectedStructure) return;
        updateFeeStructureMutation.mutate({
            id: selectedStructure.id,
            payload
        });
    };

    const triggerDeleteFeeStructure = (fee: FeeStructure) => {
        setFeeToDelete(fee);
        setIsDeleteDrawerOpen(true);
    };

    const handleConfirmDeleteFeeStructure = () => {
        if (!feeToDelete) return;
        deleteFeeStructureMutation.mutate(feeToDelete.id);
    };

    const openEditDrawer = (struct: FeeStructure) => {
        setSelectedStructure(struct);
        setIsEditDrawerOpen(true);
    };

    return (
        <div className="space-y-4">
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-sm font-bold text-black uppercase tracking-wider flex items-center gap-1.5 select-none">
                        <Coins size={14} />
                        Campus Fee Profiles
                    </h2>
                    <p className="text-[10px] text-black/45 font-medium mt-0.5">
                        Configure billing heads, associate compulsory / optional class-level dues, and set due schedules.
                    </p>
                </div>
                {canEdit && (
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button
                            onClick={() => setIsFeeHeadDrawerOpen(true)}
                            className="h-8 px-3 rounded-lg border border-light-border bg-white hover:bg-neutral-50 font-bold text-xs text-black transition cursor-pointer flex items-center gap-1"
                        >
                            <PlusCircle size={14} />
                            Add Fee Category
                        </button>
                        <button
                            onClick={() => setIsStructureDrawerOpen(true)}
                            className="h-8 px-3 rounded-lg bg-black text-white hover:bg-black/90 font-bold text-xs transition cursor-pointer flex items-center gap-1"
                        >
                            <Plus size={14} />
                            Map Class Fee
                        </button>
                    </div>
                )}
            </div>

            {/* Fees Table */}
            <div className="bg-white border border-light-border rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b border-light-border bg-neutral-50/50 text-[10px] font-bold text-black/45 uppercase tracking-wider">
                                <th className="p-4 font-bold">Fee Category</th>
                                <th className="p-4 font-bold">Target Classroom</th>
                                <th className="p-4 font-bold">Total Amount</th>
                                <th className="p-4 font-bold">Due Frequency</th>
                                <th className="p-4 font-bold">Compulsory?</th>
                                <th className="p-4 font-bold">Monthly Due Date</th>
                                {canEdit && <th className="p-4 font-bold text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-light-border text-xs">
                            {!feeStructures || feeStructures.length === 0 ? (
                                <tr>
                                    <td colSpan={canEdit ? 7 : 6} className="p-8 text-center text-black/40 font-semibold">
                                        No active fee structure configurations mapped to this school profile.
                                    </td>
                                </tr>
                            ) : (
                                feeStructures.map((fee) => {
                                    const matchedClass = classes.find((c: any) => c.id === fee.classId);
                                    return (
                                        <tr key={fee.id} className="hover:bg-neutral-50/50 transition">
                                            <td className="p-4 font-bold text-black">
                                                {fee.feeHeadName || "Unspecified Category"}
                                                {fee.feeType && (
                                                    <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded-sm bg-neutral-100 text-[9px] font-semibold text-neutral-600 uppercase tracking-wide">
                                                        {fee.feeType}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 font-semibold text-black/70">
                                                Class {matchedClass?.className || "General / Unknown"}
                                            </td>
                                            <td className="p-4 font-mono font-bold text-black/85">
                                                ₹{Number(fee.amount).toLocaleString("en-IN")}
                                            </td>
                                            <td className="p-4 font-semibold text-black/60 capitalize">
                                                {fee.frequency.toLowerCase()}
                                            </td>
                                            <td className="p-4">
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                        fee.isCompulsory
                                                            ? "bg-green-50 text-green-700 border border-green-200"
                                                            : "bg-gray-50 text-gray-500 border border-light-border"
                                                    }`}
                                                >
                                                    {fee.isCompulsory ? "Compulsory" : "Optional"}
                                                </span>
                                            </td>
                                            <td className="p-4 font-semibold text-black/60">
                                                Day {fee.dueDay ?? "N/A"}
                                            </td>
                                            {canEdit && (
                                                <td className="p-4 text-right">
                                                    <div className="inline-flex items-center justify-end">
                                                        <TableActionMenu
                                                            actions={[
                                                                {
                                                                    label: "Edit Fee Mapping",
                                                                    icon: <Pencil size={14} />,
                                                                    onClick: () => openEditDrawer(fee)
                                                                },
                                                                {
                                                                    label: "Remove Mapping",
                                                                    icon: <Trash2 size={14} />,
                                                                    danger: true,
                                                                    onClick: () => triggerDeleteFeeStructure(fee)
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

            {/* Modular Slide-over Drawers */}
            <MapClassFeeDrawer
                isOpen={isStructureDrawerOpen}
                onClose={() => setIsStructureDrawerOpen(false)}
                onSave={handleCreateFeeStructure}
                isPending={createFeeStructureMutation.isPending}
                academicYears={academicYears}
                classes={classes}
                feeHeads={feeHeads}
                onCreateFeeHeadClick={() => {
                    setIsStructureDrawerOpen(false);
                    // Open the fee head drawer after a tiny delay to allow clean close transition
                    setTimeout(() => {
                        setIsFeeHeadDrawerOpen(true);
                    }, 350);
                }}
            />

            <AddFeeCategoryDrawer
                isOpen={isFeeHeadDrawerOpen}
                onClose={() => setIsFeeHeadDrawerOpen(false)}
                onSave={handleCreateFeeHead}
                isPending={createFeeHeadMutation.isPending}
            />

            <EditClassFeeDrawer
                isOpen={isEditDrawerOpen}
                onClose={() => setIsEditDrawerOpen(false)}
                onSave={handleUpdateFeeStructure}
                isPending={updateFeeStructureMutation.isPending}
                selectedStructure={selectedStructure}
                classes={classes}
            />

            {/* Delete Fee Drawer */}
            {feeToDelete && (
                <DeleteFeeStructureDrawer
                    isOpen={isDeleteDrawerOpen}
                    feeHeadName={feeToDelete.feeHeadName || "Unspecified Category"}
                    className={classes.find(c => c.id === feeToDelete.classId)?.className || "General / Unknown"}
                    amount={Number(feeToDelete.amount)}
                    frequency={feeToDelete.frequency}
                    onClose={() => {
                        setIsDeleteDrawerOpen(false);
                        setFeeToDelete(null);
                    }}
                    onConfirm={handleConfirmDeleteFeeStructure}
                    isPending={deleteFeeStructureMutation.isPending}
                />
            )}
        </div>
    );
}
