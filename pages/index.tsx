import Link from "next/link";
import Date from "../components/date";
import { GetStaticProps } from "next";
import { getPosts, type Post } from "../lib/posts";
import { Introduction } from "../lib/config";
import Page from "../components/page";

export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {
            allPosts: getPosts(),
        },
    };
};

export default function Index({ allPosts }: { allPosts: Post[] }) {
    return (
        <Page>
            <section className="py-2 text-md">
                <Introduction />
            </section>

            <section className="py-2 font-sans">
                <h2>Blog</h2>
                <ul className="my-1 flex flex-col gap-2">
                    {allPosts.map(({ id, date, title }) => (
                        <li key={id}>
                            <Link href={`/posts/${id}`} className="flex flex-col">
                                <span className="hover:underline">{title}</span>
                                <small className="text-gray-500">
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
