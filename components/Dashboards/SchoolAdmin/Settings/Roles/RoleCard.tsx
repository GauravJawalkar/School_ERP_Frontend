"use client";

import { Role } from "./RolesDashboard";
import { Shield, ShieldAlert, ShieldCheck, UserCheck, KeyRound, Lock, Eye } from "lucide-react";

interface RoleCardProps {
    role: Role;
    isSelected: boolean;
    onSelect: () => void;
}

export default function RoleCard({ role, isSelected, onSelect }: RoleCardProps) {
    const isSystem = role.isSystemRole;

    return (
        <button
            type="button"
            onClick={onSelect}
            className={`w-full text-left p-4 rounded-xl border text-black transition-all duration-300 relative overflow-hidden group cursor-pointer flex flex-col justify-between min-h-[160px] ${
                isSelected
                    ? "border-black bg-white shadow-md shadow-neutral-100 ring-1 ring-black/5"
                    : "border-light-border bg-white hover:border-black/30 hover:shadow-xs"
            }`}
        >
            {/* Top row */}
            <div className="space-y-2.5 w-full">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-1.5 min-w-0">
                        {isSystem ? (
                            <Shield size={14} className="text-black/80 shrink-0" />
                        ) : (
                            <ShieldAlert size={14} className="text-black shrink-0" />
                        )}
                        <h3 className="font-bold text-xs truncate uppercase tracking-wide pr-2">
                            {role.name.replace(/_/g, " ")}
                        </h3>
                    </div>

                    <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            isSystem
                                ? "bg-neutral-100 text-neutral-600 border border-neutral-200"
                                : "bg-black text-white"
                        }`}
                    >
                        {isSystem ? "System" : "Custom"}
                    </span>
                </div>

                <p className="text-[11px] text-black/50 leading-relaxed line-clamp-3">
                    {role.description}
                </p>
            </div>

            {/* Bottom details row */}
            <div className="border-t border-light-border mt-4 pt-3 flex items-center justify-between text-[10px] font-bold text-black/60 w-full">
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                        <KeyRound size={11} className="text-black/50" />
                        {role.permissionsCount} Permissions
                    </span>

                    <span className="flex items-center gap-1">
                        <UserCheck size={11} className="text-black/50" />
                        {role.assignedUsersCount} Active Users
                    </span>
                </div>

                <span
                    className={`text-[10px] font-bold transition flex items-center gap-1 ${
                        isSelected ? "text-black" : "text-black/0 group-hover:text-black/40"
                    }`}
                >
                    <Eye size={11} />
                    Inspect Matrix
                </span>
            </div>

            {/* Subtle decorative background detail */}
            <div
                className={`absolute top-0 right-0 w-24 h-24 bg-radial from-neutral-100 to-transparent -mr-6 -mt-6 rounded-full -z-10 opacity-30 transition-all duration-500 group-hover:scale-125 ${
                    isSelected ? "scale-110 opacity-60" : ""
                }`}
            />
        </button>
    );
}
