"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { Ellipsis } from "lucide-react"
import { Action } from "@/interfaces/interface"

export default function TableActionMenu({ actions }: { actions: Action[] }) {
    const [open, setOpen] = useState(false)
    const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({})
    const ref = useRef<HTMLDivElement>(null)

    const toggleMenu = () => {
        if (!ref.current) return

        const rect = ref.current.getBoundingClientRect()
        const spaceBelow = window.innerHeight - rect.bottom
        const openUp = spaceBelow < 160

        // Calculate fixed position relative to viewport so it escapes
        // any overflow-x-auto / overflow-hidden ancestor completely
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
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            const target = event.target as Node
            if (!target?.isConnected) return
            if (ref.current && !ref.current.contains(target)) {
                setOpen(false)
            }
        }
        // Close on scroll so menu doesn't float away from its row
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
        <div ref={ref} className="relative">
            {/* Trigger button */}
            <button
                onClick={toggleMenu}
                className="text-black/70 hover:text-black hover:bg-gray-100 p-1.5 rounded-md transition">
                <Ellipsis size={16} />
            </button>

            {/* Portal — renders into document.body, escapes all overflow clipping */}
            {open && createPortal(
                <div
                    style={menuStyle}
                    className="min-w-30 bg-white rounded-md shadow-lg border border-light-border text-sm p-1">
                    {actions.map((action, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                action.onClick()
                                setOpen(false)
                            }}
                            className={`w-full flex items-center justify-between p-1.5 rounded-md hover:bg-gray-100
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