"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { SlidersHorizontal, Check, Search, RotateCcw, Lock } from "lucide-react";
import { TableColumnOption } from "@/hooks/useTableColumns";

export interface TableColumnVisibilityProps<T extends string = string> {
    columns: TableColumnOption<T>[];
    isVisible: (columnId: T) => boolean;
    onToggle: (columnId: T) => void;
    onShowAll?: () => void;
    onReset?: () => void;
    buttonLabel?: string;
    showCountBadge?: boolean;
    disabled?: boolean;
    className?: string;
}

export function TableColumnVisibility<T extends string = string>({
    columns,
    isVisible,
    onToggle,
    onShowAll,
    onReset,
    buttonLabel = "View",
    showCountBadge = true,
    disabled = false,
    className = ""
}: TableColumnVisibilityProps<T>) {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const visibleCount = useMemo(() => {
        return columns.filter((c) => isVisible(c.id)).length;
    }, [columns, isVisible]);

    const totalCount = columns.length;

    const filteredColumns = useMemo(() => {
        if (!searchQuery.trim()) return columns;
        return columns.filter((col) =>
            col.label.toLowerCase().includes(searchQuery.toLowerCase().trim())
        );
    }, [columns, searchQuery]);

    const updatePosition = () => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        const dropdownWidth = 240;
        const dropdownHeight = 320;

        const openUp = window.innerHeight - rect.bottom < dropdownHeight && rect.top > dropdownHeight;
        const alignRight = rect.right > window.innerWidth - 20;

        setDropdownStyle({
            position: "fixed",
            top: openUp ? undefined : rect.bottom + 6,
            bottom: openUp ? window.innerHeight - rect.top + 6 : undefined,
            left: alignRight ? undefined : Math.max(10, rect.left + rect.width - dropdownWidth),
            right: alignRight ? 10 : undefined,
            width: dropdownWidth,
            zIndex: 9999
        });
    };

    const toggleDropdown = () => {
        if (disabled) return;
        if (!open) {
            updatePosition();
            setSearchQuery("");
        }
        setOpen((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent | TouchEvent) => {
            const target = e.target as Node;
            if (!target?.isConnected) return;
            if (
                triggerRef.current?.contains(target) ||
                dropdownRef.current?.contains(target)
            ) {
                return;
            }
            setOpen(false);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };

        const handleScroll = () => {
            if (open) updatePosition();
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        window.addEventListener("scroll", handleScroll, true);
        window.addEventListener("resize", handleScroll);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("scroll", handleScroll, true);
            window.removeEventListener("resize", handleScroll);
        };
    }, [open]);

    return (
        <div className={`relative inline-block ${className}`}>
            <button
                ref={triggerRef}
                type="button"
                onClick={toggleDropdown}
                disabled={disabled}
                className="flex items-center justify-center gap-2 text-xs font-semibold px-3 py-1.5 border border-light-border rounded-lg bg-black text-white hover:bg-black/90 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs"
            >
                <SlidersHorizontal size={13} className="text-white/80" />
                <span>{buttonLabel}</span>
                {showCountBadge && (
                    <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-mono font-medium text-white">
                        {visibleCount}/{totalCount}
                    </span>
                )}
            </button>

            {open &&
                createPortal(
                    <div
                        ref={dropdownRef}
                        style={dropdownStyle}
                        className="bg-white rounded-xl shadow-2xl border border-light-border text-xs z-50 overflow-hidden flex flex-col divide-y divide-light-border animate-in fade-in zoom-in-95 duration-150"
                    >
                        {/* Header */}
                        <div className="px-3 py-2.5 bg-gray-50/70 flex items-center justify-between">
                            <span className="font-semibold text-black text-xs">Toggle Columns</span>
                            <span className="text-[10px] text-black/50 font-medium font-mono">
                                {visibleCount} of {totalCount} shown
                            </span>
                        </div>

                        {/* Search Filter (shown if > 5 columns) */}
                        {columns.length > 5 && (
                            <div className="p-2 bg-white">
                                <div className="relative">
                                    <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-black/40" />
                                    <input
                                        type="text"
                                        placeholder="Filter columns..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full text-xs pl-7 pr-2.5 py-1 border border-input-border rounded-md outline-hidden focus:border-black transition"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Column List */}
                        <div className="max-h-56 overflow-y-auto slim-scrollbar p-1 space-y-0.5">
                            {filteredColumns.map((col) => {
                                const checked = isVisible(col.id);
                                const isLocked = col.isAlwaysVisible;

                                return (
                                    <label
                                        key={col.id}
                                        onClick={(e) => {
                                            if (isLocked) {
                                                e.preventDefault();
                                                return;
                                            }
                                            onToggle(col.id);
                                        }}
                                        className={`flex items-center justify-between gap-2 text-xs p-2 rounded-lg select-none transition ${
                                            isLocked
                                                ? "opacity-80 cursor-not-allowed bg-gray-50/50 text-black/60"
                                                : "cursor-pointer hover:bg-gray-100 text-black/80 hover:text-black"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 truncate">
                                            <div
                                                className={`w-4 h-4 rounded border flex items-center justify-center transition shrink-0 ${
                                                    checked
                                                        ? "bg-black border-black text-white"
                                                        : "border-gray-300 bg-white"
                                                }`}
                                            >
                                                {checked && <Check size={11} strokeWidth={3} />}
                                            </div>
                                            <span className="truncate font-medium">{col.label}</span>
                                        </div>

                                        {isLocked && (
                                            <span className="text-[9px] font-bold text-black/40 bg-neutral-100 border border-light-border px-1.5 py-0.5 rounded flex items-center gap-1 shrink-0">
                                                <Lock size={9} />
                                                Locked
                                            </span>
                                        )}
                                    </label>
                                );
                            })}

                            {filteredColumns.length === 0 && (
                                <div className="p-4 text-center text-xs text-black/40">
                                    No columns matching &quot;{searchQuery}&quot;
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        {(onShowAll || onReset) && (
                            <div className="p-2 bg-gray-50/50 flex items-center justify-between gap-2 text-[11px]">
                                {onShowAll && (
                                    <button
                                        type="button"
                                        onClick={onShowAll}
                                        className="text-black/70 hover:text-black font-semibold hover:underline cursor-pointer transition px-1"
                                    >
                                        Select All
                                    </button>
                                )}
                                {onReset && (
                                    <button
                                        type="button"
                                        onClick={onReset}
                                        className="text-black/50 hover:text-black flex items-center gap-1 font-medium hover:underline cursor-pointer transition px-1"
                                    >
                                        <RotateCcw size={10} />
                                        Reset
                                    </button>
                                )}
                            </div>
                        )}
                    </div>,
                    document.body
                )}
        </div>
    );
}

export default TableColumnVisibility;
