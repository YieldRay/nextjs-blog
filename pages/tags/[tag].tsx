import { GetStaticProps, GetStaticPaths } from "next";
import { getPathsForTag, getTag, type PostInfo } from "../../lib/posts";
import { LinkList } from "../../components/utils";
import { useRouter } from "next/router";
import Link from "next/link";
import Page from "../../components/page";

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: getPathsForTag(),
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    return {
        props: {
            postsInfo: getTag(params?.tag as string),
        },
    };
};

export default function ({ postsInfo }: { postsInfo: PostInfo[] }) {
    const { asPath } = useRouter();
    const tagName = asPath.replace("/tags/", "");
    return (
        <Page subtitle={tagName}>
            <Link href="/tags">[Back]</Link>
            <h2>{tagName}</h2>
            <LinkList list={postsInfo.map(({ id, title }) => ({ href: `/posts/${id}`, name: title }))}></LinkList>
        </Page>
    );
}
