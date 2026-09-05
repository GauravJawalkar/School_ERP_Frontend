"use client";

import React, { ReactNode } from "react";
import { Search, X, CirclePlus } from "lucide-react";
import TableColumnVisibility from "@/shared_components/Commons/TableColumnVisibility";
import { TableColumnOption } from "@/hooks/useTableColumns";
import { FilterTabOption, PrimaryActionConfig } from "./DataTableTypes";
import { CanAccess } from "@/shared_components/Auth/CanAccess";

interface DataTableToolbarProps<T> {
    title?: string;
    subtitle?: string;
    searchable?: boolean;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    searchPlaceholder?: string;

    // Filter Tabs
    filterTabs?: FilterTabOption<T>[];
    activeFilter?: string;
    onFilterChange?: (filter: string) => void;

    // Actions & Tools
    primaryAction?: PrimaryActionConfig;
    toolbarExtra?: ReactNode;

    // Column Visibility
    columns: TableColumnOption[];
    isVisible: (columnId: string) => boolean;
    onToggleColumn: (columnId: string) => void;
    onShowAllColumns: () => void;
    onResetColumns: () => void;
    showColumnVisibility?: boolean;

    // Batch Selection Banner
    selectedCount?: number;
    batchActions?: ReactNode;
    onClearSelection?: () => void;
}

export function DataTableToolbar<T>({
    title,
    subtitle,
    searchable = true,
    searchQuery,
    onSearchChange,
    searchPlaceholder = "Search records...",
    filterTabs,
    activeFilter,
    onFilterChange,
    primaryAction,
    toolbarExtra,
    columns,
    isVisible,
    onToggleColumn,
    onShowAllColumns,
    onResetColumns,
    showColumnVisibility = true,
    selectedCount = 0,
    batchActions,
    onClearSelection
}: DataTableToolbarProps<T>) {
    const hasHeaderTitle = Boolean(title || subtitle);

    const renderPrimaryButton = () => {
        if (!primaryAction) return null;

        const buttonContent = (
            <button
                type="button"
                onClick={primaryAction.onClick}
                disabled={primaryAction.disabled}
                className={`inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ${
                    primaryAction.variant === "dashed"
                        ? "border border-light-border border-dashed hover:bg-neutral-100 text-black"
                        : "bg-black text-white hover:bg-neutral-800 shadow-xs"
                }`}
            >
                {primaryAction.icon || <CirclePlus size={14} />}
                <span>{primaryAction.label}</span>
            </button>
        );

        if (primaryAction.permission) {
            return <CanAccess permission={primaryAction.permission}>{buttonContent}</CanAccess>;
        }

        return buttonContent;
    };

    return (
        <div className="border-b border-light-border bg-gray-50/20">
            {/* Optional Header Title */}
            {hasHeaderTitle && (
                <div className="px-4 pt-4 pb-1">
                    {title && <h2 className="text-base font-semibold text-black/90">{title}</h2>}
                    {subtitle && <p className="text-xs text-black/45 mt-0.5">{subtitle}</p>}
                </div>
            )}

            {/* Batch Selection Banner */}
            {selectedCount > 0 ? (
                <div className="p-3 bg-neutral-900 text-white flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200">
                    <div className="flex items-center gap-2 text-xs font-semibold">
                        <span className="bg-white/20 text-white px-2 py-0.5 rounded-md text-[11px]">
                            {selectedCount} selected
                        </span>
                        {onClearSelection && (
                            <button
                                type="button"
                                onClick={onClearSelection}
                                className="text-white/70 hover:text-white underline text-[11px] cursor-pointer ml-1"
                            >
                                Deselect all
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-2">{batchActions}</div>
                </div>
            ) : null}

            {/* Main Controls Row */}
            <div className="p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
                {/* Left: Search Bar */}
                {searchable ? (
                    <div className="relative w-full md:w-80">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full border border-input-border text-xs pl-9 pr-8 py-2 outline-none rounded-lg focus:ring-2 focus:ring-black/10 transition bg-white"
                        />
                        {searchQuery ? (
                            <button
                                type="button"
                                onClick={() => onSearchChange("")}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition cursor-pointer"
                            >
                                <X size={13} />
                            </button>
                        ) : null}
                    </div>
                ) : (
                    <div />
                )}

                {/* Right: Filter Tabs, Extra, Primary Action & Column Visibility */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                    {/* Filter Tabs */}
                    {filterTabs && filterTabs.length > 0 && onFilterChange && (
                        <div className="flex items-center gap-1 overflow-x-auto slim-scrollbar pb-1 md:pb-0">
                            {filterTabs.map((tab) => {
                                const isActive = (activeFilter || "ALL") === tab.value;
                                return (
                                    <button
                                        key={tab.value}
                                        type="button"
                                        onClick={() => onFilterChange(tab.value)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 inline-flex items-center gap-1.5 ${
                                            isActive
                                                ? "bg-black text-white shadow-xs"
                                                : "bg-white text-black/55 hover:bg-neutral-50 hover:text-black border border-light-border"
                                        }`}
                                    >
                                        <span>{tab.label}</span>
                                        {tab.count !== undefined && (
                                            <span
                                                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                                                    isActive ? "bg-white/20 text-white" : "bg-neutral-100 text-black/60"
                                                }`}
                                            >
                                                {tab.count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Toolbar Extra slot */}
                    {toolbarExtra}

                    {/* Primary Action Button */}
                    {renderPrimaryButton()}

                    {/* Table Column Visibility */}
                    {showColumnVisibility && columns.length > 0 && (
                        <TableColumnVisibility
                            columns={columns}
                            isVisible={isVisible}
                            onToggle={onToggleColumn}
                            onShowAll={onShowAllColumns}
                            onReset={onResetColumns}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
