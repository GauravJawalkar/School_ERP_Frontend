"use client"
import { Loader2, PenTool, Share2, ShieldBan, ShieldCheck, UserStar } from "lucide-react"
import Image from "next/image"
import Link from "next/link";
import AddAdminModal from "../../Modals/AddAdminModal";
import { useState } from "react";
import { ApiClient } from "@/interceptors/ApiClient";
import { BASE_URL } from "@/constants/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { schoolHeroProps } from "@/interfaces/interface";
import toast from "react-hot-toast";


const STATUS_CONFIG = {
    ACTIVE: { label: 'Suspend', icon: ShieldBan, next: 'SUSPENDED', className: 'text-red-500 border-red-200 hover:bg-red-50' },
    SUSPENDED: { label: 'Activate', icon: ShieldCheck, next: 'ACTIVE', className: 'text-green-600 border-green-200 hover:bg-green-50' },
    INACTIVE: { label: 'Activate', icon: ShieldCheck, next: 'ACTIVE', className: 'text-green-600 border-green-200 hover:bg-green-50' },
} as const

const STATUS_DOT: Record<string, string> = {
    ACTIVE: 'bg-green-500',
    INACTIVE: 'bg-red-500',
    SUSPENDED: 'bg-orange-500',
    PENDING_APPROVAL: 'bg-gray-500',
}

const SchoolHero = ({ data }: { data: schoolHeroProps }) => {
    const queryClient = useQueryClient();
    const [openModal, setOpenModal] = useState(false);
    const [selectedSchool, setSelectedSchool] = useState({
        schoolId: 0,
        schoolName: '',
        schoolEmail: '',
    });

    const openAddAdminModal = (data: schoolHeroProps) => {
        setSelectedSchool({
            schoolId: data.id,
            schoolName: data.name,
            schoolEmail: data?.email || '',
        })
        setOpenModal(true);
    }

    const closeAddAdminModal = () => {
        setOpenModal(false);
        setSelectedSchool({ schoolName: '', schoolId: 0, schoolEmail: '' });
    }

    const getInitials = (name: string) => {
        return name
            ?.trim()
            .split(/\s+/)
            .map(word => word[0])
            .join('')
            .toUpperCase();
    };

    const updateSchoolStatusMutation = useMutation({
        mutationFn: (nextStatus: string) =>
            ApiClient.patch(`${BASE_URL}/institute/${data.slug}/status`, { status: nextStatus }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['schoolDetails'] });
            toast.success('School status updated');
        }
    })

    const statusConfig = STATUS_CONFIG[data.status as keyof typeof STATUS_CONFIG]
    const StatusIcon = statusConfig?.icon

    return (
        <div className="pb-5">
            {/* Cover Area */}
            <div className="bg-gray-100/70 rounded-lg h-42 w-full relative">
                {/* Active and Board Tags */}
                <div className="flex items-start justify-between py-2 px-3">
                    <div className="text-xs border px-2 py-1 rounded-full border-light-border bg-white">
                        <h1>CBSE Affiliated</h1>
                    </div>
                    <div>
                        <h1 className="flex items-center gap-2 text-xs border px-2 py-1 rounded-full border-light-border bg-white">
                            <span className={`h-2 w-2 rounded-full ${STATUS_DOT[data?.status] ?? 'bg-gray-400'}`} />
                            <span className="capitalize">{data?.status.toLocaleLowerCase()}</span>
                        </h1>
                    </div>
                </div>
                {/* Logo */}
                <div className="absolute -bottom-1/5 left-5">
                    {data?.logo
                        ? <Image alt="school-logo" src={data?.logo} className="h-18 w-18 ring ring-light-border rounded-lg object-contain" height={2000} width={2000} />
                        : <h1 className="h-18 w-18 ring ring-light-border rounded-lg flex items-center justify-center text-lg font-semibold tracking-widest bg-white">{getInitials(data?.name)}</h1>
                    }
                </div>
            </div>

            {/* Name & Tags */}
            <div className="mt-12 px-5">
                {/* Descriptive Info */}
                <div>
                    <h1 className="text-xl text-black font-semibold">{data?.name}</h1>
                    <div className="flex items-center gap-1 my-0.5">
                        <p className="text-sm text-black/50">Since {data?.establishedIn},</p>
                        <p className="text-sm text-black/50">{data?.location}.</p>
                    </div>
                    <p className="text-sm text-black/50 my-0.5">Affiliation No : {data?.affiliationNo}</p>
                </div>

                {/* School Tags */}
                <div className="py-2 text-xs flex items-center gap-2">
                    {data?.tags?.map((tag, index) => (
                        <h1 key={index} className="px-2.5 py-1 bg-gray-50 ring ring-light-border rounded-full text-black/50 flex items-center gap-2">
                            # {tag}
                        </h1>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="py-2 flex items-center gap-2">
                    <Link href={`/schools/edit/${data?.slug}`} className="text-sm rounded-md py-1.5 px-3 flex items-center gap-1 border border-light-border text-black/90 hover:bg-gray-100 transition cursor-pointer">
                        <PenTool className="h-4 w-4 text-black/70" />
                        Edit Profile
                    </Link>

                    {/* Dynamic status button */}
                    {statusConfig && (
                        <button
                            onClick={() => updateSchoolStatusMutation.mutate(statusConfig.next)}
                            disabled={updateSchoolStatusMutation.isPending}
                            className={`text-sm rounded-md py-1.5 px-3 flex items-center gap-1 border transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${statusConfig.className}`}>
                            {updateSchoolStatusMutation.isPending
                                ? <Loader2 className="h-4 w-4 animate-spin" />
                                : <StatusIcon className="h-4 w-4" />
                            }
                            {statusConfig.label}
                        </button>
                    )}

                    <button onClick={() => openAddAdminModal(data)} className="text-sm rounded-md py-1.5 px-3 flex items-center gap-1 border border-light-border text-black/90 hover:bg-gray-100 transition cursor-pointer">
                        <UserStar className="h-4 w-4 text-black/70" />
                        Add Admin
                    </button>

                    <button className="text-sm rounded-md py-1.5 px-3 flex items-center gap-1 border border-light-border text-black/90 hover:bg-gray-100 transition cursor-pointer">
                        <Share2 className="h-4 w-4 text-black/70" />
                        Share
                    </button>
                </div>
            </div>

            {openModal && (
                <AddAdminModal isOpen={openModal} school={selectedSchool} onClose={closeAddAdminModal} />
            )}
        </div>
    )
}

export default SchoolHero