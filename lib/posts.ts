import fs from "fs";
import path from "path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";

export interface PostData {
    id: string;
    content: string;
    title: string;
    date: number;
    update?: number;
    tags?: string[];
    categories?: string[];
}

const postsDirectory = path.join(process.cwd(), "posts");

function getFileNames() {
    return fs.readdirSync(postsDirectory);
}

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

/**
 * this do not parse markdown
 */
export function getAllPostsData(sort = true) {
    const fileNames = getFileNames();
    const allPostsData = fileNames.map((fileName) => getPostData(fileName, false, true));
    return sort ? allPostsData.sort((a, b) => a.date - b.date) : allPostsData;
}

export function getAllPostIds() {
    const fileNames = getFileNames();
    return fileNames.map((fileName) => ({
        params: {
            id: fileName.replace(/\.md$/, ""),
        },
    }));
}

/**
 * simply call `getPostData(id)` with no '.md' suffix is fine
 */
export function getPostData(idOrPath: string, md2html = true, hasAddSuffix = false) {
    const id = hasAddSuffix ? idOrPath.replace(/\.md$/, "") : idOrPath;
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    let { content, data } = matter(fileContents);
    const date = Reflect.has(data, "date") ? parseDate(data.date) : fs.statSync(fullPath).birthtimeMs;
    const update = Reflect.has(data, "update") ? parseDate(data.update) : fs.statSync(fullPath).atimeMs;
    const title = Reflect.has(data, "title") ? data.title : id;
    if (md2html) content = parseMD(content);

    const post: PostData = { ...data, id, title, date, update, content };

    return post;
}
