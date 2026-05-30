import React from "react";
import RolesDashboard from "@/components/Dashboards/SchoolAdmin/Settings/Roles/RolesDashboard";

export const metadata = {
    title: "Security Roles & Permissions | School ERP",
    description: "Configure system templates, create custom profiles, and inspect access matrices across all school departments.",
};

export default function RolesPage() {
    return (
        <div>
            <RolesDashboard />
        </div>
    );
}