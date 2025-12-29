/**
 * Formats a Unix timestamp to a readable date string
 * @param {number} timestamp - Unix timestamp in seconds
 * @returns {Object|null} Object with ISO and formatted date strings, or null if invalid
 */
export function formatLastOnline(timestamp) {
    if (!timestamp) {
        return null;
    }

    const date = new Date(timestamp * 1000);

    return {
        iso: date.toISOString(),
        formatted: date.toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        }),
    };
}
