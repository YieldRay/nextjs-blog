import Head  from "next/head";
import { siteTitle } from "../lib/config";
import Layout from "./layout";

export default function ({
    children,
    title,
    subtitle,
}: {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
}) {
    let t = siteTitle;
    if (title) t = title;
    else if (subtitle) t += " - " + subtitle;
    return (
        <Layout>
            <Head>
                <title>{t}</title>
            </Head>
            {children}
        </Layout>
    );
}
