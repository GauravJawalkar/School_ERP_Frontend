"use client";

import { Role } from "./RolesDashboard";
import { Shield, ShieldAlert, UserCheck, KeyRound, Eye } from "lucide-react";

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
            className={`w-full text-left p-5 rounded-xl border transition-all duration-300 relative overflow-hidden group cursor-pointer flex flex-col justify-between min-h-[170px] ${
                isSelected
                    ? "border-neutral-900 bg-neutral-900 text-white shadow-xl scale-[1.02]"
                    : "border-light-border bg-white text-black hover:border-black/30 hover:shadow-xs"
            }`}
        >
            {/* Top row */}
            <div className="space-y-3 w-full">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 min-w-0">
                        {isSystem ? (
                            <Shield size={14} className={isSelected ? "text-white" : "text-black/80"} />
                        ) : (
                            <ShieldAlert size={14} className={isSelected ? "text-white" : "text-black"} />
                        )}
                        <h3 className={`font-bold text-xs truncate uppercase tracking-wider ${isSelected ? "text-white" : "text-black"}`}>
                            {role.name.replace(/_/g, " ")}
                        </h3>
                    </div>

                    <span
                        className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                            isSelected
                                ? (isSystem ? "bg-white/15 text-white/90 border border-white/20" : "bg-white text-black")
                                : (isSystem ? "bg-neutral-100 text-neutral-600 border border-neutral-200" : "bg-black text-white")
                        }`}
                    >
                        {isSystem ? "System" : "Custom"}
                    </span>
                </div>

                <p className={`text-xs leading-relaxed line-clamp-3 font-normal ${isSelected ? "text-neutral-300" : "text-neutral-500"}`}>
                    {role.description}
                </p>
            </div>

            {/* Bottom details row */}
            <div className={`border-t mt-4 pt-3 flex items-center justify-between text-xs font-semibold w-full ${isSelected ? "border-white/10" : "border-light-border"}`}>
                <div className="flex items-center gap-3.5">
                    <span className={`flex items-center gap-1.5 ${isSelected ? "text-neutral-300" : "text-neutral-600"}`}>
                        <KeyRound size={12} className={isSelected ? "text-neutral-400" : "text-black/45"} />
                        {role.permissions.length} Permissions
                    </span>

                    <span className={`flex items-center gap-1.5 ${isSelected ? "text-neutral-300" : "text-neutral-600"}`}>
                        <UserCheck size={12} className={isSelected ? "text-neutral-400" : "text-black/45"} />
                        {role.assignedUsersCount} Active Users
                    </span>
                </div>

                <span
                    className={`text-xs font-bold transition flex items-center gap-1 ${
                        isSelected ? "text-white" : "text-black/0 group-hover:text-black/60"
                    }`}
                >
                    <Eye size={12} />
                    Inspect Matrix
                </span>
            </div>
        </button>
    );
}
