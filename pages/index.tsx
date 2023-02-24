import Link from "next/link";
import Date from "../components/date";
import { GetStaticProps } from "next";
import { getPostsMeta, type PostMeta } from "../lib/posts";
import { introduction } from "../lib/config";
import Page from "../components/page";

const Intro = () => introduction;

export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {
            allPosts: getPostsMeta(),
        },
    };
};

export default function Index({ allPosts }: { allPosts: PostMeta[] }) {
    return (
        <Page>
            <section className="py-2 text-md">
                <Intro />
            </section>

            <section className="py-2 font-sans">
                <h2>Blog</h2>
                <ul className="my-1 flex flex-col gap-2">
                    {allPosts.map(({ id, date, title }) => (
                        <li key={id}>
                            <Link href={`/posts/${id}`} className="flex flex-col">
                                <span className="hover:underline">{title}</span>
                                <small className="text-sm">
                                    <Date timestamp={date} />
                                </small>
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
        </Page>
    );
}
