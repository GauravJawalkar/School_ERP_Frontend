"use client";

import { useSidebarNav } from "@/hooks/useSidebarNav";
import { useState } from "react";
import { ChevronDown, ChevronRight, ChevronsUpDown, Landmark } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export function Sidebar({ isOpen }: { isOpen: boolean }) {
    const navGroups = useSidebarNav();
    const [openItems, setOpenItems] = useState<Set<string>>(new Set());
    const pathname = usePathname();
    const { user } = useAuthStore();
    const userRole = user?.roles?.[0] || 'Employee'

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
        <aside className="w-xs white text-black bg-gray-50 p-3 flex flex-col h-screen">
            <div className="relative mb-4 cursor-pointer hover:bg-gray-100 hover:ring-gray-200 hover:ring p-1.5 flex items-center justify-between rounded-md">
                <div className="flex items-center justify-start gap-2">
                    <div className="py-1.5 px-3 rounded-md text-gray-200 bg-black">
                        <h1>{String(user?.firstName[0] + user?.lastName[0])}</h1>
                    </div>
                    <div>
                        <h1 className="font-semibold text-sm">{String(user?.firstName + " " + user?.lastName)}</h1>
                        <p className="text-xs capitalize">Role: {formatRole(userRole)}</p>
                    </div>
                </div>
                <div>
                    <ChevronsUpDown width={18} height={18} />
                </div>
            </div>
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
                                                    className={`transition-transform duration-200 ease-in-out  ${isOpen ? "rotate-90" : "rotate-0"}`} />
                                            )}
                                        </button>
                                    )}

                                    {hasChildren && isOpen && (
                                        <div className="my-1.5">
                                            {item?.children?.map((child) => {
                                                const isActive = pathname === child?.href
                                                return (
                                                    <Link
                                                        key={child.href}
                                                        scroll={false}
                                                        href={child.href}
                                                        className={`block px-6 py-1.5 my-1 text-sm hover:bg-gray-100 transition-colors ease-linear duration-150 rounded-sm text-gray-600 hover:text-black ${isActive ? "bg-gray-100 font-medium text-black ring-1 ring-gray-200" : "hover:bg-gray-100 hover:text-black"}`}>
                                                        {child.label}
                                                    </Link>
                                                )
                                            }
                                            )}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                ))
                }
            </div>
        </aside >
    );
}