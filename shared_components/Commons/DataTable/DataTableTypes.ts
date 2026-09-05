import React, { ReactNode } from "react";
import { Action } from "@/interfaces/interface";
import { TableColumnOption } from "@/hooks/useTableColumns";

export type SortDirection = "asc" | "desc";

export interface SortConfig {
    columnId: string;
    direction: SortDirection;
}

export interface HeaderContext<T> {
    column: DataTableColumn<T>;
    isSorted: boolean;
    sortDirection: SortDirection | null;
    toggleSort: () => void;
}

export interface CellContext<T> {
    row: T;
    value: any;
    index: number;
    isSelected?: boolean;
}

export interface DataTableColumn<T> {
    id: string;
    header: string | ((context: HeaderContext<T>) => ReactNode);
    accessorKey?: keyof T;
    accessorFn?: (row: T) => any;
    cell?: (context: CellContext<T>) => ReactNode;
    sortable?: boolean;
    sortComparator?: (a: T, b: T, direction: SortDirection) => number;
    isAlwaysVisible?: boolean;
    defaultVisible?: boolean;
    align?: "left" | "center" | "right";
    width?: string; // e.g. "w-48", "w-1/4", "min-w-[180px]"
    className?: string;
    headerClassName?: string;
}

export interface FilterTabOption<T = any> {
    label: string;
    value: string;
    count?: number;
    countFilter?: (row: T) => boolean;
}

export interface PaginationConfig {
    enabled?: boolean;
    pageSize?: number;
    pageSizeOptions?: number[];
    initialPage?: number;
}

export interface PrimaryActionConfig {
    label: string;
    icon?: ReactNode;
    onClick: () => void;
    permission?: string;
    variant?: "solid" | "dashed";
    disabled?: boolean;
}

export interface EmptyStateConfig {
    title?: string;
    description?: string;
    icon?: ReactNode;
    actionLabel?: string;
    onAction?: () => void;
}

export interface DataTableProps<T> {
    // Data & Columns
    data: T[];
    columns: DataTableColumn<T>[];
    tableId?: string; // For localStorage persistence of column visibility
    getRowId?: (row: T, index: number) => string | number;

    // States
    isLoading?: boolean;
    error?: Error | null;
    onRetry?: () => void;

    // Header & Toolbar
    title?: string;
    subtitle?: string;
    searchable?: boolean;
    searchPlaceholder?: string;
    searchKeys?: (keyof T)[];
    searchFn?: (row: T, query: string) => boolean;

    // Filter Tabs
    filterTabs?: FilterTabOption<T>[];
    activeFilter?: string;
    onFilterChange?: (value: string) => void;
    filterKey?: keyof T;
    filterFn?: (row: T, activeFilter: string) => boolean;

    // Actions & Tools
    primaryAction?: PrimaryActionConfig;
    toolbarExtra?: ReactNode;
    actions?: (row: T) => Action[];
    actionColumnHeader?: string;
    showColumnVisibility?: boolean;

    // Bulk Selection
    selectable?: boolean;
    selectedIds?: Set<string | number>;
    onSelectionChange?: (selectedIds: Set<string | number>, selectedRows: T[]) => void;
    batchActions?: (selectedIds: (string | number)[], selectedRows: T[]) => ReactNode;

    // Sorting
    defaultSort?: SortConfig;
    onSortChange?: (sort: SortConfig | null) => void;

    // Pagination
    pagination?: PaginationConfig | false;

    // Expandable / Nested Rows
    renderSubRow?: (row: T) => ReactNode;

    // Custom Empty State
    emptyState?: EmptyStateConfig;

    // Styling
    className?: string;
    containerClassName?: string;
    tableClassName?: string;
    rowClassName?: string | ((row: T, index: number) => string);
    onRowClick?: (row: T, index: number) => void;
    footerText?: string;
}
