"use client";

import { useSidebarNav } from "@/hooks/useSidebarNav";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight, ChevronsUpDown, User, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/hooks/useLogout";
import UserProfileDrawer from "./UserProfileDrawer";

export function Sidebar({ isOpen }: { isOpen: boolean }) {
    const navGroups = useSidebarNav();
    const [openItems, setOpenItems] = useState<Set<string>>(new Set());
    const pathname = usePathname();
    const { user } = useAuthStore();
    const { logout } = useLogout();
    const userRole = user?.roles?.[0] || 'Employee';

    // Dropdown states
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleItem = (href: string) => {
        setOpenItems((prev) => {
            const next = new Set(prev);
            next.has(href) ? next.delete(href) : next.add(href);
            return next;
        });
    };

    // Helper function to format role names
    function formatRole(role?: string) {
        return role
            ?.toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    if (!isOpen) return null;

    return (
        <aside className="w-xs white text-black bg-gray-50 p-3 flex flex-col h-screen select-none">
            {/* Top User Card with Dropdown */}
            <div ref={dropdownRef} className="relative mb-4">
                <div
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className={`cursor-pointer hover:bg-gray-100 hover:ring-gray-200 hover:ring p-1.5 flex items-center justify-between rounded-md transition duration-150 ${isDropdownOpen ? "bg-gray-150 ring ring-gray-200" : ""}`}
                >
                    <div className="flex items-center justify-start gap-2">
                        <div className="py-1.5 px-3 rounded-md text-gray-200 bg-black font-mono font-bold select-none">
                            {String((user?.firstName?.[0] || "") + (user?.lastName?.[0] || ""))}
                        </div>
                        <div className="max-w-[140px]">
                            <h1 className="font-semibold text-sm truncate text-black">{String((user?.firstName || "") + " " + (user?.lastName || ""))}</h1>
                            <p className="text-[10px] text-black/55 font-medium truncate capitalize">Role: {formatRole(userRole)}</p>
                        </div>
                    </div>
                    <div>
                        <ChevronsUpDown width={18} height={18} className="text-black/50" />
                    </div>
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-light-border rounded-xl shadow-lg z-50 overflow-hidden divide-y divide-light-border animate-fade-in">
                        <div className="px-3 py-2.5 bg-neutral-50/50">
                            <Link
                                href={`mailto:${user?.email}`}
                                className="font-semibold text-xs text-black truncate">
                                {user?.email}
                            </Link>
                        </div>
                        <div>
                            <button
                                onClick={() => {
                                    setIsDropdownOpen(false);
                                    setIsProfileOpen(true);
                                }}
                                className="w-full text-left px-3 py-2.5 text-xs font-semibold text-black/70 hover:text-black hover:bg-neutral-50 transition flex items-center gap-2 cursor-pointer"
                            >
                                <User size={14} className="text-black/45" />
                                My Profile
                            </button>
                            <Link
                                href="/settings/institute"
                                onClick={() => setIsDropdownOpen(false)}
                                className="w-full text-left px-3 py-2.5 text-xs font-semibold text-black/70 hover:text-black hover:bg-neutral-50 transition flex items-center gap-2 cursor-pointer "
                            >
                                <Settings size={14} className="text-black/45" />
                                System Settings
                            </Link>
                        </div>
                        <div>
                            <button
                                onClick={() => {
                                    setIsDropdownOpen(false);
                                    logout();
                                }}
                                className="w-full text-left px-3 py-3 text-xs font-semibold text-red-600 hover:bg-red-50/50 transition flex items-center gap-2 cursor-pointer"
                            >
                                <LogOut size={14} />
                                Sign Out
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Lists */}
            <div className="flex-1 overflow-y-auto pr-1 slim-scrollbar">
                {navGroups.map((group) => (
                    <div key={group.groupLabel} className="mb-6">
                        <p className="px-4 py-1 text-xs text-neutral-500 capitalize">
                            {group.groupLabel}
                        </p>
                        {group.items.map((item) => {
                            const hasChildren = item.children && item.children.length > 0;
                            const isOpen = openItems.has(item.href);
                            const isActive = pathname === item.href || (hasChildren && item.children?.some((child) => child.href === pathname));
                            return (
                                <div key={item.href}>
                                    {!hasChildren ? (
                                        <Link
                                            href={item.href}
                                            scroll={false}
                                            className={`w-full flex items-center justify-between px-4 py-1.5 focus:outline-none text-sm rounded-sm ${isOpen ? "bg-gray-100" : "hover:bg-gray-100"} 
                                        ${isActive ? "bg-gray-100 font-medium ring-1 ring-gray-200" : "hover:bg-gray-100"}`}>
                                            <span>{item.label}</span>
                                            {hasChildren && (
                                                isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                                            )}
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={() => hasChildren && toggleItem(item.href)}
                                            className={`w-full flex items-center justify-between px-4 py-1.5 focus:outline-none text-sm rounded-sm ${isOpen ? "bg-gray-100" : "hover:bg-gray-100"} 
                                        ${isActive ? "bg-gray-100 font-medium ring-1 ring-gray-200" : "hover:bg-gray-100"}`}>
                                            <span>{item.label}</span>
                                            {hasChildren && (
                                                <ChevronRight
                                                    size={16}
                                                    className={`transition-transform duration-200 ease-in-out ${isOpen ? "rotate-90" : "rotate-0"}`} />
                                            )}
                                        </button>
                                    )}

                                    {hasChildren && isOpen && (
                                        <div className="my-1.5">
                                            {item?.children?.map((child) => {
                                                const isActive = pathname === child?.href;
                                                return (
                                                    <Link
                                                        key={child.href}
                                                        scroll={false}
                                                        href={child.href}
                                                        className={`block px-6 py-1.5 my-1 text-sm hover:bg-gray-100 transition-colors ease-linear duration-150 rounded-sm text-gray-600 hover:text-black ${isActive ? "bg-gray-100 font-medium text-black ring-1 ring-gray-200" : "hover:bg-gray-100 hover:text-black"}`}>
                                                        {child.label}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Profile slide drawer modal */}
            <UserProfileDrawer
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                user={user}
            />
        </aside>
    );
}