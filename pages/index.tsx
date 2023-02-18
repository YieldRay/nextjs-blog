import Head from "next/head";
import Layout from "../components/layout";
import { getAllPostsData, PostData } from "../lib/posts";
import Link from "next/link";
import Date from "../components/date";
import { GetStaticProps } from "next";
import { Introduction, siteTitle } from "../lib/config";

export default function Home({ allPostsData }: { allPostsData: PostData[] }) {
    return (
        <Layout>
            <Head>
                <title>{siteTitle}</title>
            </Head>

            <section className="py-2 text-md">
                <Introduction />
            </section>

            <section className="my-2 font-sans">
                <h2 className="text-xl font-bold">Blog</h2>
                <ul className="my-1 flex flex-col gap-2">
                    {allPostsData.map(({ id, date, title }) => (
                        <li key={id} className="flex flex-col">
                            <span className="hover:underline decoration-slate-200">
                                <Link href={`/posts/${id}`}>{title}</Link>
                            </span>
                            <small>
                                <Date timestamp={date} />
                            </small>
                        </li>
                    ))}
                </ul>
            </section>
        </Layout>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const allPostsData = getAllPostsData();
    return {
        props: {
            allPostsData,
        },
    };
};
