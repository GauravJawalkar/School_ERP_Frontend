"use client";

import React, { useState, useEffect } from "react";
import { X, ShieldAlert, KeyRound, CornerDownRight } from "lucide-react";
import { Role } from "./RolesDashboard";

interface CreateRoleDrawerProps {
    isOpen: boolean;
    roles: Role[];
    onClose: () => void;
    onSave: (newRole: { name: string; description: string; baseRoleId: number }) => void;
}

export default function CreateRoleDrawer({ isOpen, roles, onClose, onSave }: CreateRoleDrawerProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [baseRoleId, setBaseRoleId] = useState<number>(2); // Default base template: SCHOOL_ADMIN

    // Clear state on open/close triggers
    useEffect(() => {
        if (isOpen) {
            setName("");
            setDescription("");
            setBaseRoleId(2);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) return;

        onSave({
            name: name.trim(),
            description: description.trim() || `Custom configured security profile for ${name}`,
            baseRoleId
        });
    };

    if (!isOpen) return null;

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
                    <div>
                        <h2 className="text-sm font-bold text-black flex items-center gap-1.5 uppercase tracking-wide">
                            <ShieldAlert size={14} className="text-black" />
                            Provision Custom Role
                        </h2>
                        <p className="text-[10px] text-black/50 font-medium">Create a custom security template with inherited module permissions.</p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-full border border-light-border hover:border-black flex items-center justify-center text-black/50 hover:text-black transition cursor-pointer"
                    >
                        <X size={14} />
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-6">
                    {/* Role Name */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-black/70 uppercase tracking-widest block font-mono">
                            Security Identifier / Role Name
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Exam Superintendent"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full h-9 px-3 border border-light-border rounded-lg text-xs text-black placeholder-black/30 focus:border-black focus:outline-hidden transition"
                        />
                        <span className="text-[9px] text-black/40 block leading-tight">
                            Converted dynamically to standard UPPER_SNAKE_CASE on submission.
                        </span>
                    </div>

                    {/* Base Template to Inherit */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-black/70 uppercase tracking-widest block font-mono">
                            Inherit Privileges Template
                        </label>
                        <div className="relative">
                            <select
                                value={baseRoleId}
                                onChange={(e) => setBaseRoleId(Number(e.target.value))}
                                className="w-full h-9 px-3 border border-light-border rounded-lg text-xs text-black focus:border-black focus:outline-hidden bg-white appearance-none cursor-pointer pr-10"
                            >
                                {roles.map((role) => (
                                    <option key={role.id} value={role.id}>
                                        {role.name.replace(/_/g, " ")} ({role.permissionsCount} base permissions)
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-2.5 pointer-events-none text-black/45 text-[10px] font-bold">
                                ▼
                            </div>
                        </div>
                        <span className="text-[9px] text-black/40 block leading-tight flex items-center gap-1">
                            <CornerDownRight size={10} />
                            Initial scope copies all permissions matching the inherited baseline role.
                        </span>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-black/70 uppercase tracking-widest block font-mono">
                            Operational Description
                        </label>
                        <textarea
                            rows={4}
                            placeholder="Detail exact module capabilities and administrative scopes..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={250}
                            className="w-full p-3 border border-light-border rounded-lg text-xs text-black placeholder-black/30 focus:border-black focus:outline-hidden transition resize-none"
                        />
                        <div className="text-right text-[9px] text-black/40 font-mono">
                            {description.length}/250 characters
                        </div>
                    </div>
                </form>

                {/* Footer Controls */}
                <div className="p-4 border-t border-light-border bg-neutral-50/75 flex items-center justify-end gap-2.5">
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-9 px-4 rounded-lg border border-light-border text-xs font-semibold hover:border-black hover:bg-neutral-50 transition cursor-pointer text-black"
                    >
                        Discard
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="h-9 px-5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-black/90 transition cursor-pointer flex items-center gap-1"
                    >
                        <KeyRound size={13} />
                        Confirm Provisioning
                    </button>
                </div>
            </div>
        </div>
    );
}
