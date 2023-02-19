import Link from "next/link";

function div(className: string) {
    return ({ children }: { children: React.ReactNode }) => <div className={className}>{children}</div>;
}
export const ColCenter = div("flex flex-col items-center text-center");

export function LinkList({
    list,
    children,
    row,
}: {
    list: Array<{ href: string; name: string }>;
    children?: React.ReactNode;
    row?: boolean;
}) {
    return (
        <ul className={row ? "flex flex-row gap-2" : "flex flex-col"}>
            {list.map(({ href, name }) => (
                <li key={href}>
                    <Link href={href}>
                        <span className="hover:underline">{name}</span>
                        {children}
                    </Link>
                </li>
            ))}
        </ul>
    );
}
