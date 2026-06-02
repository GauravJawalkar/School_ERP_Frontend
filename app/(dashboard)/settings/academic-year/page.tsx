import AcademicYearDashboard from "@/components/Dashboards/SchoolAdmin/Settings/AcademicYear/AcademicYearDashboard";

export const metadata = {
    title: "Academic Years Configuration | School ERP",
    description: "Manage institute calendar timelines, define operational session ranges, and set the system-wide active year.",
};

export default function AcademicYearsPage() {
    return (
        <div>
            <AcademicYearDashboard />
        </div>
    );
}