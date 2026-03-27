"use client"
import { ErrorFallbackProps } from '@/interfaces/interface'
import { AlertTriangle } from 'lucide-react'

const ErrorFallback = ({ refetch, title }: ErrorFallbackProps) => {
    return (
        <div className="border-light-border border p-4 rounded-xl">
            <div className="py-1 text-lg font-medium text-black/80">
                <p>{title}</p>
            </div>
            <div className="flex flex-col items-center justify-center py-16 gap-3">
                <AlertTriangle size={28} className="text-black/20" />
                <p className="text-sm font-medium text-black/50">Failed to load data</p>
                <p className="text-xs text-black/30">Something went wrong. Please try again.</p>
                <button
                    onClick={() => refetch()}
                    className="mt-1 text-sm font-medium px-3 py-1.5 border border-light-border rounded-lg hover:bg-gray-100 text-black/70 transition-all ease-linear">
                    Try again
                </button>
            </div>
        </div>
    )
}

export default ErrorFallback