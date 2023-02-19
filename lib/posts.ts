import fs from "fs";
import path from "path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import { groupBy } from "lodash";

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

export const postsDirectory = path.join(process.cwd(), "posts");
export const getFileNames = () => fs.readdirSync(postsDirectory).filter((p) => p.endsWith(".md"));
export const getAllIds = () =>
    getFileNames().map((f) => ({
        params: {
            id: f.replace(/\.md$/, ""),
        },
    }));
export const getAllPosts = () =>
    getFileNames()
        .map(getMD)
        .sort((a, b) => a.date - b.date);
export const getArchives = () => toArchives(getAllPosts());
export const getPost = (id: string) => getMD(id + ".md");

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
        highlight: (str, lang) => {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(str, { language: lang }).value;
                } catch (__) {}
            }

            return ""; // use external default escaping
        },
    });
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

function toArchives(allPosts: Post[]) {
    const grouped = groupBy(allPosts, (post) => new Date(post.date).getFullYear());
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
