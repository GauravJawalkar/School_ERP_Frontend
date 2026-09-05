"use client";

import React, { ReactNode } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import TableSkeleton from "@/shared_components/Commons/Skeletons/TableSkeleton";
import ErrorFallback from "@/shared_components/Commons/Errors/ErrorFallback";
import TableActionMenu from "@/shared_components/Commons/TableActionMenu";
import { DataTableCheckbox } from "./DataTableCheckbox";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableEmptyState } from "./DataTableEmptyState";
import { DataTableToolbar } from "./DataTableToolbar";
import { DataTableStatusBadge } from "./DataTableStatusBadge";
import { useDataTable } from "./useDataTable";
import { DataTableProps, DataTableColumn, SortDirection } from "./DataTableTypes";

export function DataTable<T>({
    data = [],
    columns = [],
    tableId,
    getRowId = (row: any, i) => row?.id ?? row?.userId ?? row?._id ?? i,
    isLoading = false,
    error = null,
    onRetry,
    title,
    subtitle,
    searchable = true,
    searchPlaceholder,
    searchKeys,
    searchFn,
    filterTabs,
    activeFilter: controlledActiveFilter,
    onFilterChange,
    filterKey,
    filterFn,
    primaryAction,
    toolbarExtra,
    actions,
    actionColumnHeader = "",
    showColumnVisibility = true,
    selectable = false,
    selectedIds: controlledSelectedIds,
    onSelectionChange,
    batchActions,
    defaultSort,
    pagination = { enabled: true, pageSize: 15, pageSizeOptions: [10, 15, 25, 50, 100] },
    renderSubRow,
    emptyState,
    className = "",
    containerClassName = "",
    tableClassName = "",
    rowClassName,
    onRowClick,
    footerText
}: DataTableProps<T>) {
    // Integrate pure headless hook
    const {
        data: processedRows,
        totalItems,
        searchQuery,
        setSearchQuery,
        activeFilter,
        setActiveFilter,
        filterTabs: resolvedFilterTabs,
        hasActiveFilters,
        resetFilters,
        sortConfig,
        toggleSort,
        isPaginationEnabled,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        totalPages,
        selectedIds,
        selectedRows,
        isAllSelected,
        isIndeterminate,
        toggleRow,
        toggleAll,
        clearSelection,
        columns: columnVisibilityDefs,
        isVisible,
        toggleColumn,
        showAllColumns,
        resetColumnsToDefault,
        visibleColumnCount
    } = useDataTable<T>({
        data,
        columns,
        tableId,
        getRowId,
        searchKeys,
        searchFn,
        filterTabs,
        filterKey,
        filterFn,
        initialFilter: controlledActiveFilter || "ALL",
        defaultSort,
        pagination,
        selectable
    });

    // Notify parent on selection change if callback is provided
    const effectiveSelectedIds = controlledSelectedIds || selectedIds;

    const handleToggleRow = (id: string | number) => {
        toggleRow(id);
        if (onSelectionChange) {
            const next = new Set(effectiveSelectedIds);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            const nextRows = data.filter((r, i) => next.has(getRowId(r, i)));
            onSelectionChange(next, nextRows);
        }
    };

    const handleToggleAll = () => {
        toggleAll();
        if (onSelectionChange) {
            const next = new Set(effectiveSelectedIds);
            if (isAllSelected) {
                processedRows.forEach((r, i) => next.delete(getRowId(r, i)));
            } else {
                processedRows.forEach((r, i) => next.add(getRowId(r, i)));
            }
            const nextRows = data.filter((r, i) => next.has(getRowId(r, i)));
            onSelectionChange(next, nextRows);
        }
    };

    // Calculate dynamic total column span for empty / sub-row states
    const effectiveColSpan =
        visibleColumnCount + (selectable ? 1 : 0) + (actions ? 1 : 0);

    // Error State
    if (error && onRetry) {
        return <ErrorFallback refetch={onRetry} title={title || "Data Table"} />;
    }

    return (
        <div
            className={`bg-white border border-light-border rounded-xl shadow-xs overflow-hidden ${containerClassName} ${className}`}
        >
            {/* 1. Header Toolbar */}
            <DataTableToolbar<T>
                title={title}
                subtitle={subtitle}
                searchable={searchable}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder={searchPlaceholder}
                filterTabs={resolvedFilterTabs}
                activeFilter={activeFilter}
                onFilterChange={(val) => {
                    setActiveFilter(val);
                    if (onFilterChange) onFilterChange(val);
                }}
                primaryAction={primaryAction}
                toolbarExtra={toolbarExtra}
                columns={columnVisibilityDefs}
                isVisible={isVisible}
                onToggleColumn={toggleColumn}
                onShowAllColumns={showAllColumns}
                onResetColumns={resetColumnsToDefault}
                showColumnVisibility={showColumnVisibility}
                selectedCount={effectiveSelectedIds.size}
                batchActions={
                    batchActions ? batchActions(Array.from(effectiveSelectedIds), selectedRows) : undefined
                }
                onClearSelection={clearSelection}
            />

            {/* 2. Table Canvas / Loading State */}
            {isLoading ? (
                <div className="p-4">
                    <TableSkeleton
                        columns={Math.max(visibleColumnCount, 4)}
                        rows={pageSize || 6}
                        hasCheckbox={selectable}
                        hasActions={Boolean(actions)}
                    />
                </div>
            ) : (
                <div className="overflow-x-auto slim-scrollbar">
                    <table className={`w-full text-left border-collapse ${tableClassName}`}>
                        {/* Table Header */}
                        <thead>
                            <tr className="border-b border-light-border bg-gray-50/50 text-[10px] font-bold text-black/50 uppercase tracking-wider">
                                {/* Optional Select All Checkbox */}
                                {selectable && (
                                    <th className="pl-4 py-3.5 w-10">
                                        <DataTableCheckbox
                                            checked={isAllSelected}
                                            indeterminate={isIndeterminate}
                                            onChange={handleToggleAll}
                                            title="Select all on this page"
                                        />
                                    </th>
                                )}

                                {/* Dynamic Columns */}
                                {columns.map((column) => {
                                    if (!isVisible(column.id)) return null;

                                    const isSorted = sortConfig?.columnId === column.id;
                                    const sortDirection: SortDirection | null = isSorted
                                        ? sortConfig?.direction || null
                                        : null;

                                    const alignClass =
                                        column.align === "center"
                                            ? "text-center"
                                            : column.align === "right"
                                            ? "text-right"
                                            : "text-left";

                                    return (
                                        <th
                                            key={column.id}
                                            className={`p-4 font-bold select-none ${alignClass} ${column.width || ""} ${
                                                column.headerClassName || ""
                                            } ${column.sortable ? "cursor-pointer hover:bg-neutral-100/60 transition" : ""}`}
                                            onClick={() => {
                                                if (column.sortable) toggleSort(column.id);
                                            }}
                                        >
                                            <div
                                                className={`inline-flex items-center gap-1.5 ${
                                                    column.align === "center"
                                                        ? "justify-center"
                                                        : column.align === "right"
                                                        ? "justify-end"
                                                        : "justify-start"
                                                }`}
                                            >
                                                <span>
                                                    {typeof column.header === "function"
                                                        ? column.header({
                                                              column,
                                                              isSorted,
                                                              sortDirection,
                                                              toggleSort: () => toggleSort(column.id)
                                                          })
                                                        : column.header}
                                                </span>
                                                {column.sortable && (
                                                    <span className="text-black/40 inline-flex items-center">
                                                        {isSorted ? (
                                                            sortDirection === "asc" ? (
                                                                <ArrowUp size={13} className="text-black" />
                                                            ) : (
                                                                <ArrowDown size={13} className="text-black" />
                                                            )
                                                        ) : (
                                                            <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-100 hover:opacity-100" />
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                    );
                                })}

                                {/* Actions Header */}
                                {actions && (
                                    <th className="p-4 text-right font-medium w-12">
                                        {actionColumnHeader}
                                    </th>
                                )}
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody className="divide-y divide-light-border text-xs">
                            {processedRows.length > 0 ? (
                                processedRows.map((row, index) => {
                                    const rowId = getRowId(row, index);
                                    const isRowSelected = effectiveSelectedIds.has(rowId);
                                    const actionList = actions ? actions(row) : [];

                                    const customRowClass =
                                        typeof rowClassName === "function"
                                            ? rowClassName(row, index)
                                            : rowClassName || "";

                                    return (
                                        <React.Fragment key={rowId}>
                                            <tr
                                                onClick={() => {
                                                    if (onRowClick) onRowClick(row, index);
                                                }}
                                                className={`group transition-colors duration-100 ${
                                                    isRowSelected
                                                        ? "bg-neutral-50/80"
                                                        : "hover:bg-neutral-50/50 bg-white"
                                                } ${onRowClick ? "cursor-pointer" : ""} ${customRowClass}`}
                                            >
                                                {/* Select Row Checkbox */}
                                                {selectable && (
                                                    <td
                                                        className="pl-4 py-3.5"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <DataTableCheckbox
                                                            checked={isRowSelected}
                                                            onChange={() => handleToggleRow(rowId)}
                                                        />
                                                    </td>
                                                )}

                                                {/* Cells */}
                                                {columns.map((column) => {
                                                    if (!isVisible(column.id)) return null;

                                                    let cellValue: any;
                                                    if (column.accessorFn) {
                                                        cellValue = column.accessorFn(row);
                                                    } else if (column.accessorKey) {
                                                        cellValue = row[column.accessorKey];
                                                    }

                                                    const alignClass =
                                                        column.align === "center"
                                                            ? "text-center"
                                                            : column.align === "right"
                                                            ? "text-right"
                                                            : "text-left";

                                                    return (
                                                        <td
                                                            key={column.id}
                                                            className={`p-4 ${alignClass} ${column.className || ""}`}
                                                        >
                                                            {column.cell
                                                                ? column.cell({
                                                                      row,
                                                                      value: cellValue,
                                                                      index,
                                                                      isSelected: isRowSelected
                                                                  })
                                                                : cellValue ?? "—"}
                                                        </td>
                                                    );
                                                })}

                                                {/* Action Menu Cell */}
                                                {actions && (
                                                    <td
                                                        className="p-4 text-right"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <div className="inline-flex items-center justify-end">
                                                            {actionList.length > 0 ? (
                                                                <TableActionMenu actions={actionList} />
                                                            ) : (
                                                                <span className="text-black/30 font-medium">—</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>

                                            {/* Sub-row expansion slot */}
                                            {renderSubRow && (
                                                <tr className="bg-neutral-50/40">
                                                    <td colSpan={effectiveColSpan} className="p-0">
                                                        {renderSubRow(row)}
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            ) : (
                                <DataTableEmptyState
                                    colSpan={effectiveColSpan}
                                    title={emptyState?.title}
                                    description={emptyState?.description}
                                    icon={emptyState?.icon}
                                    actionLabel={emptyState?.actionLabel}
                                    onAction={emptyState?.onAction}
                                    hasActiveFilter={hasActiveFilters}
                                    onResetFilters={resetFilters}
                                />
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* 3. Pagination & Footer Summary */}
            {isPaginationEnabled && (
                <DataTablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    pageSize={pageSize}
                    pageSizeOptions={
                        (pagination && typeof pagination === "object" && pagination.pageSizeOptions) || [
                            10, 15, 25, 50, 100
                        ]
                    }
                    onPageChange={setCurrentPage}
                    onPageSizeChange={setPageSize}
                    footerText={footerText}
                />
            )}
        </div>
    );
}

// Attach Compound Building Blocks to DataTable for maximum flexibility
DataTable.Toolbar = DataTableToolbar;
DataTable.Pagination = DataTablePagination;
DataTable.EmptyState = DataTableEmptyState;
DataTable.StatusBadge = DataTableStatusBadge;
DataTable.Checkbox = DataTableCheckbox;
