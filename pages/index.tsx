import Head from "next/head";
import Link from "next/link";
import Layout from "../components/layout";
import Date from "../components/date";
import { GetStaticProps } from "next";
import { getAllPosts, type Post } from "../lib/posts";
import { Introduction, siteTitle } from "../lib/config";

export default function Home({ allPosts }: { allPosts: Post[] }) {
    return (
        <Layout>
            <Head>
                <title>{siteTitle}</title>
            </Head>

            <section className="py-2 text-md">
                <Introduction />
            </section>

            <section className="my-2 font-sans">
                <h2>Blog</h2>
                <ul className="my-1 flex flex-col gap-2">
                    {allPosts.map(({ id, date, title }) => (
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
    return {
        props: {
            allPosts: getAllPosts(),
        },
    };
};
