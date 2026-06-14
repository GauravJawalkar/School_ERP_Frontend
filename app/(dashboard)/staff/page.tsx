import React from "react";
import StaffDashboard from "@/components/Dashboards/SchoolAdmin/Staff/StaffDashboard";

export const metadata = {
    title: "Staff Directory Management",
    description: "Manage system users, administrators, teachers, and school operations staff profiles.",
};

export default function StaffPage() {
    return (
        <div>
            <StaffDashboard />
        </div>
    );
}