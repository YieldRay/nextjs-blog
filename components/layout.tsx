import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ColCenter } from "./utils";
import { name, siteTitle } from "../lib/config";
const ogImg = `https://og-image.vercel.app/${encodeURI(
    siteTitle
)}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`;

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    return (
        <>
            <style jsx>
                {`
                    .container {
                        max-width: 36rem;
                        padding: 0 1rem;
                        margin: 3rem auto 6rem;
                    }
                `}
            </style>
            <div className="container">
                <Head>
                    <link rel="icon" href="/favicon.ico" />
                    <meta name="description" content="A personal website using Next.js" />
                    <meta property="og:image" content={ogImg} />
                    <meta name="og:title" content={siteTitle} />
                    <meta name="twitter:card" content="summary_large_image" />
                </Head>
                <header className="pb-8">
                    <Avatar></Avatar>
                    <Nav></Nav>
                </header>

                <main>{children}</main>
            </div>
        </>
    );
}

function Avatar() {
    return (
        <ColCenter>
            <Link href="/">
                <div className="transition duration-500 hover:scale-105">
                    <Image
                        priority
                        src="/images/profile.png"
                        height={144}
                        width={144}
                        alt={name}
                        className="rounded-full"
                    />
                </div>
                <h3 className="font-mono text-gray-900 no-underline">{name}</h3>
            </Link>
        </ColCenter>
    );
}

function Nav() {
    const router = useRouter();
    return (
        <ul className="list-none pt-2 flex gap-2 justify-center items-center">
            {[
                ["Home", "/"],
                ["Archives", "/archives"],
                ["Tags", "/tags"],
            ].map(([name, href]) => (
                <li key={href} className="list-none p-1 m-0">
                    <Link href={href}>
                        <Btn active={router.asPath === href}>{name}</Btn>
                    </Link>
                </li>
            ))}
        </ul>
    );
}

function Btn({ children, active }: any) {
    // MIT LICENSE
    // https://uiverse.io/alexmaracinaru/brown-bobcat-65
    return (
        <>
            <button className={`cta ${active ? "active" : ""}`}>
                <span>{children}</span>
            </button>
            <style jsx>{`
                .cta {
                    --primary: #234567;
                    --secondary: #f1f1f1;
                    position: relative;
                    margin: auto;
                    padding: 0.25rem 0.25rem;
                    transition: all 0.2s ease;
                    border: none;
                    background: none;
                }

                .cta:before {
                    --size: 1.5rem;
                    content: "";
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    display: block;
                    border-radius: var(--size);
                    background: var(--secondary);
                    width: var(--size);
                    height: var(--size);
                    transition: all 0.3s ease;
                }

                .cta span {
                    position: relative;
                    font-family: Consolas, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono,
                        Bitstream Vera Sans Mono, Courier New, monospace;
                    letter-spacing: 0.05em;
                    color: var(--primary);
                }

                .cta.active::before,
                .cta:hover:before {
                    width: 100%;
                    background: var(--secondary);
                }

                .cta:active {
                    transform: scale(0.95);
                }
            `}</style>
        </>
    );
}
