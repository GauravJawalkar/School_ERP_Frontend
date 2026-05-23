"use client"

import React from "react"
import { School, Clock, MapPin, Globe, Mail, Phone, FileText } from "lucide-react"
import { formatTo12HourRange } from "@/lib/helpers/formatTime"

interface SchoolAcademicsSectionProps {
    data: any
}

export default function SchoolAcademicsSection({ data }: SchoolAcademicsSectionProps) {
    const contactInfo = data?.contactInfo || {}
    const additionalInfo = data?.additionalInfo || {}
    const addressDetails = contactInfo?.address_details || {}

    return (
        <div className="border border-light-border bg-white rounded-xl p-5 shadow-xs space-y-5">
            {/* Header */}
            <div className="flex items-center gap-2.5 pb-4 border-b border-light-border">
                <div className="h-9 w-9 rounded-md bg-black flex items-center justify-center text-white">
                    <School size={18} />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-black">Academics & Directory</h3>
                    <p className="text-xs text-black/50">Curriculum, hours, and physical coordinates</p>
                </div>
            </div>

            {/* Boards Affiliated */}
            <div className="space-y-2">
                <h4 className="text-[11px] font-semibold text-black/50 uppercase tracking-wider flex items-center gap-1.5">
                    Affiliated Boards
                </h4>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {additionalInfo?.boardsAffiliated && additionalInfo.boardsAffiliated.length > 0 ? (
                        additionalInfo.boardsAffiliated.map((board: string, i: number) => (
                            <span
                                key={i}
                                className="text-xs bg-neutral-100 text-black/75 border border-light-border px-2.5 py-0.5 rounded-full font-medium"
                            >
                                {board}
                            </span>
                        ))
                    ) : (
                        <span className="text-xs text-black/40 italic">No boards specified</span>
                    )}
                </div>
            </div>

            {/* Operating Hours */}
            <div className="space-y-2">
                <h4 className="text-[11px] font-semibold text-black/50 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock size={12} /> Office Working Hours
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs pt-0.5">
                    <div className="border border-light-border p-2.5 rounded-lg bg-gray-50/50">
                        <p className="text-[10px] font-medium text-black/40">Mon — Fri</p>
                        <p className="font-semibold text-black mt-0.5">
                            {contactInfo?.office_hours?.monday_to_friday
                                ? formatTo12HourRange(contactInfo.office_hours.monday_to_friday)
                                : "08:00 AM - 03:00 PM"}
                        </p>
                    </div>
                    <div className="border border-light-border p-2.5 rounded-lg bg-gray-50/50">
                        <p className="text-[10px] font-medium text-black/40">Saturday</p>
                        <p className="font-semibold text-black mt-0.5">
                            {contactInfo?.office_hours?.saturday
                                ? formatTo12HourRange(contactInfo.office_hours.saturday)
                                : "08:00 AM - 12:30 PM"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Location Address coordinates */}
            <div className="space-y-2">
                <h4 className="text-[11px] font-semibold text-black/50 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin size={12} /> Campus Location
                </h4>
                <div className="text-xs text-black/70 border border-light-border p-3 rounded-lg space-y-1.5 bg-gray-50/20">
                    <p className="font-medium text-black/95">{data?.location || "No address details specified"}</p>
                    {addressDetails?.landmark && (
                        <p className="text-xs text-black/50">
                            <span className="font-medium">Landmark:</span> {addressDetails.landmark}
                        </p>
                    )}
                    {(addressDetails?.city || addressDetails?.state) && (
                        <p className="text-xs text-black/50">
                            {addressDetails.city && `${addressDetails.city}, `}
                            {addressDetails.state && addressDetails.state}
                            {addressDetails.pincode && ` — ${addressDetails.pincode}`}
                        </p>
                    )}
                </div>
            </div>

            {/* General Directory Contacts */}
            <div className="space-y-2">
                <h4 className="text-[11px] font-semibold text-black/50 uppercase tracking-wider">
                    General Contacts
                </h4>
                <div className="space-y-2 text-xs border border-light-border p-3 rounded-lg bg-gray-50/20">
                    {contactInfo?.website && (
                        <div className="flex items-center gap-2 text-black/70">
                            <Globe size={13} className="text-black/40 shrink-0" />
                            <a
                                href={contactInfo.website.startsWith("http") ? contactInfo.website : `https://${contactInfo.website}`}
                                target="_blank"
                                rel="noreferrer"
                                className="hover:text-black transition hover:underline truncate"
                            >
                                {contactInfo.website}
                            </a>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-black/70">
                        <Mail size={13} className="text-black/40 shrink-0" />
                        <a href={`mailto:${data?.email}`} className="hover:text-black transition hover:underline truncate">
                            {contactInfo?.emails?.primary || "No email available"}
                        </a>
                    </div>
                    {contactInfo?.main_phone && (
                        <div className="flex items-center gap-2 text-black/70">
                            <Phone size={13} className="text-black/40 shrink-0" />
                            <a href={`tel:${contactInfo.main_phone}`} className="hover:text-black transition hover:underline">
                                {contactInfo.main_phone}
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* Identity & Values Block */}
            {(additionalInfo?.missionStatement || additionalInfo?.visionStatement || (additionalInfo?.coreValues && additionalInfo.coreValues.length > 0)) && (
                <div className="space-y-3 pt-1">
                    <h4 className="text-[11px] font-semibold text-black/50 uppercase tracking-wider flex items-center gap-1.5">
                        <FileText size={12} /> Identity & Values
                    </h4>
                    {additionalInfo?.visionStatement && (
                        <div className="text-xs italic text-black/60 border-l-2 border-black pl-3 py-1 bg-gray-50/50 rounded-r-md">
                            <p className="font-medium text-black/40 not-italic text-[10px] uppercase mb-0.5">Vision</p>
                            "{additionalInfo.visionStatement}"
                        </div>
                    )}
                    {additionalInfo?.missionStatement && (
                        <div className="text-xs italic text-black/60 border-l-2 border-black pl-3 py-1 bg-gray-50/50 rounded-r-md">
                            <p className="font-medium text-black/40 not-italic text-[10px] uppercase mb-0.5">Mission</p>
                            "{additionalInfo.missionStatement}"
                        </div>
                    )}
                    {additionalInfo?.coreValues && additionalInfo.coreValues.length > 0 && (
                        <div className="pt-1">
                            <p className="font-semibold text-black/50 text-[10px] uppercase tracking-wider mb-1.5">Core Values</p>
                            <div className="flex flex-wrap gap-1.5">
                                {additionalInfo.coreValues.map((value: string, index: number) => (
                                    <span key={index} className="text-[10px] bg-black text-white px-2 py-0.5 rounded-sm font-semibold tracking-wide uppercase">
                                        {value}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
