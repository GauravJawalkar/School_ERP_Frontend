import Stats from "@/shared_components/Commons/Stats";
import { InstituteTable } from "@/modules/super-admin";
import { dummySchoolStats } from "@/data/dummySuperAdminStats";

const page = () => {
  return (
    <div className="space-y-6">
      <Stats dashboardStats={dummySchoolStats} />
      <InstituteTable />
    </div>
  );
};

export default page;