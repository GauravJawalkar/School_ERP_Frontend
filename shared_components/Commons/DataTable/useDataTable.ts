"use client";

import { useState, useMemo, useCallback } from "react";
import {
    DataTableColumn,
    SortConfig,
    SortDirection,
    FilterTabOption,
    PaginationConfig
} from "./DataTableTypes";
import { useTableColumns, TableColumnOption } from "@/hooks/useTableColumns";

export interface UseDataTableOptions<T> {
    data: T[];
    columns: DataTableColumn<T>[];
    tableId?: string;
    getRowId?: (row: T, index: number) => string | number;

    // Search options
    searchKeys?: (keyof T)[];
    searchFn?: (row: T, query: string) => boolean;

    // Filter tab options
    filterTabs?: FilterTabOption<T>[];
    filterKey?: keyof T;
    filterFn?: (row: T, activeFilter: string) => boolean;
    initialFilter?: string;

    // Sort options
    defaultSort?: SortConfig;

    // Pagination options
    pagination?: PaginationConfig | false;

    // Selection options
    selectable?: boolean;
}

export function useDataTable<T>({
    data = [],
    columns,
    tableId,
    getRowId = (row: any, i) => row?.id ?? row?.userId ?? row?._id ?? i,
    searchKeys,
    searchFn,
    filterTabs,
    filterKey,
    filterFn,
    initialFilter = "ALL",
    defaultSort,
    pagination = { enabled: true, pageSize: 15, pageSizeOptions: [10, 15, 25, 50, 100] }
}: UseDataTableOptions<T>) {
    // 1. Search State
    const [searchQuery, setSearchQuery] = useState("");

    // 2. Filter Tab State
    const [activeFilter, setActiveFilter] = useState(initialFilter);

    // 3. Sorting State
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(defaultSort || null);

    // 4. Pagination State
    const isPaginationEnabled = pagination !== false && (pagination.enabled ?? true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(
        (pagination && typeof pagination === "object" && pagination.pageSize) ? pagination.pageSize : 15
    );

    // 5. Selection State
    const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

    // 6. Column Visibility via useTableColumns
    const tableColumnOptions: TableColumnOption[] = useMemo(() => {
        return columns.map((col) => ({
            id: col.id,
            label: typeof col.header === "string" ? col.header : col.id,
            isAlwaysVisible: col.isAlwaysVisible,
            defaultVisible: col.defaultVisible
        }));
    }, [columns]);

    const {
        columns: visibleColumnOptions,
        isVisible,
        toggleColumn,
        showAll: showAllColumns,
        resetToDefault: resetColumnsToDefault,
        visibleCount: visibleColumnCount
    } = useTableColumns({
        tableId,
        columns: tableColumnOptions
    });

    // ─── PURE DATA TRANSFORMATION PIPELINE (Zero useEffects) ──────────

    // Pipeline Step 1: Filter Tabs Counts (Calculated over raw data in O(N))
    const calculatedFilterTabs = useMemo(() => {
        if (!filterTabs || filterTabs.length === 0) return undefined;

        return filterTabs.map((tab) => {
            if (tab.count !== undefined) return tab;

            if (tab.value === "ALL") {
                return { ...tab, count: data.length };
            }

            let count = 0;
            if (tab.countFilter) {
                count = data.filter(tab.countFilter).length;
            } else if (filterFn) {
                count = data.filter((row) => filterFn(row, tab.value)).length;
            } else if (filterKey) {
                count = data.filter((row) => String(row[filterKey]).toUpperCase() === tab.value.toUpperCase()).length;
            }

            return { ...tab, count };
        });
    }, [data, filterTabs, filterKey, filterFn]);

    // Pipeline Step 2: Global Search Filtering
    const searchFilteredData = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return data;

        if (searchFn) {
            return data.filter((row) => searchFn(row, query));
        }

        return data.filter((row) => {
            if (searchKeys && searchKeys.length > 0) {
                return searchKeys.some((key) => {
                    const val = row[key];
                    if (val === null || val === undefined) return false;
                    return String(val).toLowerCase().includes(query);
                });
            }

            // Fallback: search across all string/number columns
            return columns.some((col) => {
                let val: any;
                if (col.accessorFn) {
                    val = col.accessorFn(row);
                } else if (col.accessorKey) {
                    val = row[col.accessorKey];
                }
                if (val === null || val === undefined) return false;
                return String(val).toLowerCase().includes(query);
            });
        });
    }, [data, searchQuery, searchFn, searchKeys, columns]);

    // Pipeline Step 3: Tab / Category Filtering
    const tabFilteredData = useMemo(() => {
        if (!activeFilter || activeFilter === "ALL") {
            return searchFilteredData;
        }

        if (filterFn) {
            return searchFilteredData.filter((row) => filterFn(row, activeFilter));
        }

        if (filterKey) {
            return searchFilteredData.filter(
                (row) => String(row[filterKey]).toUpperCase() === activeFilter.toUpperCase()
            );
        }

        const activeTabDef = filterTabs?.find((t) => t.value === activeFilter);
        if (activeTabDef?.countFilter) {
            return searchFilteredData.filter(activeTabDef.countFilter);
        }

        return searchFilteredData;
    }, [searchFilteredData, activeFilter, filterFn, filterKey, filterTabs]);

    // Pipeline Step 4: Sorting
    const sortedData = useMemo(() => {
        if (!sortConfig) return tabFilteredData;

        const { columnId, direction } = sortConfig;
        const column = columns.find((c) => c.id === columnId);
        if (!column) return tabFilteredData;

        const sorted = [...tabFilteredData].sort((a, b) => {
            if (column.sortComparator) {
                return column.sortComparator(a, b, direction);
            }

            let valA: any;
            let valB: any;

            if (column.accessorFn) {
                valA = column.accessorFn(a);
                valB = column.accessorFn(b);
            } else if (column.accessorKey) {
                valA = a[column.accessorKey];
                valB = b[column.accessorKey];
            }

            if (valA === valB) return 0;
            if (valA === null || valA === undefined) return 1;
            if (valB === null || valB === undefined) return -1;

            if (typeof valA === "number" && typeof valB === "number") {
                return direction === "asc" ? valA - valB : valB - valA;
            }

            if (valA instanceof Date && valB instanceof Date) {
                return direction === "asc" ? valA.getTime() - valB.getTime() : valB.getTime() - valA.getTime();
            }

            const strA = String(valA).toLowerCase();
            const strB = String(valB).toLowerCase();

            return direction === "asc" ? strA.localeCompare(strB) : strB.localeCompare(strA);
        });

        return sorted;
    }, [tabFilteredData, sortConfig, columns]);

    // Pipeline Step 5: Pagination Slicing
    const totalItems = sortedData.length;
    const totalPages = isPaginationEnabled ? Math.max(1, Math.ceil(totalItems / pageSize)) : 1;
    const safeCurrentPage = Math.min(currentPage, totalPages);

    const paginatedData = useMemo(() => {
        if (!isPaginationEnabled) return sortedData;
        const start = (safeCurrentPage - 1) * pageSize;
        return sortedData.slice(start, start + pageSize);
    }, [sortedData, isPaginationEnabled, safeCurrentPage, pageSize]);

    // ─── SORTING CONTROLS ─────────────────────────────────────────────
    const toggleSort = useCallback((columnId: string) => {
        setSortConfig((prev) => {
            if (!prev || prev.columnId !== columnId) {
                return { columnId, direction: "asc" };
            }
            if (prev.direction === "asc") {
                return { columnId, direction: "desc" };
            }
            return null; // Cycle to none
        });
    }, []);

    // ─── SELECTION CONTROLS ───────────────────────────────────────────
    const selectedRows = useMemo(() => {
        if (selectedIds.size === 0) return [];
        return data.filter((row, i) => selectedIds.has(getRowId(row, i)));
    }, [data, selectedIds, getRowId]);

    const isAllSelected = useMemo(() => {
        if (paginatedData.length === 0) return false;
        return paginatedData.every((row, i) => selectedIds.has(getRowId(row, i)));
    }, [paginatedData, selectedIds, getRowId]);

    const isIndeterminate = useMemo(() => {
        if (isAllSelected || paginatedData.length === 0) return false;
        return paginatedData.some((row, i) => selectedIds.has(getRowId(row, i)));
    }, [paginatedData, selectedIds, isAllSelected, getRowId]);

    const toggleRow = useCallback(
        (id: string | number) => {
            setSelectedIds((prev) => {
                const next = new Set(prev);
                if (next.has(id)) {
                    next.delete(id);
                } else {
                    next.add(id);
                }
                return next;
            });
        },
        []
    );

    const toggleAll = useCallback(() => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (isAllSelected) {
                // Deselect current page items
                paginatedData.forEach((row, i) => next.delete(getRowId(row, i)));
            } else {
                // Select all current page items
                paginatedData.forEach((row, i) => next.add(getRowId(row, i)));
            }
            return next;
        });
    }, [isAllSelected, paginatedData, getRowId]);

    const clearSelection = useCallback(() => {
        setSelectedIds(new Set());
    }, []);

    // ─── PAGINATION CONTROLS ──────────────────────────────────────────
    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handlePageSizeChange = useCallback((newPageSize: number) => {
        setPageSize(newPageSize);
        setCurrentPage(1);
    }, []);

    // ─── SEARCH & FILTER CONTROLS ─────────────────────────────────────
    const handleSearchChange = useCallback((query: string) => {
        setSearchQuery(query);
        setCurrentPage(1); // Reset to page 1 on new search without useEffect!
    }, []);

    const handleFilterChange = useCallback((filter: string) => {
        setActiveFilter(filter);
        setCurrentPage(1); // Reset to page 1 on filter tab change without useEffect!
    }, []);

    const resetFilters = useCallback(() => {
        setSearchQuery("");
        setActiveFilter(initialFilter);
        setCurrentPage(1);
    }, [initialFilter]);

    const hasActiveFilters = Boolean(searchQuery.trim() || activeFilter !== "ALL");

    return {
        // Data Outputs
        data: paginatedData,
        rawData: data,
        totalItems,
        filteredCount: sortedData.length,

        // Search
        searchQuery,
        setSearchQuery: handleSearchChange,

        // Filter Tabs
        activeFilter,
        setActiveFilter: handleFilterChange,
        filterTabs: calculatedFilterTabs,
        hasActiveFilters,
        resetFilters,

        // Sorting
        sortConfig,
        setSortConfig,
        toggleSort,

        // Pagination
        isPaginationEnabled,
        currentPage: safeCurrentPage,
        setCurrentPage: handlePageChange,
        pageSize,
        setPageSize: handlePageSizeChange,
        totalPages,

        // Selection
        selectedIds,
        selectedRows,
        isAllSelected,
        isIndeterminate,
        toggleRow,
        toggleAll,
        clearSelection,
        setSelectedIds,

        // Column Visibility
        columns: visibleColumnOptions,
        isVisible,
        toggleColumn,
        showAllColumns,
        resetColumnsToDefault,
        visibleColumnCount,

        // Utility
        getRowId
    };
}
