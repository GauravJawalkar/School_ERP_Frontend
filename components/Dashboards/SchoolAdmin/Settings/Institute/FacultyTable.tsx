"use client";

import React from "react";

interface StaffMember {
    id: number;
    firstName: string;
    lastName: string;
    designation: string;
    department: string | null;
    joiningDate: string;
}

interface FacultyTableProps {
    staff: StaffMember[];
}

export default function FacultyTable({ staff }: FacultyTableProps) {
    return (
        <div className="bg-white border border-light-border rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="border-b border-light-border bg-neutral-50/50 text-[10px] font-bold text-black/45 uppercase tracking-wider">
                            <th className="p-4 font-bold">Faculty Member</th>
                            <th className="p-4 font-bold">Primary Designation</th>
                            <th className="p-4 font-bold">Department</th>
                            <th className="p-4 font-bold text-right">Joining Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-light-border text-xs">
                        {!staff || staff.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-black/40 font-semibold">
                                    No campus staff members registered in this profile query.
                                </td>
                            </tr>
                        ) : (
                            staff.map((st) => (
                                <tr key={st.id} className="hover:bg-neutral-50/50 transition">
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-neutral-100 text-black font-bold flex items-center justify-center border border-neutral-200 select-none text-[10px]">
                                                {st.firstName[0]}{st.lastName[0]}
                                            </div>
                                            <span className="font-bold text-black">{st.firstName} {st.lastName}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 font-semibold text-black/85 uppercase text-[10px] tracking-wider">
                                        {st.designation}
                                    </td>
                                    <td className="p-4 font-semibold text-black/60 uppercase text-[10px] tracking-wider">
                                        {st.department || "General Administration"}
                                    </td>
                                    <td className="p-4 text-right font-medium text-black/75">
                                        {st.joiningDate ? new Date(st.joiningDate).toLocaleDateString() : "N/A"}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
