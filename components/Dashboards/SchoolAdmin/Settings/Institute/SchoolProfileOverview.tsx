"use client";

import React from "react";
import {
    FileText,
    Activity,
    Phone,
    Mail,
    Globe,
    MapPin,
    Clock,
    Shield,
    ExternalLink
} from "lucide-react";

interface SchoolProfileOverviewProps {
    schoolDetails: any;
}

export default function SchoolProfileOverview({ schoolDetails }: SchoolProfileOverviewProps) {
    const contactInfo = schoolDetails?.contactInfo || {};
    const additionalInfo = schoolDetails?.additionalInfo || {};

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Primary Profile Details & Mission Statements */}
                <div className="md:col-span-2 space-y-6">
                    {/* General Profile Card */}
                    <div className="bg-white border border-light-border p-6 rounded-xl space-y-5 shadow-xs">
                        <h3 className="text-xs font-bold text-black/45 uppercase tracking-wider flex items-center gap-2 border-b border-neutral-100 pb-3 select-none">
                            <FileText size={13} />
                            General Roster Profile
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div>
                                <p className="text-black/40 font-semibold mb-0.5">Founder / Director</p>
                                <p className="font-bold text-black/85">{additionalInfo.founderName || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-black/40 font-semibold mb-0.5">Established Year</p>
                                <p className="font-bold text-black/85">{additionalInfo.establishedYear || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-black/40 font-semibold mb-0.5">Affiliation Number</p>
                                <p className="font-bold text-black/85">{schoolDetails?.affiliationNumber || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-black/40 font-semibold mb-0.5">Medium of Instruction</p>
                                <p className="font-bold text-black/85">{schoolDetails?.medium || "N/A"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Institutional Intent */}
                    <div className="bg-white border border-light-border p-6 rounded-xl space-y-5 shadow-xs">
                        <h3 className="text-xs font-bold text-black/45 uppercase tracking-wider flex items-center gap-2 border-b border-neutral-100 pb-3 select-none">
                            <Activity size={13} />
                            Institutional Intent
                        </h3>
                        <div className="space-y-4 text-xs">
                            <div>
                                <p className="text-black/40 font-semibold mb-1">Mission Statement</p>
                                <p className="font-medium text-black/80 leading-relaxed italic">
                                    "{additionalInfo.missionStatement || "To build, nurture, and prepare global citizens for future challenges through strict academic regimes and state-of-the-art infrastructure."}"
                                </p>
                            </div>
                            <div>
                                <p className="text-black/40 font-semibold mb-1">Vision Statement</p>
                                <p className="font-medium text-black/80 leading-relaxed italic">
                                    "{additionalInfo.visionStatement || "To lead progressive academic automation and set global standards in primary and secondary school training systems."}"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Directory Contact & Office Hours */}
                <div className="space-y-6">
                    {/* Contact Details Card */}
                    <div className="bg-white border border-light-border p-6 rounded-xl space-y-4 text-xs shadow-xs">
                        <h3 className="text-xs font-bold text-black/45 uppercase tracking-wider flex items-center gap-2 border-b border-neutral-100 pb-3 select-none">
                            <Phone size={13} />
                            Directory Contact
                        </h3>
                        <div className="space-y-3 font-medium text-black/85">
                            <div className="flex items-center gap-3">
                                <Phone size={14} className="text-black/35" />
                                <span>{contactInfo.main_phone || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail size={14} className="text-black/35" />
                                <span>{contactInfo.emails?.primary || "N/A"}</span>
                            </div>
                            {contactInfo.website && (
                                <div className="flex items-center gap-3">
                                    <Globe size={14} className="text-black/35" />
                                    <a
                                        href={contactInfo.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-black hover:underline inline-flex items-center gap-0.5 font-bold"
                                    >
                                        Visit Portal
                                        <ExternalLink size={10} />
                                    </a>
                                </div>
                            )}
                            <div className="flex items-start gap-3 border-t border-neutral-100 pt-3">
                                <MapPin size={14} className="text-black/35 mt-0.5" />
                                <div>
                                    <p className="font-bold">{schoolDetails?.address || "N/A"}</p>
                                    <p className="text-[10px] text-black/50 mt-0.5">
                                        {contactInfo.address_details?.landmark && `${contactInfo.address_details?.landmark}, `}
                                        {contactInfo.address_details?.city && `${contactInfo.address_details?.city}, `}
                                        {contactInfo.address_details?.state} {contactInfo.address_details?.pincode && `- ${contactInfo.address_details?.pincode}`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Campus Hours Card */}
                    <div className="bg-white border border-light-border p-6 rounded-xl space-y-4 text-xs shadow-xs">
                        <h3 className="text-xs font-bold text-black/45 uppercase tracking-wider flex items-center gap-2 border-b border-neutral-100 pb-3 select-none">
                            <Clock size={13} />
                            Office / Campus Hours
                        </h3>
                        <div className="space-y-2 font-medium text-black/75">
                            <div className="flex justify-between">
                                <span>Monday - Friday</span>
                                <span className="font-bold text-black">{contactInfo.office_hours?.monday_to_friday || "08:00 AM - 03:00 PM"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Saturday</span>
                                <span className="font-bold text-black">{contactInfo.office_hours?.saturday || "08:00 AM - 12:30 PM"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Sunday</span>
                                <span className="font-bold text-black">{contactInfo.office_hours?.sunday || "Closed"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* License & Directory Metadata (Tags, Core values, etc) */}
            <div className="bg-white border border-light-border p-6 rounded-xl space-y-5 shadow-xs">
                <h3 className="text-xs font-bold text-black/45 uppercase tracking-wider flex items-center gap-2 border-b border-neutral-100 pb-3 select-none">
                    <Shield size={13} />
                    License & Directory Metadata
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                    {/* Boards */}
                    <div>
                        <h4 className="font-bold text-black/60 mb-2">Boards Affiliated</h4>
                        <div className="flex flex-wrap gap-1.5">
                            {additionalInfo.boardsAffiliated?.length > 0 ? (
                                additionalInfo.boardsAffiliated.map((board: string, i: number) => (
                                    <span key={i} className="px-2 py-0.5 bg-neutral-50 border border-light-border rounded-md font-bold text-[10px] text-black/75 uppercase select-none">
                                        {board}
                                    </span>
                                ))
                            ) : (
                                <span className="text-black/40 italic">No affiliations registered</span>
                            )}
                        </div>
                    </div>

                    {/* Values */}
                    <div>
                        <h4 className="font-bold text-black/60 mb-2">Core Campus Values</h4>
                        <div className="flex flex-wrap gap-1.5">
                            {additionalInfo.coreValues?.length > 0 ? (
                                additionalInfo.coreValues.map((value: string, i: number) => (
                                    <span key={i} className="px-2 py-0.5 bg-neutral-50 border border-light-border rounded-md font-bold text-[10px] text-black/75 uppercase select-none">
                                        {value}
                                    </span>
                                ))
                            ) : (
                                <span className="text-black/40 italic">No campus values registered</span>
                            )}
                        </div>
                    </div>

                    {/* Alumni */}
                    <div>
                        <h4 className="font-bold text-black/60 mb-2">Notable Alumni</h4>
                        <div className="flex flex-wrap gap-1.5">
                            {additionalInfo.notableAlumni?.length > 0 ? (
                                additionalInfo.notableAlumni.map((alumnus: string, i: number) => (
                                    <span key={i} className="px-2 py-0.5 bg-neutral-50 border border-light-border rounded-md font-bold text-[10px] text-black/75 uppercase select-none">
                                        {alumnus}
                                    </span>
                                ))
                            ) : (
                                <span className="text-black/40 italic">No alumni entries registered</span>
                            )}
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <h4 className="font-bold text-black/60 mb-2">Search Tags</h4>
                        <div className="flex flex-wrap gap-1.5">
                            {additionalInfo.tags?.length > 0 ? (
                                additionalInfo.tags.map((tag: string, i: number) => (
                                    <span key={i} className="px-2 py-0.5 bg-neutral-50 border border-light-border rounded-md font-bold text-[10px] text-black/75 uppercase select-none">
                                        {tag}
                                    </span>
                                ))
                            ) : (
                                <span className="text-black/40 italic">No search tags registered</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
