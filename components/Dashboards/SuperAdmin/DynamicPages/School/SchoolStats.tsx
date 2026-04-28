import { SchoolStatsProps } from "@/interfaces/interface"

const SchoolStats = ({ stats }: { stats: SchoolStatsProps }) => {
    return (
        <div className="grid grid-cols-5 border rounded-lg border-light-border divide-x divide-light-border">
            <div className="flex flex-col items-center justify-center py-3 gap-0.5">
                <h1 className="text-base font-semibold">{stats.boards?.length}</h1>
                <p className="text-xs text-black/70">Boards</p>
            </div>
            <div className="flex flex-col items-center justify-center py-3 gap-0.5">
                <h1 className="text-base font-semibold">{stats?.students}+</h1>
                <p className="text-xs text-black/70">Students</p>
            </div>
            <div className="flex flex-col items-center justify-center py-3 gap-0.5">
                <h1 className="text-base font-semibold">{stats?.staff}+</h1>
                <p className="text-xs text-black/70">Staff</p>
            </div>
            <div className="flex flex-col items-center justify-center py-3 gap-0.5">
                <h1 className="text-base font-semibold">{stats?.classes}</h1>
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