import React from "react";
import { AdmissionsDashboard } from "@/modules/school-admin";

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