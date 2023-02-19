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

export interface PostInfo {
    id: string;
    title: string;
    timestamp: number;
}

export const postsDirectory = path.join(process.cwd(), "posts");

export const getFileNames = () => fs.readdirSync(postsDirectory).filter((p) => p.endsWith(".md"));

export const getIDs = () => getFileNames().map((f) => f.replace(/\.md$/, ""));

export const getPathsForID = () => toParams(getIDs(), "id");

export const getPosts = () =>
    getFileNames()
        .map(getMD)
        .sort((a, b) => a.date - b.date);

export const getArchives = () => toArchives(getPosts());

export const getPost = (id: string) => getMD(id + ".md");

export const getPathsForTag = () => toParams(toTags(getPosts()), "tag");

export const getTags = () => toTags(getPosts());

export const getTag = (tag: string) => findTagFromPosts(getPosts(), tag);

/**
 * for `getStaticPaths()`
 */
export function toParams(paths: string[], key: string) {
    return paths.map((path) => ({
        params: {
            [key]: path,
        },
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

function getMD(filename: string): Post {
    const fullPath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const id = filename.replace(/\.md$/, "");
    let { content, data } = matter(fileContents);
    const date = Reflect.has(data, "date") ? parseDate(data.date) : fs.statSync(fullPath).birthtimeMs;
    const update = Reflect.has(data, "update") ? parseDate(data.update) : fs.statSync(fullPath).atimeMs;
    const title = Reflect.has(data, "title") ? data.title : id;
    const html = parseMD(content);

    const post: Post = { ...data, id, title, date, update, content, html };
    return post;
}

function post2info({ id, title, date }: Post): PostInfo {
    return {
        id,
        title,
        timestamp: date,
    };
}

function toArchives(allPosts: Post[]): Array<{ year: string; posts: PostInfo[] }> {
    const grouped = groupBy(allPosts, (post) => new Date(post.date).getFullYear());
    return Object.entries(grouped)
        .map(([year, posts]) => ({
            year,
            posts: posts.map(post2info),
        }))
        .sort(({ year: a }, { year: b }) => Number(b) - Number(a));
}

function toTags(allPosts: Post[]) {
    return [...new Set((allPosts.filter((p) => p.tags).map((p) => p.tags) as Array<string[]>).flat())];
}

function findTagFromPosts(allPosts: Post[], tag: string) {
    return allPosts.filter((p) => p.tags?.includes(tag)).map(post2info);
}
