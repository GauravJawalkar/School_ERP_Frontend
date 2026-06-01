"use client";

import { PermissionGroup } from "./RolesDashboard";
import { Lock, Check } from "lucide-react";

interface PermissionMatrixProps {
    groups: PermissionGroup[];
    rolePermissions: string[]; // Original DB state
    stagedPermissions: string[]; // Current local state
    isLocked: boolean;
    onToggle: (slug: string) => void;
}

export default function PermissionMatrix({
    groups,
    rolePermissions,
    stagedPermissions,
    isLocked,
    onToggle
}: PermissionMatrixProps) {
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
                                const originallyHas = rolePermissions.includes(perm.slug);
                                const currentlyHas = stagedPermissions.includes(perm.slug);

                                const isAdded = currentlyHas && !originallyHas;
                                const isRemoved = !currentlyHas && originallyHas;

                                return (
                                    <tr
                                        key={perm.id}
                                        className="group text-xs text-black/80 hover:bg-neutral-50/50 transition-colors bg-white"
                                    >
                                        {/* Module display name on first row of module group */}
                                        {pIdx === 0 ? (
                                            <td
                                                rowSpan={group.permissions.length}
                                                className="py-4 px-4 font-medium border-r border-light-border text-black align-top bg-white"
                                            >
                                                <div className="sticky top-2">
                                                    <span className="text-sm block">{group.displayName}</span>
                                                    <span className="text-xs font-medium text-black/35 font-mono uppercase tracking-wider block mt-1">
                                                        {group.module}
                                                    </span>
                                                </div>
                                            </td>
                                        ) : null}

                                        {/* Permission Slug */}
                                        <td className="py-3.5 px-4 font-mono font-medium text-[11px] text-neutral-800">
                                            {perm.slug}
                                        </td>

                                        {/* Description with inline changed indicator */}
                                        <td className="py-3.5 px-4 text-black/60 leading-relaxed font-medium">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span>{perm.description}</span>
                                                {isAdded && (
                                                    <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full animate-pulse">
                                                        + Staged Add
                                                    </span>
                                                )}
                                                {isRemoved && (
                                                    <span className="text-[10px] font-medium text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                                                        - Staged Remove
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Staged Toggle Action */}
                                        <td className="py-3.5 px-4 text-center">
                                            <div className="flex items-center justify-center">
                                                {isLocked ? (
                                                    <div
                                                        className={`w-7 h-7 rounded-full flex items-center justify-center border transition ${currentlyHas
                                                            ? "bg-neutral-100 border-neutral-300 text-neutral-600"
                                                            : "bg-neutral-50/50 border-neutral-200 text-neutral-300"
                                                            }`}
                                                        title="This template configuration is currently locked."
                                                    >
                                                        {currentlyHas ? <Check size={12} strokeWidth={3} /> : <Lock size={10} />}
                                                    </div>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => onToggle(perm.slug)}
                                                        className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-hidden cursor-pointer ${currentlyHas ? "bg-black" : "bg-neutral-200"
                                                            }`}
                                                    >
                                                        <div
                                                            className={`w-5 h-5 rounded-full bg-white transition-transform duration-300 flex items-center justify-center shadow-xs ${currentlyHas ? "translate-x-4" : "translate-x-0"
                                                                }`}
                                                        >
                                                            {currentlyHas && (
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
