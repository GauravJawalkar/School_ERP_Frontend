"use client"

import { TableSkeletonProps } from "@/interfaces/interface"

// Single animated shimmer cell
const ShimmerCell = ({ width = "w-24" }: { width?: string }) => (
    <div className={`h-3.5 ${width} rounded-sm bg-gray-200 animate-pulse`} />
)

// Skeleton for thead
const TheadSkeleton = ({
    columns,
    hasCheckbox,
    hasActions,
}: {
    columns: number
    hasCheckbox: boolean
    hasActions: boolean
}) => (
    <thead className="text-left">
        <tr className="text-black/80">
            {hasCheckbox && (
                <th className="pl-4 py-2.5">
                    <div className="h-3.5 w-3.5 rounded bg-gray-200 animate-pulse" />
                </th>
            )}
            {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-4 py-2.5">
                    <ShimmerCell width={i === 0 ? "w-28" : i % 3 === 0 ? "w-20" : "w-24"} />
                </th>
            ))}
            {hasActions && <th className="px-4 py-2.5" />}
        </tr>
    </thead>
)

// Skeleton for a single tbody row
const RowSkeleton = ({
    columns,
    hasCheckbox,
    hasActions,
    index,
}: {
    columns: number
    hasCheckbox: boolean
    hasActions: boolean
    index: number
}) => {
    // Vary widths so it looks natural, not robotic
    const widths = ["w-32", "w-24", "w-20", "w-28", "w-16", "w-24", "w-14", "w-10"]

    return (
        <tr className="border-t border-light-border">
            {hasCheckbox && (
                <td className="pl-4 py-3">
                    <div className="h-3.5 w-3.5 rounded bg-gray-200 animate-pulse" />
                </td>
            )}
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="px-4 py-3">
                    {/* First column gets an avatar + text pattern */}
                    {i === 0 ? (
                        <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-gray-200 animate-pulse shrink-0" />
                            <ShimmerCell width="w-28" />
                        </div>
                    ) : (
                        <ShimmerCell width={widths[(i + index) % widths.length]} />
                    )}
                </td>
            ))}
            {hasActions && (
                <td className="px-4 py-3">
                    <div className="h-7 w-7 rounded-md bg-gray-200 animate-pulse" />
                </td>
            )}
        </tr>
    )
}

export const TableSkeleton = ({
    rows = 6,
    columns = 6,
    hasCheckbox = true,
    hasActions = true,
}: TableSkeletonProps) => {
    return (
        <div>
            {/* Table skeleton */}
            <div className="border-light-border rounded-xl border w-full overflow-x-auto slim-scrollbar">
                <table className="text-sm min-w-max w-full" >
                    <TheadSkeleton
                        columns={columns}
                        hasCheckbox={hasCheckbox}
                        hasActions={hasActions}
                    />
                    <tbody>
                        {Array.from({ length: rows }).map((_, i) => (
                            <RowSkeleton
                                key={i}
                                index={i}
                                columns={columns}
                                hasCheckbox={hasCheckbox}
                                hasActions={hasActions}
                            />
                        ))}
                    </tbody>
                </table >
            </div >
        </div >
    )
}

export default TableSkeleton