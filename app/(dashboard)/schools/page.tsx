import Stats from "@/components/Commons/Stats"
import AllInstituteTable from "@/components/Dashboards/SuperAdmin/Tables/InstituteTable"
import { dummySchoolStats } from "@/data/dummySuperAdminStats"

const page = () => {
    return (
        <div className="space-y-6">
            {/* Creating the new page for schools */}
            <Stats dashboardStats={dummySchoolStats} />
            <AllInstituteTable />
        </div>
    )
}

export default page