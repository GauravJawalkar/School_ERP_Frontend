import InstituteDashboard from "@/components/Dashboards/SchoolAdmin/Settings/Institute/InstituteDashboard";

export const metadata = {
    title: "Campus Configuration | School ERP",
    description: "Manage global school settings, structure directories, modify licensing, and edit contact properties.",
};

export default function InstituteSettingsPage() {
    return (
        <div>
            <InstituteDashboard />
        </div>
    );
}