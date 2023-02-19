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
                    font-size: 14px;
                    border-radius: 0.25rem;
                    overflow: hidden;
                    margin: 2px;
                }
            `}</style>
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    );
}
