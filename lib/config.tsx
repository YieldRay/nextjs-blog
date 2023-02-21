export const name = "YieldRay";

export const siteTitle = "YieldRay's blog";

// this is for <meta name="description" ...>
export const description = "A personal website using Next.js";

// this can also be a url
export const profileImage = "/images/profile.png";

export const introduction = (
    // this only shows at index page
    <>
        <p>A blog powered by next.js</p>
    </>
);

export const pages = [
    // this is for navigation
    ["Home", "/"],
    ["Archives", "/archives"],
    ["Tags", "/tags"],
];
