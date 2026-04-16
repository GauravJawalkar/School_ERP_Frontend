import { PenTool, Share2, ShieldBan, UserStar } from "lucide-react"
import Image from "next/image"

const SchoolHero = ({ }) => {
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
                            <span className="h-2 w-2 bg-green-500 rounded-full" />
                            <span>
                                Active
                            </span>
                        </h1>
                    </div>
                </div>
                {/* Logo */}
                <div className="absolute -bottom-1/5 left-5">
                    {/* <Image alt="school-logo" src={'https://res.cloudinary.com/dauznfh72/image/upload/v1764271211/School_Erp_Logos/pwgoh1iz1av2zvxw0fta.png'} className="h-18 w-18 ring ring-light-border rounded-lg object-contain" height={2000} width={2000} /> */}
                    <h1 className="h-18 w-18 ring ring-light-border rounded-lg flex items-center justify-center text-lg font-semibold tracking-widest bg-white">MMV</h1>
                </div>
            </div>
            {/* Name & Tags */}
            <div className="mt-12 px-5">
                {/* Descriptive Info */}
                <div>
                    <div>
                        <h1 className="text-xl text-black font-semibold">Mahatoba Madyemic Vidyalay</h1>
                    </div>
                    <div className="flex items-center gap-1 my-0.5">
                        <p className="text-sm text-black/50 flex items-center gap-1">
                            Since  1990,
                        </p>
                        <p className="text-sm text-black/50 flex items-center gap-1">
                            Alandi Mahatobachi.
                        </p>
                    </div>
                    <div className="my-0.5">
                        <p className="text-sm text-black/50 flex items-center gap-1">
                            Affiliation No : 9380KDFBI0480NBOJE
                        </p>
                    </div>
                </div>
                {/* School Tags */}
                <div className="py-2 text-xs flex items-center gap-2">
                    <h1 className="px-2.5 py-1 bg-gray-50 ring ring-light-border rounded-full text-black/50 flex items-center gap-2">
                        <span>
                            # CBSE
                        </span>
                    </h1>

                    <h1 className="px-2.5 py-1 bg-gray-50 ring ring-light-border rounded-full text-black/50 flex items-center gap-2">
                        <span>
                            # Nursery – XII
                        </span>
                    </h1>

                    <h1 className="px-2.5 py-1 bg-gray-50 ring ring-light-border rounded-full text-black/50 flex items-center gap-2">
                        <span>
                            # English Medium
                        </span>
                    </h1>

                    <h1 className="px-2.5 py-1 bg-gray-50 ring ring-light-border rounded-full text-black/50 flex items-center gap-2">
                        <span>
                            # Tech Education
                        </span>
                    </h1>
                </div>
                {/* Action Buttons */}
                <div className="py-2 flex items-center gap-2">
                    <button className="text-sm rounded-md py-1.5 px-3 flex items-center gap-1 border border-light-border text-black/90 hover:bg-gray-100 transition cursor-pointer">
                        <PenTool className="h-4 w-4 text-black/70" />
                        Edit Profile
                    </button>
                    <button className="text-sm rounded-md py-1.5 px-3 flex items-center gap-1 border border-light-border text-black/90 hover:bg-gray-100 transition cursor-pointer">
                        <ShieldBan className="h-4 w-4 text-black/70" />
                        De-Activate
                    </button>
                    <button className="text-sm rounded-md py-1.5 px-3 flex items-center gap-1 border border-light-border text-black/90 hover:bg-gray-100 transition cursor-pointer">
                        <UserStar className="h-4 w-4 text-black/70" />
                        Add Admin
                    </button>
                    <button className="text-sm rounded-md py-1.5 px-3 flex items-center gap-1 border border-light-border text-black/90 hover:bg-gray-100 transition cursor-pointer">
                        <Share2 className="h-4 w-4 text-black/70" />
                        Share
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SchoolHero