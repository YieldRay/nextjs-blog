import Head from "next/head";
import Link from "next/link";
import Layout from "../components/layout";
import { GetStaticProps } from "next";
import { siteTitle } from "../lib/config";
import { getArchives } from "../lib/posts";
import { Fragment } from "react";

export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {
            archives: getArchives(),
        },
    };
};

export default function Home({ archives }: { archives: ReturnType<typeof getArchives> }) {
    return (
        <Layout>
            <Head>
                <title>{`${siteTitle} - archive`}</title>
            </Head>
            <section>
                {archives.map(({ year, posts }) => (
                    <Fragment key={year}>
                        <h2>{year}</h2>
                        <ul>
                            {posts.map((post) => (
                                <Link key={post.id} href={`/posts/${post.id}`}>
                                    <li>{post.title}</li>
                                </Link>
                            ))}
                        </ul>
                    </Fragment>
                ))}
            </section>
        </Layout>
    );
}
