import React from 'react'

const SchoolStatsSkeleton = () => {
    return (
        <div className="grid grid-cols-5 border rounded-lg border-light-border divide-x divide-light-border animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center justify-center py-3 gap-1">
                    {/* Number */}
                    <div className="h-5 w-10 bg-gray-200 rounded" />

                    {/* Label */}
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                </div>
            ))}
        </div>
    )
}

export default SchoolStatsSkeleton