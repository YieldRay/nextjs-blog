import Head from "next/head";
import Layout from "../../components/layout";
import Date from "../../components/date";
import Content from "../../components/content";
import { GetStaticProps, GetStaticPaths } from "next";
import { getPathsForID, getPost, type Post } from "../../lib/posts";
import { ColCenter, LinkList } from "../../components/utils";
import Link from "next/link";
import { siteTitle } from "../../lib/config";

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
                <title>{post.title + " | " + siteTitle}</title>
                <link href="//cdn.jsdelivr.net/npm/highlightjs@9.16.2/styles/vs2015.min.css" rel="stylesheet" />
            </Head>

            <article>
                <ColCenter>
                    <h1 className="p-0">{post.title}</h1>
                    <div className="flex justify-center items-center gap-2">
                        <RowCenter>
                            <Clock />
                            <Date timestamp={post.date} />
                        </RowCenter>

                        {post.tags && (
                            <RowCenter>
                                <Tag />
                                <LinkList
                                    row
                                    className="text-sm duration-200 opacity-80 hover:opacity-100"
                                    list={post.tags?.map((tag) => ({ name: `#${tag}`, href: `/tags/${tag}` }))}
                                ></LinkList>
                            </RowCenter>
                        )}
                    </div>
                </ColCenter>

                <section className="py-6">
                    <Content html={post.html} />
                </section>
            </article>

            <div className="my-4">
                <Link href="/" className="group flex relative">
                    <span className="transition -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 absolute -left-4">
                        ←
                    </span>
                    <span className="underline">Back to home</span>
                </Link>
            </div>
        </Layout>
    );
}

function RowCenter({ children }: { children: React.ReactNode }) {
    return <div className="flex justify-center items-center">{children}</div>;
}

function Clock() {
    return (
        <svg
            className="scale-75"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
            <path d="M12 7l0 5l3 3"></path>
        </svg>
    );
}

function Tag() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="scale-75"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <circle cx="8.5" cy="8.5" r="1" fill="currentColor"></circle>
            <path d="M4 7v3.859c0 .537 .213 1.052 .593 1.432l8.116 8.116a2.025 2.025 0 0 0 2.864 0l4.834 -4.834a2.025 2.025 0 0 0 0 -2.864l-8.117 -8.116a2.025 2.025 0 0 0 -1.431 -.593h-3.859a3 3 0 0 0 -3 3z"></path>
        </svg>
    );
}
