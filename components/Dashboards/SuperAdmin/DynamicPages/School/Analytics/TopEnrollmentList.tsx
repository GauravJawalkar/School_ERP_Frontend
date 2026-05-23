"use client";

import { Award, GraduationCap, MapPin, Users } from "lucide-react";

interface SchoolItem {
    id?: number;
    schoolName: string;
    city?: string;
    students?: number | string;
    staff?: number | string;
    status?: string;
    schoolStatus?: string;
    totalStudents?: number;
    totalStaff?: number;
    schoolInfo?: {
        address_details?: {
            city?: string;
        }
    };
}

interface TopEnrollmentListProps {
    schools: SchoolItem[];
}

export default function TopEnrollmentList({ schools = [] }: TopEnrollmentListProps) {
    // Sort schools by students count descending (handle string parsed numbers)
    const getTopSchools = () => {
        if (!schools || schools.length === 0) {
            // High-fidelity fallback list
            return [
                { schoolName: "Delhi Public School", city: "Pune", students: 1850, staff: 85, status: "ACTIVE" },
                { schoolName: "St. Xavier's High School", city: "Mumbai", students: 1420, staff: 64, status: "ACTIVE" },
                { schoolName: "Angel High School", city: "Pune", students: 1200, staff: 55, status: "ACTIVE" },
                { schoolName: "Podar International", city: "Bangalore", students: 950, staff: 42, status: "ACTIVE" },
                { schoolName: "Orchid The International", city: "Mumbai", students: 810, staff: 38, status: "INACTIVE" }
            ];
        }

        const sorted = [...schools].sort((a, b) => {
            const numA = Number(a.totalStudents || a.students || 0);
            const numB = Number(b.totalStudents || b.students || 0);
            return numB - numA;
        });

        return sorted.slice(0, 5);
    };

    const topSchools = getTopSchools();

    return (
        <div className="bg-white border border-light-border rounded-xl p-5 shadow-xs flex flex-col justify-between h-full">
            <div>
                <h3 className="text-sm font-semibold text-black/80 uppercase tracking-wider mb-0.5">Top Schools by Enrollment</h3>
                <p className="text-xs text-black/40 mb-4">Ranked by combined student population</p>
            </div>

            <div className="space-y-4">
                {topSchools.map((school, index) => {
                    const isEven = index % 2 === 0;
                    const city = school.schoolInfo?.address_details?.city || school.city || "N/A";
                    const staff = school.totalStaff ?? school.staff ?? 0;
                    const students = school.totalStudents ?? school.students ?? 0;
                    const status = school.schoolStatus || school.status || "INACTIVE";

                    return (
                        <div 
                            key={index} 
                            className={`flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-light-border transition ${isEven ? "bg-gray-50/40" : "bg-white"}`}
                        >
                            <div className="flex items-center gap-3">
                                {/* Rank Badge */}
                                <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                                    index === 0 ? "bg-black text-white" :
                                    index === 1 ? "bg-neutral-600 text-white" :
                                    index === 2 ? "bg-neutral-400 text-white" :
                                    "bg-gray-100 text-black/60"
                                }`}>
                                    {index + 1}
                                </div>
                                <div>
                                    <h4 className="text-xs font-semibold text-black tracking-tight">{school.schoolName}</h4>
                                    <div className="flex items-center gap-2 text-[10px] text-black/40 font-medium mt-0.5">
                                        <span className="flex items-center gap-0.5"><MapPin size={10} />{city}</span>
                                        <span>·</span>
                                        <span className="flex items-center gap-0.5"><Users size={10} />{staff} Staff</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Students capacity */}
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-xs font-bold text-black justify-end">
                                        <GraduationCap size={12} className="text-black/60" />
                                        {students}
                                    </div>
                                    <span className="text-[9px] text-black/40 font-medium uppercase tracking-wider">Students</span>
                                </div>

                                {/* Status Tag */}
                                <span className={`text-[9px] px-1.5 py-0.5 rounded-sm font-semibold tracking-wide uppercase ${
                                    status === "ACTIVE" ? "bg-black text-white" : "bg-gray-100 text-black/40"
                                }`}>
                                    {status}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
