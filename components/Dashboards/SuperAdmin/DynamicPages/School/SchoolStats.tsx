
const SchoolStats = () => {
    return (
        <div className="grid grid-cols-5 border rounded-lg border-light-border divide-x divide-light-border">
            <div className="flex flex-col items-center justify-center py-3 gap-0.5">
                <h1 className="text-base font-semibold">Est. 1990</h1>
                <p className="text-xs text-black/70">Founded</p>
            </div>
            <div className="flex flex-col items-center justify-center py-3 gap-0.5">
                <h1 className="text-base font-semibold">3,200+</h1>
                <p className="text-xs text-black/70">Students</p>
            </div>
            <div className="flex flex-col items-center justify-center py-3 gap-0.5">
                <h1 className="text-base font-semibold">180+</h1>
                <p className="text-xs text-black/70">Staff</p>
            </div>
            <div className="flex flex-col items-center justify-center py-3 gap-0.5">
                <h1 className="text-base font-semibold">14</h1>
                <p className="text-xs text-black/70">Classes</p>
            </div>
            <div className="flex flex-col items-center justify-center py-3 gap-0.5">
                <h1 className="text-base font-semibold">2</h1>
                <p className="text-xs text-black/70">Admins</p>
            </div>
        </div>
    )
}

export default SchoolStats