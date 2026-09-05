"use client";

import React, { ReactNode } from "react";
import { ShieldAlert, RotateCcw } from "lucide-react";

interface DataTableEmptyStateProps {
    colSpan: number;
    title?: string;
    description?: string;
    icon?: ReactNode;
    actionLabel?: string;
    onAction?: () => void;
    hasActiveFilter?: boolean;
    onResetFilters?: () => void;
}

export function DataTableEmptyState({
    colSpan,
    title = "No records found",
    description = "No matching records found in this dataset.",
    icon,
    actionLabel,
    onAction,
    hasActiveFilter = false,
    onResetFilters
}: DataTableEmptyStateProps) {
    return (
        <tr>
            <td colSpan={colSpan} className="p-12 text-center text-black/50">
                <div className="flex flex-col items-center justify-center gap-2.5 max-w-sm mx-auto">
                    {icon ? (
                        <div className="text-black/30 mb-1">{icon}</div>
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-black/30 mb-1">
                            <ShieldAlert size={20} />
                        </div>
                    )}
                    <p className="font-semibold text-xs text-black/80">{title}</p>
                    <p className="text-[11px] text-black/45 leading-relaxed">{description}</p>

                    {hasActiveFilter && onResetFilters ? (
                        <button
                            type="button"
                            onClick={onResetFilters}
                            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-black bg-neutral-100 hover:bg-neutral-200 rounded-lg transition cursor-pointer"
                        >
                            <RotateCcw size={13} />
                            Reset Filters
                        </button>
                    ) : actionLabel && onAction ? (
                        <button
                            type="button"
                            onClick={onAction}
                            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-black hover:bg-neutral-800 rounded-lg transition cursor-pointer"
                        >
                            {actionLabel}
                        </button>
                    ) : null}
                </div>
            </td>
        </tr>
    );
}
