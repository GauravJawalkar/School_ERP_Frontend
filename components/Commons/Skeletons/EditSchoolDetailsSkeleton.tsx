const EditSchoolDetailsSkeleton = () => {
    return (
        <section className="p-6 rounded-md shadow-xs border border-light-border animate-pulse">
            {/* Header */}
            <div className="mb-8 flex flex-col gap-2">
                <div className="h-4 w-36 bg-neutral-200 rounded-md" />
                <div className="h-3 w-64 bg-neutral-100 rounded-md" />
            </div>

            {/* Step Indicator */}
            <div className="mb-12 flex items-center justify-between">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-neutral-200" />
                            <div className="h-2.5 w-16 bg-neutral-100 rounded-md" />
                        </div>
                        {i < 3 && <div className="flex-1 h-px bg-neutral-200 mx-1.5 mb-4" />}
                    </div>
                ))}
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex flex-col gap-1.5">
                        <div className="h-3 w-24 bg-neutral-200 rounded-md" />
                        <div className="h-9 w-full bg-neutral-100 rounded-md" />
                    </div>
                ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-5 border-t border-neutral-100">
                <div className="h-8 w-20 bg-neutral-100 rounded-md" />
                <div className="h-3 w-16 bg-neutral-100 rounded-md" />
                <div className="h-8 w-20 bg-neutral-200 rounded-md" />
            </div>
        </section>
    )
}

export default EditSchoolDetailsSkeleton