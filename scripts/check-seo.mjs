import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const dist = join(process.cwd(), "dist");
const sitemap = readFileSync(join(dist, "sitemap.xml"), "utf8");
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
  match[1].replaceAll("&amp;", "&"),
);
assert(
  locations.length >= 20,
  "The sitemap must contain public game and tool pages.",
);
const origin = new URL(locations[0]).origin;
const readPage = (path) =>
  readFileSync(
    join(dist, path === "/" ? "index.html" : `${path.slice(1)}/index.html`),
    "utf8",
  );
const titles = new Set();
for (const location of locations) {
  const url = new URL(location);
  assert.equal(url.origin, origin);
  assert(
    !["/account", "/auth", "/settings", "/history"].includes(url.pathname),
  );
  const html = readPage(url.pathname);
  const title = /<title>([^<]+)<\/title>/.exec(html)?.[1];
  assert(title, `Missing title: ${url.pathname}`);
  assert(!titles.has(title), `Duplicate title: ${title}`);
  titles.add(title);
  assert.equal((html.match(/<link rel="canonical"/g) || []).length, 1);
  assert(
    html.includes(`href="${location}"`),
    `Wrong canonical: ${url.pathname}`,
  );
  assert.equal((html.match(/<meta name="description"/g) || []).length, 1);
  assert(html.includes('content="index, follow"'));
  assert(html.includes(`${origin}/social-card.png`));
  const json =
    /<script type="application\/ld\+json" id="gameset-schema">([\s\S]*?)<\/script>/.exec(
      html,
    )?.[1];
  const graph = JSON.parse(json)["@graph"];
  assert(
    graph.some(
      (item) =>
        item["@type"] === "WebSite" &&
        item.name === "GAMESET" &&
        item.url === `${origin}/`,
    ),
  );
  if (url.pathname !== "/")
    assert(graph.some((item) => item["@type"] === "BreadcrumbList"));
}
for (const path of ["/account", "/auth", "/history", "/settings"])
  assert(
    readPage(path).includes('content="noindex, follow"'),
    `Private page must be noindex: ${path}`,
  );
const robots = readFileSync(join(dist, "robots.txt"), "utf8");
assert(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
assert(
  !robots.includes("Disallow: /account"),
  "Allow crawlers to read noindex directives.",
);
assert(existsSync(join(dist, "social-card.png")));
assert(existsSync(join(dist, "gameset-logo.png")));
console.log(
  `SEO checks passed: ${locations.length} public pages, private noindex pages, canonical URLs, structured data and social assets.`,
);
