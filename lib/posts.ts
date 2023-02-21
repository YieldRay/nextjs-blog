import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { groupBy } from "lodash";
import MarkdownIt from "markdown-it";
import markdownItHighlightjs from "markdown-it-highlightjs";

export interface Post {
    id: string;
    content: string;
    html: string;
    title: string;
    date: number;
    update?: number;
    tags?: string[];
    categories?: string[];
}
export type PostMeta = Omit<Post, "content" | "html">;

export interface PostInfo {
    id: string;
    title: string;
    timestamp: number;
}

export const postsDirectory = path.join(process.cwd(), "posts");

export const getFileNames = () => fs.readdirSync(postsDirectory).filter((p) => p.endsWith(".md"));

export const getIDs = () => getFileNames().map((f) => f.replace(/\.md$/, ""));

export const getPathsForID = () => toPaths(getIDs(), "id");

export const getPosts = () =>
    getFileNames()
        .map((f) => getMD(f))
        .sort((a, b) => b.date - a.date);

export const getPostsMeta = () =>
    getFileNames()
        .map((f) => getMD(f, true))
        .sort((a, b) => b.date - a.date);

export const getArchives = () => toArchives(getPostsMeta());

export const getPost = (id: string) => getMD(id + ".md");

export const getPathsForTag = () => toPaths(toTags(getPostsMeta()), "tag");

export const getTags = () => toTags(getPostsMeta());

export const getTag = (tag: string) => findTagFromPosts(getPostsMeta(), tag);

/**
 * for `getStaticPaths()`
 */
export function toPaths<K extends string>(paths: string[], key: K) {
    return paths.map((path) => ({
        params: {
            [key as K]: path,
        } as { K: string },
    }));
}

/*****************/
//
//    utils
//
/*****************/

/**
 * parse to timestamp
 */
function parseDate(date: string): number {
    const t = Date.parse(date);
    if (Number.isNaN(t)) {
        throw new Error(`Fail to parse date: ${date}`);
    }
    return t;
}

/**
 * use hljs
 */
function parseMD(m: string): string {
    const md = new MarkdownIt({
        breaks: true,
    }).use(markdownItHighlightjs);
    return md.render(m);
}

function getMD(filename: string): Post;
function getMD(filename: string, metaOnly: true): PostMeta;
function getMD(filename: string, metaOnly = false): Post | PostMeta {
    const fullPath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const id = filename.replace(/\.md$/, "");
    let { content, data } = matter(fileContents);
    const date = Reflect.has(data, "date") ? parseDate(data.date) : fs.statSync(fullPath).birthtimeMs;
    const update = Reflect.has(data, "update") ? parseDate(data.update) : fs.statSync(fullPath).atimeMs;
    const title = Reflect.has(data, "title") ? data.title : id;

    if (metaOnly) {
        return { ...data, id, title, date, update } as PostMeta;
    } else {
        const html = parseMD(content);
        return { ...data, id, title, date, update, content, html } as Post;
    }
}

function post2info({ id, title, date }: PostMeta): PostInfo {
    return {
        id,
        title,
        timestamp: date,
    };
}

function toArchives(allPosts: PostMeta[]): Array<{ year: string; posts: PostInfo[] }> {
    const grouped = groupBy(allPosts, (post) => new Date(post.date).getFullYear());
    return Object.entries(grouped)
        .map(([year, posts]) => ({
            year,
            posts: posts.map(post2info),
        }))
        .sort(({ year: a }, { year: b }) => Number(b) - Number(a));
}

function toTags(allPosts: PostMeta[]) {
    return [...new Set((allPosts.filter((p) => p.tags).map((p) => p.tags) as Array<string[]>).flat())];
}

function findTagFromPosts(allPosts: PostMeta[], tag: string) {
    return allPosts.filter((p) => p.tags?.includes(tag)).map(post2info);
}
