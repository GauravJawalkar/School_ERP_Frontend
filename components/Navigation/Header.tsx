// components/Layout/Header.tsx
"use client";

import { useAuthStore } from "@/store/authStore";
import { ChevronRight, PanelRight } from "lucide-react";
import { usePathname } from "next/navigation";

export function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);
    const { user } = useAuthStore();
    const instituteDetails = user?.instituteDetails;
    let instituteName = instituteDetails?.schoolName;

    function checkIfSuperAdmin() {
        if (user?.roles.includes('SUPER_ADMIN')) {
            return
        }
        return instituteName
    }

    return (
        <header className="bg-white border-b border-gray-200 py-3 flex items-center justify-between px-6">
            {/* Left: Menu Button */}
            <div className="flex items-center justify-start gap-5">
                <div className="border-r border-light-border pr-3">
                    <button
                        onClick={() => toggleSidebar()}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-black/50 hover:text-black/90 cursor-pointer" aria-label="Toggle menu">
                        <PanelRight size={18} />
                    </button>
                </div>
                <div className="text-sm flex items-center gap-4 text-gray-400">
                    {segments.map((segment, index) => (
                        <div key={index} className={`flex items-center gap-2 capitalize`}>
                            <span
                                className={`${index === segments.length - 1 ? "text-black " : "text-gray-600"}`}>
                                {segment}
                            </span>

                            {index !== segments.length - 1 && (
                                <ChevronRight size={15} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h1 className="capitalize text-sm font-medium">{checkIfSuperAdmin()}</h1>
            </div>
        </header>
    );
}