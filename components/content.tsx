import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const top = 50; // 50vh
const screenBoundary = 48; //48rem

export default function ({ html }: { html: string }) {
    const postRef = useRef<HTMLDivElement>(null);
    const [anchors, setAnchors] = useState<JSX.Element>(<></>);
    useEffect(() => {
        if (postRef.current) {
            setAnchors(createAnchors(postRef.current.querySelectorAll("h1,h2,h3,h4,h5,h6,h7")));
        }
    }, [postRef]);
    useEffect(() => {
        const y = window.innerHeight * (top / 100); //! coresponding to `?vh`
        const onScroll = () => {
            const target = document.querySelector(".anchor-container");
            if (target instanceof HTMLElement) {
                const rect = target.getBoundingClientRect();
                if (rect.top > 0 || window.scrollY < y) {
                    target.style.position = "absolute";
                    target.style.top = "50%";
                } else {
                    target.style.position = "fixed";
                    target.style.top = "0px";
                }
            }
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    return (
        <>
            <style jsx global>{`
                #post-content {
                    font-size: 95%;
                }
                #post-content a:hover {
                    text-decoration: underline;
                }
                #post-content li {
                    margin: 1rem;
                    list-style-type: disc;
                    display: list-item;
                    text-align: -webkit-match-parent;
                }
                #post-content p {
                    padding: 0.5rem 0;
                }
                #post-content pre {
                    margin: 2px 0;
                }
                #post-content pre > .hljs {
                    border-radius: 0.25rem;
                    padding: 1rem;
                }
                #post-content h1 a,
                #post-content h2 a,
                #post-content h3 a,
                #post-content h4 a,
                #post-content h5 a,
                #post-content h6 a {
                    color: #333;
                }

                .anchor-container {
                    z-index: 1;
                    max-height: ${top}vh;
                    padding: 2rem 0;
                    width: 6rem;
                    position: absolute;
                    top: ${top}vh;
                    right: 0;
                }
                @media screen and (max-width: ${screenBoundary}rem) {
                    .anchor-container {
                        padding: 0.25rem 1rem;
                        position: static;
                        width: 100%;
                        background-color: #fcfcfc;
                        border-radius: 0.2rem;
                        overflow: hidden;
                        box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.05), -1px 1px 1px rgba(0, 0, 0, 0.05);
                    }
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
            `}</style>
            <div id="post-content">
                {anchors}
                <div ref={postRef} dangerouslySetInnerHTML={{ __html: html }} />
            </div>
        </>
    );
}

function createAnchors(headings: NodeListOf<HTMLHeadingElement>) {
    return (
        <>
            <aside className="anchor-container">
                <details open={window.innerWidth > screenBoundary * 16}>
                    <summary>
                        <strong className="cursor-pointer select-none px-2">目录</strong>
                    </summary>

                    {Array.from(headings).map((e) => {
                        const level = Number(e.tagName.slice(1));
                        const text = (e.textContent ?? "").trim();
                        const hash = `#${text}`;
                        e.classList.add("anchor-h");
                        e.id = text;
                        const a = document.createElement("a");
                        a.href = hash;
                        a.classList.add("anchor-a");
                        a.innerHTML = "#";
                        e.prepend(a);
                        return (
                            <div key={hash} className="ellipsis" style={{ marginLeft: (level - 1) * 14 + "px" }}>
                                <Link href={hash}>{text}</Link>
                            </div>
                        );
                    })}
                </details>
            </aside>
        </>
    );
}
