"use client"
import { PenTool, Share2, ShieldBan, UserStar } from "lucide-react"
import Image from "next/image"
import Link from "next/link";
import AddAdminModal from "../../Modals/AddAdminModal";
import { useState } from "react";
import { schoolAdminsApi } from "@/interfaces/interface";

interface schoolHeroProps {
    id: number,
    status: string,
    boardsAffiliated: string[],
    logo: string,
    name: string,
    establishedIn: number,
    location: string,
    affiliationNo: string,
    classes: string[],
    slug: string,
    email: string
}

const SchoolHero = ({ data }: { data: schoolHeroProps }) => {

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
        setSelectedSchool({ schoolName: '', schoolId: 0, schoolEmail: '' }); //  reset on close too
    }

    const getInitials = (name: string) => {
        return name
            ?.trim()
            .split(/\s+/)              // split by spaces
            .map(word => word[0])     // take first letter
            .join('')
            .toUpperCase();
    };
    return (
        <div className="pb-5">
            {/* Cover Area */}
            <div className="bg-gray-100/70 rounded-lg h-42 w-full relative">
                {/* Active and Board Tags */}
                <div className="flex items-start justify-between py-2 px-3">
                    <div className="text-xs border px-2 py-1 rounded-full border-light-border bg-white">
                        <h1 className="">CBSE Affiliated</h1>
                    </div>
                    <div>
                        <h1 className="flex items-center gap-2 text-xs border px-2 py-1 rounded-full border-light-border bg-white">
                            <span className={`h-2 w-2 rounded-full ${data?.status === 'ACTIVE' ? 'bg-green-500' : 'bg-green-500'}`} />
                            <span>
                                {data?.status}
                            </span>
                        </h1>
                    </div>
                </div>
                {/* Logo */}
                <div className="absolute -bottom-1/5 left-5">
                    {!data?.logo ? <Image alt="school-logo" src={data?.logo} className="h-18 w-18 ring ring-light-border rounded-lg object-contain" height={2000} width={2000} /> :
                        <h1 className="h-18 w-18 ring ring-light-border rounded-lg flex items-center justify-center text-lg font-semibold tracking-widest bg-white">{getInitials(data?.name)}</h1>}
                </div>
            </div>
            {/* Name & Tags */}
            <div className="mt-12 px-5">
                {/* Descriptive Info */}
                <div>
                    <div>
                        <h1 className="text-xl text-black font-semibold">{data?.name}</h1>
                    </div>
                    <div className="flex items-center gap-1 my-0.5">
                        <p className="text-sm text-black/50 flex items-center gap-1">
                            Since  {data?.establishedIn},
                        </p>
                        <p className="text-sm text-black/50 flex items-center gap-1">
                            {data?.location}.
                        </p>
                    </div>
                    <div className="my-0.5">
                        <p className="text-sm text-black/50 flex items-center gap-1">
                            Affiliation No : {data?.affiliationNo}
                        </p>
                    </div>
                </div>
                {/* School Tags */}
                <div className="py-2 text-xs flex items-center gap-2">
                    {
                        data?.boardsAffiliated?.map((board, index) => (
                            <h1 key={index} className="px-2.5 py-1 bg-gray-50 ring ring-light-border rounded-full text-black/50 flex items-center gap-2">
                                <span>
                                    # {board}
                                </span>
                            </h1>
                        ))
                    }
                </div>
                {/* Action Buttons */}
                <div className="py-2 flex items-center gap-2">
                    <Link href={`/schools/edit/${data?.slug}`} className="text-sm rounded-md py-1.5 px-3 flex items-center gap-1 border border-light-border text-black/90 hover:bg-gray-100 transition cursor-pointer">
                        <PenTool className="h-4 w-4 text-black/70" />
                        Edit Profile
                    </Link>
                    <button className="text-sm rounded-md py-1.5 px-3 flex items-center gap-1 border border-light-border text-black/90 hover:bg-gray-100 transition cursor-pointer">
                        <ShieldBan className="h-4 w-4 text-black/70" />
                        De-Activate
                    </button>
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