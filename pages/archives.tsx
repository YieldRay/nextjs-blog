import { GetStaticProps } from "next";
import { getArchives } from "../lib/posts";
import { Fragment } from "react";
import { LinkList } from "../components/utils";
import Page from "../components/page";

export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {
            archives: getArchives(),
        },
    };
};

export default function ({ archives }: { archives: ReturnType<typeof getArchives> }) {
    return (
        <Page subtitle="archives">
            {archives.map(({ year, posts }) => (
                <Fragment key={year}>
                    <h2>{year}</h2>
                    <LinkList list={posts.map(({ id, title }) => ({ href: `/posts/${id}`, name: title }))} />
                </Fragment>
            ))}
        </Page>
    );
}
