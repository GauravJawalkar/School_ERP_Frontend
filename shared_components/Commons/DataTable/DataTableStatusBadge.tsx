"use client";

import React from "react";
import { CircleCheckBig, ShieldAlert, CircleAlert, Clock, XCircle, Ban, CheckCircle2 } from "lucide-react";

export type StatusVariant =
    | "active"
    | "inactive"
    | "pending"
    | "approved"
    | "rejected"
    | "inquiry"
    | "suspended"
    | "expired"
    | "warning"
    | "neutral";

interface DataTableStatusBadgeProps {
    status: string;
    variant?: StatusVariant;
    showDot?: boolean;
    showIcon?: boolean;
    className?: string;
}

export function DataTableStatusBadge({
    status,
    variant,
    showDot = true,
    showIcon = false,
    className = ""
}: DataTableStatusBadgeProps) {
    const normalizedStatus = (status || "").toLowerCase().trim();

    // Auto-resolve variant if not explicitly passed
    const resolvedVariant: StatusVariant =
        variant ||
        (normalizedStatus === "active" || normalizedStatus === "approved" || normalizedStatus === "paid" || normalizedStatus === "success"
            ? "active"
            : normalizedStatus === "inactive" || normalizedStatus === "rejected" || normalizedStatus === "failed"
                ? "inactive"
                : normalizedStatus === "suspended" || normalizedStatus === "banned"
                    ? "suspended"
                    : normalizedStatus === "pending" || normalizedStatus === "awaiting"
                        ? "pending"
                        : normalizedStatus === "inquiry" || normalizedStatus === "draft"
                            ? "inquiry"
                            : normalizedStatus === "expired" || normalizedStatus === "overdue"
                                ? "expired"
                                : "neutral");

    const getStyles = () => {
        switch (resolvedVariant) {
            case "active":
            case "approved":
                return {
                    container: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    dot: "bg-emerald-500",
                    icon: <CheckCircle2 size={12} className="text-emerald-600" />
                };
            case "inactive":
            case "rejected":
                return {
                    container: "bg-rose-50 text-rose-700 border-rose-200",
                    dot: "bg-rose-500",
                    icon: <XCircle size={12} className="text-rose-600" />
                };
            case "suspended":
                return {
                    container: "bg-red-50 text-red-700 border-red-200",
                    dot: "bg-red-500 animate-pulse",
                    icon: <Ban size={12} className="text-red-600" />
                };
            case "pending":
                return {
                    container: "bg-neutral-50 text-neutral-600 border-neutral-200",
                    dot: "bg-neutral-400",
                    icon: <Clock size={12} className="text-neutral-500" />
                };
            case "inquiry":
            case "warning":
                return {
                    container: "bg-amber-50 text-amber-800 border-amber-200",
                    dot: "bg-amber-500",
                    icon: <CircleAlert size={12} className="text-amber-600" />
                };
            case "expired":
                return {
                    container: "bg-orange-50 text-orange-800 border-orange-200",
                    dot: "bg-orange-500",
                    icon: <ShieldAlert size={12} className="text-orange-600" />
                };
            default:
                return {
                    container: "bg-gray-50 text-gray-700 border-gray-200",
                    dot: "bg-gray-400",
                    icon: <CircleCheckBig size={12} className="text-gray-500" />
                };
        }
    };

    const styles = getStyles();

    return (
        <span
            className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider select-none ${styles.container} ${className}`}
        >
            {showIcon ? styles.icon : showDot ? <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} /> : null}
            <span className="capitalize">{status.replace(/_/g, " ").toLowerCase()}</span>
        </span>
    );
}
