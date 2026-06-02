"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { Header } from "@/components/Navigation/Header";
import { Compass, ArrowLeft, Home, Settings, ShieldAlert, Users } from "lucide-react";

export default function NotFound() {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    // Prevent hydration mismatches
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    // Check if the current route is within the dashboard context
    const isPublicRoute =
        pathname.startsWith("/login") ||
        pathname.startsWith("/signup") ||
        pathname.startsWith("/forgot-password") ||
        pathname.startsWith("/reset-password");

    // Reusable Page Not Found Content
    const ErrorContent = () => (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center max-w-lg mx-auto">
            {/* Monochromatic Illustration Grid */}
            <div className="relative mb-8 flex items-center justify-center">
                <div className="absolute inset-0 bg-neutral-100 rounded-full scale-150 blur-xl opacity-50" />
                <div className="w-16 h-16 rounded-2xl border border-light-border bg-white flex items-center justify-center shadow-xs">
                    <Compass className="w-8 h-8 text-black animate-pulse" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold border-2 border-white">
                    !
                </div>
            </div>

            {/* Error Code & Text */}
            <h1 className="text-8xl font-black text-black tracking-tighter select-none">404</h1>
            <h2 className="text-lg font-bold text-black mt-3">Route Query Unresolved</h2>
            <p className="text-xs text-black/55 font-medium mt-2 leading-relaxed max-w-sm">
                The administrative resource or setting route you are looking for does not exist or has been relocated within the SAAS system.
            </p>

            {/* Navigation Options */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 w-full">
                <button
                    onClick={() => router.back()}
                    className="w-full sm:w-auto h-9 px-4 rounded-lg border border-light-border bg-white text-black hover:bg-neutral-50 font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                    <ArrowLeft size={14} />
                    Go Back
                </button>
                <Link
                    href="/dashboard"
                    className="w-full sm:w-auto h-9 px-5 rounded-lg bg-black text-white hover:bg-black/90 font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                    <Home size={14} />
                    Dashboard
                </Link>
            </div>

            {/* Quick Links Directory */}
            <div className="w-full mt-12 border-t border-light-border pt-6">
                <p className="text-[10px] font-bold uppercase tracking-wider text-black/35 mb-4 text-left">
                    Suggested Directories
                </p>
                <div className="grid grid-cols-2 gap-3 text-left">
                    <Link
                        href="/settings/users"
                        className="p-3 border border-light-border rounded-xl hover:bg-neutral-50/50 hover:border-black/20 transition flex items-center gap-2.5 text-xs font-semibold text-black/85"
                    >
                        <Users size={15} className="text-black/50" />
                        User Directory
                    </Link>
                    <Link
                        href="/settings/academic-year"
                        className="p-3 border border-light-border rounded-xl hover:bg-neutral-50/50 hover:border-black/20 transition flex items-center gap-2.5 text-xs font-semibold text-black/85"
                    >
                        <Settings size={15} className="text-black/50" />
                        Academic Years
                    </Link>
                </div>
            </div>
        </div>
    );

    // If it's a public route, render without sidebar and layout wrappers
    if (isPublicRoute) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50/50">
                <ErrorContent />
            </div>
        );
    }

    // Default: Render inside the Dashboard Layout (Sidebar + Header + Content Area)
    return (
        <div className="flex h-screen overflow-hidden bg-white">
            <Sidebar isOpen={isSidebarOpen} />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Header toggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-y-auto p-6 bg-white">
                    <div className="w-auto mx-auto">
                        <ErrorContent />
                    </div>
                </main>
            </div>
        </div>
    );
}