"use client";

import React, { useEffect, useRef } from "react";

interface DataTableCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    indeterminate?: boolean;
}

export const DataTableCheckbox = React.forwardRef<HTMLInputElement, DataTableCheckboxProps>(
    ({ indeterminate = false, className = "", ...props }, forwardedRef) => {
        const localRef = useRef<HTMLInputElement>(null);
        const ref = (forwardedRef as React.RefObject<HTMLInputElement>) || localRef;

        useEffect(() => {
            if (ref.current) {
                ref.current.indeterminate = indeterminate;
            }
        }, [ref, indeterminate]);

        return (
            <input
                type="checkbox"
                ref={ref}
                className={`h-3.5 w-3.5 rounded border-light-border text-black accent-black cursor-pointer transition focus:ring-1 focus:ring-black/20 ${className}`}
                {...props}
            />
        );
    }
);

DataTableCheckbox.displayName = "DataTableCheckbox";
