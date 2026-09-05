"use client";

import { useState, useEffect, useMemo, useCallback } from "react";

export interface TableColumnOption<T extends string = string> {
    id: T;
    label: string;
    isAlwaysVisible?: boolean;
    defaultVisible?: boolean;
    icon?: React.ReactNode;
    group?: string;
}

export type TableColumnDef<T extends string = string> = TableColumnOption<T>;

export interface UseTableColumnsOptions<T extends string = string> {
    tableId?: string; // If provided, persists user preferences in localStorage
    columns: TableColumnOption<T>[];
}

export function useTableColumns<T extends string = string>({
    tableId,
    columns
}: UseTableColumnsOptions<T>) {
    // Initial column set calculation
    const getInitialColumns = useCallback((): Set<T> => {
        if (typeof window !== "undefined" && tableId) {
            try {
                const saved = localStorage.getItem(`erp_table_cols_${tableId}`);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed)) {
                        const set = new Set<T>(parsed as T[]);
                        // Ensure always-visible mandatory columns are strictly preserved
                        columns.forEach((col) => {
                            if (col.isAlwaysVisible) {
                                set.add(col.id);
                            }
                        });
                        return set;
                    }
                }
            } catch (e) {
                console.error("Failed to parse saved columns from localStorage:", e);
            }
        }

        // Default set
        const defaultSet = new Set<T>();
        columns.forEach((col) => {
            if (col.defaultVisible !== false || col.isAlwaysVisible) {
                defaultSet.add(col.id);
            }
        });
        return defaultSet;
    }, [tableId, columns]);

    const [visibleColumns, setVisibleColumns] = useState<Set<T>>(getInitialColumns);

    // Hydration sync
    useEffect(() => {
        setVisibleColumns(getInitialColumns());
    }, [getInitialColumns]);

    // Persist on change
    useEffect(() => {
        if (tableId && typeof window !== "undefined") {
            try {
                localStorage.setItem(
                    `erp_table_cols_${tableId}`,
                    JSON.stringify(Array.from(visibleColumns))
                );
            } catch (e) {
                console.error("Failed to save columns to localStorage:", e);
            }
        }
    }, [tableId, visibleColumns]);

    const isVisible = useCallback(
        (columnId: T): boolean => {
            const colDef = columns.find((c) => c.id === columnId);
            if (colDef?.isAlwaysVisible) return true;
            return visibleColumns.has(columnId);
        },
        [columns, visibleColumns]
    );

    const toggleColumn = useCallback(
        (columnId: T) => {
            const colDef = columns.find((c) => c.id === columnId);
            if (colDef?.isAlwaysVisible) return; // Locked columns cannot be unchecked

            setVisibleColumns((prev) => {
                const next = new Set(prev);
                if (next.has(columnId)) {
                    next.delete(columnId);
                } else {
                    next.add(columnId);
                }
                return next;
            });
        },
        [columns]
    );

    const showAll = useCallback(() => {
        const allSet = new Set<T>(columns.map((c) => c.id));
        setVisibleColumns(allSet);
    }, [columns]);

    const hideAll = useCallback(() => {
        const minimalSet = new Set<T>();
        columns.forEach((c) => {
            if (c.isAlwaysVisible) {
                minimalSet.add(c.id);
            }
        });
        setVisibleColumns(minimalSet);
    }, [columns]);

    const resetToDefault = useCallback(() => {
        const defaultSet = new Set<T>();
        columns.forEach((col) => {
            if (col.defaultVisible !== false || col.isAlwaysVisible) {
                defaultSet.add(col.id);
            }
        });
        setVisibleColumns(defaultSet);
    }, [columns]);

    const visibleCount = useMemo(() => {
        return columns.filter((c) => isVisible(c.id)).length;
    }, [columns, isVisible]);

    const totalCount = columns.length;

    return {
        columns,
        visibleColumns,
        isVisible,
        toggleColumn,
        showAll,
        hideAll,
        resetToDefault,
        visibleCount,
        totalCount
    };
}
