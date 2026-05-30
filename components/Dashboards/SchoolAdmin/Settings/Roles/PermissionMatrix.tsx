"use client";

import { PermissionGroup } from "./RolesDashboard";
import { Lock, Check, ToggleLeft, ToggleRight } from "lucide-react";

interface PermissionMatrixProps {
    groups: PermissionGroup[];
    rolePermissions: string[];
    isLocked: boolean;
    onToggle: (slug: string, action: "add" | "remove") => void;
}

export default function PermissionMatrix({ groups, rolePermissions, isLocked, onToggle }: PermissionMatrixProps) {
    return (
        <div className="border border-light-border bg-white rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-neutral-50/75 border-b border-light-border text-[10px] font-bold text-black/50 uppercase tracking-widest">
                            <th className="py-3 px-4 font-semibold w-1/4">Functional Module</th>
                            <th className="py-3 px-4 font-semibold w-1/3">Explicit Capability Slug</th>
                            <th className="py-3 px-4 font-semibold w-2/5">Functional Scope Details</th>
                            <th className="py-3 px-4 font-semibold text-center w-1/12">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-light-border">
                        {groups.map((group) =>
                            group.permissions.map((perm, pIdx) => {
                                const hasPermission = rolePermissions.includes(perm.slug);

                                return (
                                    <tr
                                        key={perm.id}
                                        className={`group text-xs text-black/80 hover:bg-neutral-50/50 transition-colors ${
                                            hasPermission ? "bg-white" : "bg-white"
                                        }`}
                                    >
                                        {/* Module display name on first row of module group */}
                                        {pIdx === 0 ? (
                                            <td
                                                rowSpan={group.permissions.length}
                                                className="py-4 px-4 font-bold border-r border-light-border text-black align-top bg-white"
                                            >
                                                <div className="sticky top-2">
                                                    <span className="text-[11px] block">{group.displayName}</span>
                                                    <span className="text-[9px] font-bold text-black/35 font-mono uppercase tracking-wider block mt-1">
                                                        {group.module}
                                                    </span>
                                                </div>
                                            </td>
                                        ) : null}

                                        {/* Permission Slug */}
                                        <td className="py-3.5 px-4 font-mono font-medium text-[11px] text-neutral-800">
                                            {perm.slug}
                                        </td>

                                        {/* Description */}
                                        <td className="py-3.5 px-4 text-black/60 leading-relaxed font-medium">
                                            {perm.description}
                                        </td>

                                        {/* Toggle Action */}
                                        <td className="py-3.5 px-4 text-center">
                                            <div className="flex items-center justify-center">
                                                {isLocked ? (
                                                    <div
                                                        className={`w-7 h-7 rounded-full flex items-center justify-center border transition ${
                                                            hasPermission
                                                                ? "bg-neutral-100 border-neutral-300 text-neutral-600"
                                                                : "bg-neutral-50/50 border-neutral-200 text-neutral-300"
                                                        }`}
                                                        title="System roles are immutable. Clone this template to create a customizable role."
                                                    >
                                                        {hasPermission ? <Check size={12} strokeWidth={3} /> : <Lock size={10} />}
                                                    </div>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onToggle(perm.slug, hasPermission ? "remove" : "add")
                                                        }
                                                        className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-hidden cursor-pointer ${
                                                            hasPermission ? "bg-black" : "bg-neutral-200"
                                                        }`}
                                                    >
                                                        <div
                                                            className={`w-5 h-5 rounded-full bg-white transition-transform duration-300 flex items-center justify-center shadow-xs ${
                                                                hasPermission ? "translate-x-4" : "translate-x-0"
                                                            }`}
                                                        >
                                                            {hasPermission && (
                                                                <div className="w-1.5 h-1.5 rounded-full bg-black" />
                                                            )}
                                                        </div>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
