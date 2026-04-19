import { KeyboardEvent, useState } from "react"
import { X } from "lucide-react"

interface TagChipInputProps {
    value: string[]
    onChange: (val: string[]) => void
    onBlur?: () => void
    placeholder?: string
    hint?: string
}

const TagChipInput = ({ value = [], onChange, onBlur, placeholder = "Type & press Enter…", hint }: TagChipInputProps) => {
    const [input, setInput] = useState('')

    const add = () => {
        const trimmed = input.trim()
        if (!trimmed || value.includes(trimmed)) return
        onChange([...value, trimmed])
        setInput('')
    }

    const remove = (tag: string) => onChange(value.filter(t => t !== tag))

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            add()
        }
        if (e.key === 'Backspace' && !input && value.length) {
            remove(value[value.length - 1])
        }
    }

    return (
        <div className="flex flex-col gap-1">
            <div
                className="flex flex-wrap gap-1.5 p-2 border border-input-border rounded-md bg-white min-h-[38px] cursor-text focus-within:ring-2 focus-within:ring-neutral-400/50 focus-within:shadow transition-all"
                onClick={(e) => (e.currentTarget.querySelector('input') as HTMLInputElement)?.focus()}
            >
                {value.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 bg-neutral-100 border border-neutral-200 text-neutral-700 text-xs px-2 py-0.5 rounded-md">
                        {tag}
                        <button
                            type="button"
                            onClick={() => remove(tag)}
                            className="text-neutral-400 hover:text-neutral-700 transition-colors"
                        >
                            <X size={11} />
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={() => { add(); onBlur?.() }}
                    placeholder={value.length === 0 ? placeholder : ''}
                    className="flex-1 min-w-[100px] text-sm outline-none bg-transparent placeholder:text-black/30"
                />
            </div>
            {hint && <p className="text-xs text-black/40">{hint}</p>}
        </div>
    )
}

export default TagChipInput