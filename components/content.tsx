import { throttle } from "lodash";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";

export default function ({ html }: { html: string }) {
    const postRef = useRef<HTMLDivElement>(null);
    const [anchors, setAnchors] = useState<JSX.Element>(<></>);
    const isPC = useMediaQuery({ query: "(min-width: 1024px)" });

    useEffect(() => {
        if (!isPC) return;
        let top: number;
        const onScroll = throttle(() => {
            const e = document.querySelector(".post-container > .post-anchor");
            if (!(e instanceof HTMLElement)) return;
            if (!top) {
                const rect = e.getBoundingClientRect();
                top = window.scrollY + rect.y;
                return;
            }
            if (window.scrollY >= top) {
                e.classList.add("post-anchor-fixed");
            } else {
                e.classList.remove("post-anchor-fixed");
            }
        }, 500);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [isPC]);

    useEffect(() => {
        if (postRef.current) {
            setAnchors(Anchors(postRef.current.querySelectorAll("h1,h2,h3,h4,h5,h6,h7"), isPC));
        }
    }, [isPC]);

    return (
        <>
            <style jsx global>
                {`
                    .post-content {
                        font-size: 95%;
                    }
                    .post-content a:hover {
                        text-decoration: underline;
                    }
                    .post-content code {
                        background-color: #f3f3f3;
                        padding: 0.1rem 0.2rem;
                        border-radius: 0.3rem;
                        box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.04), -1px 2px 1px rgba(0, 0, 0, 0.04);
                    }
                    html.dark .post-content code {
                        background-color: #232323;
                    }
                    .post-content li {
                        margin: 0.5rem;
                        list-style-type: disc;
                        display: list-item;
                        text-align: -webkit-match-parent;
                    }
                    .post-content p {
                        padding: 0.35rem 0;
                    }
                    .post-content pre {
                        margin: 2px 0;
                    }
                    .post-content pre > code {
                        background-color: #2d2d2d;
                    }
                    .post-content pre > .hljs {
                        border-radius: 0.25rem;
                        padding: 1rem;
                    }
                    .post-content h1 a,
                    .post-content h2 a,
                    .post-content h3 a,
                    .post-content h4 a,
                    .post-content h5 a,
                    .post-content h6 a {
                        color: #66ccff;
                    }
                    .post-content table {
                        --shadow: rgba(0, 0, 0, 0.04);
                        border-collapse: collapse;
                        margin: 0.05em;
                        box-shadow: 0.1rem 0.1rem 0.05rem var(--shadow), -0.1rem -0.1rem 0.05rem var(--shadow);
                    }
                    .post-content thead {
                        background-color: rgba(0, 0, 0, 0.07);
                    }
                    .post-content tbody tr {
                        background-color: rgba(0, 0, 0, 0.01);
                    }
                    .post-content tbody tr:nth-child(2n) {
                        background-color: var(--shadow);
                    }
                    .post-content td,
                    .post-content th {
                        padding: 0.25rem 0.5rem;
                    }
                    .post-content blockquote {
                        border-left-color: #66ccff;
                        border-left-width: 0.25rem;
                        padding-left: 0.5rem;
                        box-shadow: 1px 0 2px 2px rgba(0, 0, 0, 0.01);
                        font-style: italic;
                        margin: 0.25rem 0;
                    }

                    .anchor-h {
                        position: relative;
                    }
                    .anchor-a {
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        left: -1rem;
                        transition: all 0.3s;
                        opacity: 0;
                    }
                    .anchor-h:hover > .anchor-a {
                        opacity: 1;
                    }
                    .ellipsis {
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                    .post-anchor {
                        max-height: 100vh;
                        max-width: 33.3vw;
                        overflow-x: hidden;
                        overflow-y: auto;
                        position: fixed;
                        top: 0;
                        right: 0;
                        transition: all 0.4s;
                        user-select: none;
                        z-index: 1;
                    }
                    .post-container {
                        display: flex;
                        flex-direction: column;
                        font-size: 0.9rem;
                    }
                    @media screen and (max-width: 1024px) {
                        .post-anchor {
                            background-color: rgba(0, 0, 0, 0.02);
                            backdrop-filter: blur(2rem);
                            padding: 0.25rem 0.5rem;
                            border-bottom-left-radius: 0.5rem;
                        }
                    }
                    @media screen and (min-width: 1024px) {
                        .post-container {
                            display: block;
                            position: relative;
                        }
                        .post-anchor {
                            width: 6rem;
                            position: absolute;
                            right: -8rem;
                        }
                        .post-anchor-fixed {
                            position: fixed;
                            top: 0;
                            right: 1rem;
                        }
                    }
                    @media screen and (min-width: 1280px) {
                        .post-anchor {
                            width: 12rem;
                            right: -16rem;
                        }
                        .post-anchor-fixed {
                            position: fixed;
                            top: 1rem;
                            right: 1rem;
                        }
                    }
                `}
            </style>
            <div className="post-container">
                <div className="post-anchor">{anchors}</div>
                <div className="post-content" ref={postRef} dangerouslySetInnerHTML={{ __html: html }} />
            </div>
        </>
    );
}

function Anchors(headings: NodeListOf<HTMLHeadingElement>, open = false) {
    if (headings.length === 0) return <></>;
    return (
        <>
            <aside>
                <details open={open}>
                    <summary>
                        <strong className="cursor-pointer select-none px-2">目录</strong>
                    </summary>

                    {Array.from(headings).map((e) => {
                        const level = Number(e.tagName.slice(1));
                        let text = (e.textContent ?? "").trim();
                        if (e.querySelector(".anchor-a")) text = text.replace(/^#+/, ""); //? for DEV
                        const hash = `#${text}`;
                        e.classList.add("anchor-h");
                        e.id = text;
                        const a = document.createElement("a");
                        a.href = hash;
                        a.classList.add("anchor-a");
                        a.innerHTML = "#";
                        e.prepend(a);
                        return (
                            <div key={hash} className="ellipsis" style={{ marginLeft: (level - 1) * 0.5 + "em" }}>
                                <Link href={hash}>{text}</Link>
                            </div>
                        );
                    })}
                </details>
            </aside>
        </>
    );
}
