import Layout from "../../components/layout";
import Date from "../../components/date";
import Head from "next/head";
import { GetStaticProps, GetStaticPaths } from "next";
import { getAllPostIds, getPostData, PostData } from "../../lib/posts";
import { useEffect } from "react";
import hljs from "highlight.js";

function Styled({ children }: any) {
    return (
        <>
            <style jsx global>{`
                * {
                    font-size: 16px;
                }
                li {
                    margin: 1rem;
                    list-style-type: disc;
                    display: list-item;
                    text-align: -webkit-match-parent;
                }
                p {
                    padding: 0.5rem 0;
                }
                h1,
                h2,
                h3,
                h4,
                h5,
                h6 {
                    font-weight: bold;
                    padding-bottom: 0.5rem;
                }
                h1 {
                    font-size: 1.5rem;
                }
                h2 {
                    font-size: 1.25rem;
                }
                h3 {
                    font-size: 1rem;
                }
                h4 {
                    font-size: 0.75rem;
                }
                h5 {
                    font-size: 0.5rem;
                }
                h6 {
                    font-size: 0.25rem;
                }
                pre {
                    font-size: 14px;
                    border-radius: 0.25rem;
                    overflow: hidden;
                    margin: 2px;
                }
            `}</style>
            {children}
        </>
    );
}

export default function Post({ postData }: { postData: PostData }) {
    useEffect(() => {
        hljs.highlightAll();
    }, []);
    return (
        <Layout>
            <Head>
                <title>{postData.title}</title>
                <link href="https://cdn.jsdelivr.net/npm/highlightjs@9.16.2/styles/vs2015.min.css" rel="stylesheet" />
            </Head>

            <article>
                <h1 className="text-3xl font-bold">{postData.title}</h1>
                <div className="text-sm py-2 pb-6 text-gray-500">
                    <Date timestamp={postData.date} />
                </div>

                <Styled>
                    <div dangerouslySetInnerHTML={{ __html: postData.content }} />
                </Styled>
            </article>
        </Layout>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = getAllPostIds();
    return {
        paths,
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const postData = getPostData(params?.id as string);
    return {
        props: {
            postData,
        },
    };
};
