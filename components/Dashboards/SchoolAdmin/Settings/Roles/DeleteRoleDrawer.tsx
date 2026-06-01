"use client";

import React, { useState, useEffect } from "react";
import { X, Trash2, ShieldAlert, AlertTriangle } from "lucide-react";
import { Role } from "./RolesDashboard";

interface DeleteRoleDrawerProps {
    isOpen: boolean;
    role: Role | null;
    onClose: () => void;
    onConfirmDelete: (roleId: number) => void;
    isPending: boolean;
}

export default function DeleteRoleDrawer({
    isOpen,
    role,
    onClose,
    onConfirmDelete,
    isPending
}: DeleteRoleDrawerProps) {
    const [confirmName, setConfirmName] = useState("");

    // Reset safety confirm input when opened
    useEffect(() => {
        if (isOpen) {
            setConfirmName("");
        }
    }, [isOpen]);

    if (!isOpen || !role) return null;

    const isMatch = confirmName.trim().toUpperCase() === role.name.trim().toUpperCase();

    const handleSubmit = (e?: React.FormEvent | React.MouseEvent) => {
        if (e) e.preventDefault();
        if (!isMatch || isPending) return;
        onConfirmDelete(role.id);
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop overlay */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-xs transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Slide-over Container */}
            <div className="relative w-full max-w-md h-full bg-white border-l border-light-border shadow-2xl flex flex-col justify-between z-10 animate-slide-in">
                {/* Header */}
                <div className="p-5 border-b border-light-border flex items-center justify-between">

                    <div className="flex items-center gap-4">
                        <ShieldAlert size={12} className="text-red-600 w-10 h-10" />
                        <div>
                            <h2 className="text-base font-medium text-black tracking-tight">Delete Security Role</h2>
                            <p className="text-xs text-black/60 font-normal">Delete custom administrative role templates.</p>
                        </div>
                    </div>
                    {/* <div>
                        <ShieldAlert size={14} className="text-red-600" />
                        <h2 className="text-sm font-semibold text-red-600 flex items-center gap-1.5 uppercase tracking-wide">
                            Delete Security Role
                        </h2>
                        <p className="text-xs text-black/50 font-normal">Decommission and delete custom administrative security role templates.</p>
                    </div> */}

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-full border border-light-border hover:border-black flex items-center justify-center text-black/50 hover:text-black transition cursor-pointer"
                    >
                        <X size={14} />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-6">
                    {/* Deletion Warning Box */}
                    <div className="p-4 bg-red-50/50 border border-red-100 rounded-lg space-y-3">
                        <div className="flex items-start gap-2.5">
                            <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={16} />
                            <div>
                                <h3 className="text-xs font-bold  uppercase tracking-wide leading-none">Critical Security Warning</h3>
                                <p className="text-xs mt-1.5 leading-relaxed text-gray-700">
                                    You are about to permanently delete the custom role <strong className="font-mono bg-red-100/50 px-1 py-0.5 rounded text-red-700 text-xs">{role.name}</strong>.
                                </p>
                            </div>
                        </div>

                        <ul className="text-xs text-gray-700 space-y-2 list-disc pl-4 pt-1">
                            <li>All permissions and capabilities mapped to this role will be destroyed.</li>
                            <li>Assigned members (<strong className="text-red-700">{role.assignedUsersCount} users</strong>) will immediately lose this role and may lose platform directory access.</li>
                            <li>This action is irreversible. All linked logs will be unreferenced.</li>
                        </ul>
                    </div>

                    {/* Safety confirmation name check */}
                    <div className="space-y-2 pt-2">
                        <label className="text-xs font-bold text-black/70 uppercase tracking-widest block font-mono">
                            Type Role Name to Confirm
                        </label>
                        <p className="text-xs text-black/45 leading-normal">
                            To ensure you want to perform this operation, type the role name <strong className="font-mono text-black font-semibold">{role.name}</strong> in the field below:
                        </p>
                        <input
                            type="text"
                            required
                            placeholder={role.name}
                            value={confirmName}
                            onChange={(e) => setConfirmName(e.target.value)}
                            className="w-full h-10 px-3 border border-light-border rounded-lg text-xs font-mono font-bold text-red-600 placeholder-black/25 focus:border-red-600 focus:outline-hidden transition bg-gray-50/50 uppercase"
                        />
                    </div>
                </form>

                {/* Footer Controls */}
                <div className="p-4 border-t border-light-border bg-neutral-50/75 flex items-center justify-end gap-2.5">
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-9 px-4 rounded-lg border border-light-border text-xs font-semibold hover:border-black hover:bg-neutral-50 transition cursor-pointer text-black"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={!isMatch || isPending}
                        className={`h-9 px-5 rounded-lg text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-xs ${isMatch && !isPending
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-neutral-200 text-neutral-400 cursor-not-allowed border border-neutral-300 shadow-none"
                            }`}
                    >
                        <Trash2 size={13} />
                        {isPending ? "Deleting Role..." : "Permanently Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}
