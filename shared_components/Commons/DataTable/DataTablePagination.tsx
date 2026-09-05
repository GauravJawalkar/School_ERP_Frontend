"use client";

import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface DataTablePaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    pageSizeOptions?: number[];
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    footerText?: string;
}

export function DataTablePagination({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    pageSizeOptions = [10, 25, 50, 100],
    onPageChange,
    onPageSizeChange,
    footerText
}: DataTablePaginationProps) {
    if (totalItems === 0) return null;

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    return (
        <div className="p-3.5 border-t border-light-border bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-medium text-black/55 select-none">
            {/* Left: Summary and Custom Footer Text */}
            <div className="flex items-center gap-2">
                <span>
                    Showing <strong className="text-black font-semibold">{startItem}</strong> to{" "}
                    <strong className="text-black font-semibold">{endItem}</strong> of{" "}
                    <strong className="text-black font-semibold">{totalItems}</strong> entries
                </span>
                {footerText && (
                    <>
                        <span className="text-black/25">•</span>
                        <span className="text-black/45">{footerText}</span>
                    </>
                )}
            </div>

            {/* Right: Page Size Selector & Controls */}
            <div className="flex items-center gap-3">
                {/* Page Size Picker */}
                <div className="flex items-center gap-1.5">
                    <span className="text-black/45">Rows per page:</span>
                    <select
                        value={pageSize}
                        onChange={(e) => onPageSizeChange(Number(e.target.value))}
                        className="bg-white border border-light-border rounded-md px-1.5 py-1 text-[11px] font-semibold text-black/80 outline-none focus:ring-1 focus:ring-black/20 cursor-pointer"
                    >
                        {pageSizeOptions.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Page Navigation */}
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => onPageChange(1)}
                        disabled={currentPage <= 1}
                        title="First Page"
                        className="p-1 rounded-md border border-light-border bg-white text-black/70 hover:bg-neutral-100 hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                    >
                        <ChevronsLeft size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                        title="Previous Page"
                        className="p-1 rounded-md border border-light-border bg-white text-black/70 hover:bg-neutral-100 hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                    >
                        <ChevronLeft size={14} />
                    </button>

                    <span className="px-2 text-xs font-semibold text-black/80">
                        {currentPage} / {totalPages || 1}
                    </span>

                    <button
                        type="button"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        title="Next Page"
                        className="p-1 rounded-md border border-light-border bg-white text-black/70 hover:bg-neutral-100 hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                    >
                        <ChevronRight size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={() => onPageChange(totalPages)}
                        disabled={currentPage >= totalPages}
                        title="Last Page"
                        className="p-1 rounded-md border border-light-border bg-white text-black/70 hover:bg-neutral-100 hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                    >
                        <ChevronsRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
