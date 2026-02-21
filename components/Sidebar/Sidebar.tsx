"use client";

import { useSidebarNav } from "@/hooks/useSidebarNav";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export function Sidebar() {
    const navGroups = useSidebarNav();
    const [openItems, setOpenItems] = useState<Set<string>>(new Set());

    const toggleItem = (href: string) => {
        setOpenItems((prev) => {
            const next = new Set(prev);
            next.has(href) ? next.delete(href) : next.add(href);
            return next;
        });
    };

    return (
        <aside className="w-xs white text-black bg-gray-50 h-auto p-4">
            {navGroups.map((group) => (
                <div key={group.groupLabel} className="mb-6">
                    <p className="px-4 py-2 text-xs text-gray-400 uppercase">
                        {group.groupLabel}
                    </p>
                    {group.items.map((item) => {
                        const hasChildren = item.children && item.children.length > 0;
                        const isOpen = openItems.has(item.href);

                        return (
                            <div key={item.href}>
                                <button
                                    onClick={() => hasChildren && toggleItem(item.href)}
                                    className={`w-full flex items-center justify-between px-4 py-2 focus:outline-none text-sm rounded-sm ${isOpen ? "bg-gray-100" : "hover:bg-gray-100"}`}>
                                    <span>{item.label}</span>
                                    {hasChildren && (
                                        isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                                    )}
                                </button>

                                {hasChildren && isOpen && (
                                    <div className="py-1">
                                        {item?.children?.map((child) => (
                                            <a
                                                key={child.href}
                                                href={child.href}
                                                className="block px-6 py-1.5 text-sm hover:bg-gray-100 rounded-sm">
                                                {child.label}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            ))
            }
        </aside >
    );
}