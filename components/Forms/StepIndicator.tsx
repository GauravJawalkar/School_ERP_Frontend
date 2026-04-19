import { Check } from "lucide-react"

interface Step { label: string }
interface StepIndicatorProps { steps: Step[]; current: number }

const StepIndicator = ({ steps, current }: StepIndicatorProps) => (
    <div className="relative flex items-center justify-between">

        {/* Single full-width track line */}
        <div
            className="absolute h-px bg-neutral-200"
            style={{ top: '14px', left: '14px', right: '25px' }}
        />

        {/* Progress fill line */}
        <div
            className="absolute h-px bg-black transition-all duration-300"
            style={{
                top: '14px',
                left: '14px',
                width: current === 0
                    ? '0%'
                    : `calc(${(current / (steps.length - 1)) * 100}% - 40px)`,
            }}
        />

        {/* Circles + labels */}
        {steps.map((step, i) => {
            const done = i < current
            const active = i === current
            return (
                <div key={i} className="relative z-10 flex flex-col items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border transition-all duration-200
                        ${done || active
                            ? 'bg-black border-black text-white'
                            : 'bg-white border-neutral-300 text-neutral-400'
                        }`}>
                        {done ? <Check size={13} strokeWidth={2.5} /> : i + 1}
                    </div>
                    <span className={`text-xs whitespace-nowrap font-normal transition-colors
                        ${i <= current ? 'text-black' : 'text-neutral-400'}`}>
                        {step.label}
                    </span>
                </div>
            )
        })}
    </div>
)

export default StepIndicator