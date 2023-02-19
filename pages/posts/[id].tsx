import Head from "next/head";
import Layout from "../../components/layout";
import Date from "../../components/date";
import Content from "../../components/content";
import { GetStaticProps, GetStaticPaths } from "next";
import { getPathsForID, getPost, type Post } from "../../lib/posts";
import { ColCenter } from "../../components/utils";
import Link from "next/link";

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: getPathsForID(),
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const post = getPost(params?.id as string);
    return {
        props: {
            post,
        },
    };
};

export default function Post({ post }: { post: Post }) {
    return (
        <Layout>
            <Head>
                <title>{post.title}</title>
                <link href="//cdn.jsdelivr.net/npm/highlightjs@9.16.2/styles/vs2015.min.css" rel="stylesheet" />
            </Head>

            <article>
                <ColCenter>
                    <h1 className="p-0">{post.title}</h1>
                    <div className="text-sm py-0.5 text-gray-500">
                        <Date timestamp={post.date} />
                    </div>
                </ColCenter>

                <section className="py-6">
                    <Content html={post.html} />
                </section>
            </article>

            <div className="my-4">
                <Link href="/" className="group flex">
                    <span className="transition -translate-x-4 opacity-0 group-hover:-translate-x-1 group-hover:opacity-100">
                        ←
                    </span>
                    <span>Back to home</span>
                </Link>
            </div>
        </Layout>
    );
}
