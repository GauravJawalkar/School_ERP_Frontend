
const SchoolHeroSkeleton = () => {
    return (
        <div className="pb-5 animate-pulse">
            {/* Cover Area */}
            <div className="bg-gray-100/70 rounded-lg h-42 w-full relative">
                {/* Top Tags */}
                <div className="flex items-start justify-between py-2 px-3">
                    <div className="h-5 w-20 bg-gray-200 rounded-full" />
                    <div className="h-5 w-24 bg-gray-200 rounded-full" />
                </div>

                {/* Logo */}
                <div className="absolute -bottom-1/5 left-5">
                    <div className="h-18 w-18 bg-gray-200 rounded-lg ring ring-light-border" />
                </div>
            </div>

            {/* Content */}
            <div className="mt-12 px-5">
                {/* Name */}
                <div className="h-6 w-48 bg-gray-200 rounded mb-2" />

                {/* Sub info */}
                <div className="flex gap-2 mb-2">
                    <div className="h-4 w-28 bg-gray-200 rounded" />
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>

                {/* Affiliation */}
                <div className="h-4 w-40 bg-gray-200 rounded mb-3" />

                {/* Tags */}
                <div className="py-2 flex gap-2">
                    <div className="h-6 w-16 bg-gray-200 rounded-full" />
                    <div className="h-6 w-20 bg-gray-200 rounded-full" />
                    <div className="h-6 w-14 bg-gray-200 rounded-full" />
                </div>

                {/* Buttons */}
                <div className="py-2 flex gap-2">
                    <div className="h-8 w-28 bg-gray-200 rounded-md" />
                    <div className="h-8 w-32 bg-gray-200 rounded-md" />
                    <div className="h-8 w-28 bg-gray-200 rounded-md" />
                    <div className="h-8 w-24 bg-gray-200 rounded-md" />
                </div>
            </div>
        </div>
    )
}

export default SchoolHeroSkeleton