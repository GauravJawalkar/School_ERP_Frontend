import { Asterisk } from "lucide-react"

export const RequiredBadge = () => {
    return (
        <span className="inline-flex">
            <Asterisk size={10} color="red" />
        </span>
    )
}