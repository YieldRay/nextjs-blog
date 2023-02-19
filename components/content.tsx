export default function ({ html }: { html: string }) {
    return (
        <div>
            <style jsx global>{`
                * {
                    font-size: 16px;
                }
                li {
                    margin: 1rem;
                    list-style-type: disc;
                    display: list-item;
                    text-align: -webkit-match-parent;
                }
                p {
                    padding: 0.5rem 0;
                }
                pre {
                    margin: 2px 0;
                }
                pre > .hljs {
                    border-radius: 0.25rem;
                    padding: 1rem;
                }
            `}</style>
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    );
}
