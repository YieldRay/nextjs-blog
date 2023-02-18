import { format } from "date-fns";

export default function Date({ timestamp }: { timestamp: number }) {
    const date = new globalThis.Date(timestamp);
    return <time dateTime={date.toLocaleString()}>{format(date, "LLLL d, yyyy")}</time>;
}
