export const formatTo12HourRange = (timeRange?: string) => {
    if (!timeRange) return ""

    // Preserving off days / non-standard ranges
    if (timeRange.toLowerCase() === "off" || timeRange.toLowerCase() === "closed") {
        return timeRange
    }

    const parts = timeRange.split("-").map((p) => p.trim())
    if (parts.length !== 2) {
        return timeRange
    }

    const formatTime = (timeStr: string) => {
        const timeParts = timeStr.split(":")
        if (timeParts.length < 2) return timeStr

        let hours = parseInt(timeParts[0], 10)
        const minutes = timeParts[1].substring(0, 2)

        if (isNaN(hours)) return timeStr

        const ampm = hours >= 12 ? "PM" : "AM"
        hours = hours % 12
        hours = hours ? hours : 12
        const hoursStr = String(hours).padStart(2, "0")

        return `${hoursStr}:${minutes} ${ampm}`
    }

    try {
        const start = formatTime(parts[0])
        const end = formatTime(parts[1])
        return `${start} - ${end}`
    } catch (e) {
        return timeRange
    }
}