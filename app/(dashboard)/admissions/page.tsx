import React from "react";
import AdmissionsDashboard from "@/components/Dashboards/SchoolAdmin/Admissions/AdmissionsDashboard";

export const metadata = {
    title: "Admissions Registry Management",
    description: "Evaluate applicant registration requests, status leads, and manage admissions.",
};

export default function AdmissionsPage() {
    return (
        <div>
            <AdmissionsDashboard />
        </div>
    );
}