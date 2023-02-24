import { format, formatISO } from "date-fns";

export default function Date({ timestamp }: { timestamp: number }) {
    const date = new globalThis.Date(timestamp);
    return (
        <time className="text-sm py-0.5 text-gray-500 dark:text-stone-100" dateTime={formatISO(date)}>
            {format(date, "LLLL d, yyyy")}
        </time>
    );
}
