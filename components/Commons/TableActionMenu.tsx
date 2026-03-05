"use client"

import { useState, useRef, useEffect } from "react"
import { Ellipsis } from "lucide-react"
import { Action } from "@/interfaces/interface"

export default function TableActionMenu({ actions }: { actions: Action[] }) {
    const [open, setOpen] = useState(false)
    const [openUp, setOpenUp] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    const toggleMenu = () => {
        if (!ref.current) return

        const rect = ref.current.getBoundingClientRect()
        const spaceBelow = window.innerHeight - rect.bottom

        // if space below is less, open upward
        setOpenUp(spaceBelow < 160)

        setOpen(!open)
    }


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            const target = event.target as Node
            if (!target?.isConnected) return
            if (ref.current && !ref.current.contains(target)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("touchstart", handleClickOutside)
        }
    }, [])

    return (
        <div ref={ref} className="relative">
            {/* Button */}
            <button
                onClick={toggleMenu}
                className="text-black/70 hover:text-black hover:bg-gray-100 p-1.5 rounded-md transition"
            >
                <Ellipsis size={16} />
            </button>

            {/* Dropdown */}
            {open && (
                <div
                    className={`absolute right-0 min-w-30 bg-white rounded-md shadow-lg border border-light-border text-sm p-1 z-50
                    ${openUp ? "bottom-full mb-1" : "top-full mt-1"}`}
                >
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
                                }`}
                        >
                            {action.label}
                            {action.icon}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}