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
            if (!e || !(e instanceof HTMLElement)) return;
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
    });

    useEffect(() => {
        if (postRef.current) setAnchors(Anchors(postRef.current.querySelectorAll("h1,h2,h3,h4,h5,h6,h7")));
    }, [postRef]);

    return (
        <>
            <style jsx global>{`
                .post-content {
                    font-size: 95%;
                }
                .post-content a:hover {
                    text-decoration: underline;
                }
                .post-content code {
                    background-color: #f8f8f8;
                }
                .post-content li {
                    margin: 1rem;
                    list-style-type: disc;
                    display: list-item;
                    text-align: -webkit-match-parent;
                }
                .post-content p {
                    padding: 0.5rem 0;
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
                    color: #66CCFF;
                }
             
                .anchor-h {
                    position: relative;
                }
                .anchor-a {
                    position: absolute;
                    top:50%:
                    transform: translateY(-50%);
                    left: -1.25rem;
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

                .post-container {
                    display: flex;
                    flex-direction: column;
                    font-size: 0.9rem;
                }

                .post-anchor {
                    max-height: 100vh;
                    overflow-x: hidden;
                    overflow-y: auto;
                }


                @media screen and (min-width: 1024px){
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

                @media screen and (min-width: 1280px){
                    .post-anchor {
                        width: 12rem;
                        right: -16rem;
                        transition: all 0.4s;
                    }

                    .post-anchor-fixed {
                        position: fixed;
                        top: 1rem;
                        right: 1rem;
                    }
                }
            `}</style>
            <div className="post-container">
                <div className="post-anchor">{anchors}</div>
                <div className="post-content" ref={postRef} dangerouslySetInnerHTML={{ __html: html }} />
            </div>
        </>
    );
}

function Anchors(headings: NodeListOf<HTMLHeadingElement>) {
    if (headings.length === 0) return <></>;
    return (
        <>
            <aside>
                <details open>
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
                            <div key={hash} className="ellipsis" style={{ marginLeft: (level - 1) * 0.35 + "rem" }}>
                                <Link href={hash}>{text}</Link>
                            </div>
                        );
                    })}
                </details>
            </aside>
        </>
    );
}
