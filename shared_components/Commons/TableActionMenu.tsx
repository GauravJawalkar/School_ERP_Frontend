"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { Ellipsis } from "lucide-react"
import { Action } from "@/interfaces/interface"

export default function TableActionMenu({ actions }: { actions: Action[] }) {
    const [open, setOpen] = useState(false)
    const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({})
    const triggerRef = useRef<HTMLDivElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)  // ← track the portal div too

    const toggleMenu = () => {
        if (!triggerRef.current) return
        const rect = triggerRef.current.getBoundingClientRect()
        const openUp = window.innerHeight - rect.bottom < 160

        setMenuStyle({
            position: "fixed",
            top: openUp ? undefined : rect.bottom + 4,
            bottom: openUp ? window.innerHeight - rect.top + 4 : undefined,
            right: window.innerWidth - rect.right,
            zIndex: 9999,
        })
        setOpen(prev => !prev)
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent | TouchEvent) => {
            const target = e.target as Node
            if (!target?.isConnected) return
            // ← close only if click is outside BOTH the trigger and the menu
            if (
                triggerRef.current?.contains(target) ||
                menuRef.current?.contains(target)
            ) return
            setOpen(false)
        }
        const handleScroll = () => setOpen(false)

        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("touchstart", handleClickOutside)
        window.addEventListener("scroll", handleScroll, true)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("touchstart", handleClickOutside)
            window.removeEventListener("scroll", handleScroll, true)
        }
    }, [])

    return (
        <div ref={triggerRef} className="relative">
            <button
                onClick={toggleMenu}
                className="text-black/70 hover:text-black hover:bg-gray-100 p-1.5 rounded-md transition">
                <Ellipsis size={16} />
            </button>

            {open && createPortal(
                <div
                    ref={menuRef}  // ← attach ref to the portal div
                    style={menuStyle}
                    className="min-w-30 bg-white rounded-md shadow-lg border border-light-border text-xs p-1">
                    {actions.map((action, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                action.onClick()
                                setOpen(false)
                            }}
                            className={`w-full flex items-center justify-between gap-4 p-1.5 rounded-md hover:bg-gray-100
                                ${action.danger
                                    ? "text-red-500 hover:text-red-600"
                                    : "text-black/70 hover:text-black"
                                }`}>
                            {action.label}
                            {action.icon}
                        </button>
                    ))}
                </div>,
                document.body
            )}
        </div>
    )
}