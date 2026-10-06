import type { Plugin } from "vite";
import {
  ALL_SEO_PATHS,
  PUBLIC_PATHS,
  getPageMetadata,
  normalizePath,
  siteOrigin,
  structuredData,
} from "../src/lib/seo";

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ]!,
  );
export function renderSeoHtml(
  html: string,
  path: string,
  origin: string,
): string {
  const page = getPageMetadata(path);
  const url = new URL(path, origin).href;
  const image = `${origin}/social-card.png`;
  const schema = JSON.stringify(structuredData(path, origin)).replace(
    /</g,
    "\\u003c",
  );
  const names = [
    "description",
    "robots",
    "twitter:card",
    "twitter:title",
    "twitter:description",
    "twitter:image",
  ];
  const properties = [
    "og:title",
    "og:description",
    "og:url",
    "og:image",
    "og:image:width",
    "og:image:height",
    "og:image:alt",
    "og:site_name",
    "og:type",
  ];
  let result = html.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeHtml(page.title)}</title>`,
  );
  result = result
    .replace(/<meta\b[^>]*>/gi, (tag) => {
      const name = /\bname=["']([^"']+)["']/i.exec(tag)?.[1];
      const property = /\bproperty=["']([^"']+)["']/i.exec(tag)?.[1];
      return (name && names.includes(name)) ||
        (property && properties.includes(property))
        ? ""
        : tag;
    })
    .replace(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi, "")
    .replace(
      /<script\b[^>]*id=["']gameset-schema["'][^>]*>[\s\S]*?<\/script>/gi,
      "",
    );
  const meta = (attribute: string, key: string, value: string) =>
    `<meta ${attribute}="${key}" content="${escapeHtml(value)}" />`;
  const head = [
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    meta("name", "description", page.description),
    meta("name", "robots", page.index ? "index, follow" : "noindex, follow"),
    meta("property", "og:site_name", "GAMESET"),
    meta("property", "og:type", "website"),
    meta("property", "og:title", page.title),
    meta("property", "og:description", page.description),
    meta("property", "og:url", url),
    meta("property", "og:image", image),
    meta("property", "og:image:width", "1200"),
    meta("property", "og:image:height", "630"),
    meta(
      "property",
      "og:image:alt",
      "GAMESET: FPS sensitivity and gaming tools built for players",
    ),
    meta("name", "twitter:card", "summary_large_image"),
    meta("name", "twitter:title", page.title),
    meta("name", "twitter:description", page.description),
    meta("name", "twitter:image", image),
    `<script type="application/ld+json" id="gameset-schema">${schema}</script>`,
  ].join("\n  ");
  return result.replace("</head>", `  ${head}\n</head>`);
}
export function seoAssets(siteUrl?: string): Plugin {
  const origin = siteOrigin(siteUrl);
  return {
    name: "gameset-seo-assets",
    enforce: "post",
    configurePreviewServer(server) {
      server.middlewares.use((request, _response, next) => {
        const url = new URL(request.url || "/", "http://localhost");
        const path = normalizePath(url.pathname);
        if (
          (request.method === "GET" || request.method === "HEAD") &&
          path !== "/" &&
          ALL_SEO_PATHS.includes(path)
        ) {
          request.url = `${path}/index.html${url.search}`;
        }
        next();
      });
    },
    transformIndexHtml(html) {
      return renderSeoHtml(html, "/", origin);
    },
    generateBundle(_, bundle) {
      const entry = bundle["index.html"];
      if (!entry || entry.type !== "asset")
        throw new Error("GameSet SEO: built index.html was not found.");
      const shell = String(entry.source);
      for (const path of ALL_SEO_PATHS.filter((path) => path !== "/"))
        this.emitFile({
          type: "asset",
          fileName: `${path.slice(1)}/index.html`,
          source: renderSeoHtml(shell, path, origin),
        });
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${PUBLIC_PATHS.map((path) => `  <url><loc>${escapeHtml(new URL(path, origin).href)}</loc></url>`).join("\n")}\n</urlset>\n`,
      });
      // Do not disallow private routes: crawlers must be able to read their noindex directive.
      this.emitFile({
        type: "asset",
        fileName: "_redirects",
        source: `${ALL_SEO_PATHS.filter((path) => path !== "/")
          .map((path) => `${path} ${path}/index.html 200`)
          .join("\n")}\n/* /index.html 200\n`,
      });
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`,
      });
    },
  };
}
