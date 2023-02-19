import Head from "next/head";
import Layout from "../../components/layout";
import Date from "../../components/date";
import Content from "../../components/content";
import hljs from "highlight.js";
import { GetStaticProps, GetStaticPaths } from "next";
import { getAllIds, getPost, type Post } from "../../lib/posts";
import { useEffect } from "react";

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = getAllIds();
    return {
        paths,
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
    useEffect(() => {
        hljs.highlightAll();
    }, []);
    return (
        <Layout>
            <Head>
                <title>{post.title}</title>
                <link href="https://cdn.jsdelivr.net/npm/highlightjs@9.16.2/styles/vs2015.min.css" rel="stylesheet" />
            </Head>

            <article>
                <h1 className="p-0">{post.title}</h1>
                <div className="text-sm py-0.5 text-gray-500">
                    <Date timestamp={post.date} />
                </div>

                <section className="py-6">
                    <Content html={post.html} />
                </section>
            </article>
        </Layout>
    );
}
