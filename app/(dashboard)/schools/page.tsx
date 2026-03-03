import Stats from "@/components/Commons/Stats"
import { dummySchoolStats } from "@/data/dummySuperAdminStats"

const page = () => {
    return (
        <div>
            <Stats dashboardStats={dummySchoolStats} />
        </div>
    )
}

export default page