"use client";

import React from "react";

interface LoadingSpinnerProps {
    /** Optional text displayed beneath the spinner */
    message?: string;
    /** Size preset for the spinner ring */
    size?: "sm" | "md" | "lg";
    /** Custom container height utility class (e.g. "h-[40vh]" or "h-64") */
    containerHeight?: string;
    /** If true, fills screen height ("h-[60vh]" or full view) */
    fullPage?: boolean;
    /** Extra classes for container wrapper */
    className?: string;
}

export default function LoadingSpinner({
    message,
    size = "md",
    containerHeight = "h-[40vh]",
    fullPage = false,
    className = ""
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "w-4 h-4 border",
        md: "w-6 h-6 border-2",
        lg: "w-8 h-8 border-2"
    };

    const containerStyle = fullPage
        ? "h-[60vh] w-full"
        : `${containerHeight} w-full`;

    return (
        <div className={`${containerStyle} flex flex-col items-center justify-center gap-3 ${className}`}>
            <div
                className={`${sizeClasses[size]} border-black border-t-transparent rounded-full animate-spin`}
            />
            {message && (
                <span className="text-xs font-semibold text-black/50 tracking-wider uppercase select-none">
                    {message}
                </span>
            )}
        </div>
    );
}
