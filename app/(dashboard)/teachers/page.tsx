import React from "react";
import { TeachersDashboard } from "@/modules/school-admin";

export const metadata = {
    title: "Teachers Registry Management",
    description: "Manage educator profiles, credentials, academic designations and qualifications.",
};

export default function TeachersPage() {
    return (
        <div>
            <TeachersDashboard />
        </div>
    );
}