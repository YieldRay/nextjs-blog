import { getAllPostsData } from "./posts";
import { groupBy } from "lodash";

export function getArchive() {
    const allPostsData = getAllPostsData();
    const grouped = groupBy(allPostsData, (post) => new Date(post.date).getFullYear());
    return Object.entries(grouped)
        .map(([year, posts]) => ({
            year,
            posts: posts.map((post) => ({
                id: post.id,
                title: post.title,
                timestamp: post.date,
            })),
        }))
        .sort(({ year: a }, { year: b }) => Number(b) - Number(a));
}
