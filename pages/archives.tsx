import Head from "next/head";
import Layout from "../components/layout";
import { GetStaticProps } from "next";
import { siteTitle } from "../lib/config";
import { getArchive } from "../lib/archive";
import Link from "next/link";

export default function Home({ archiveData }: { archiveData: ReturnType<typeof getArchive> }) {
    return (
        <Layout>
            <Head>
                <title>{`${siteTitle} - archive`}</title>
            </Head>
            <section>
                {archiveData.map(({ year, posts }) => (
                    <>
                        <h2>{year}</h2>

                        {posts.map((post) => (
                            <Link href={`/posts/${post.id}`}>
                                <li>{post.title}</li>
                            </Link>
                        ))}
                    </>
                ))}
            </section>
        </Layout>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {
            archiveData: getArchive(),
        },
    };
};
