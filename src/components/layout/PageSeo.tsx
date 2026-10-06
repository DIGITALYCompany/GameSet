import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  getPageMetadata,
  normalizePath,
  siteOrigin,
  structuredData,
} from "@/lib/seo";

export function PageSeo() {
  const { pathname } = useLocation();
  useEffect(() => {
    const path = normalizePath(pathname);
    const page = getPageMetadata(path);
    const origin = siteOrigin(import.meta.env.VITE_SITE_URL);
    const canonical = new URL(path, origin).href;
    document.title = page.title;
    const meta = (
      attribute: "name" | "property",
      key: string,
      content: string,
    ) => {
      let element = document.head.querySelector<HTMLMetaElement>(
        `meta[${attribute}="${key}"]`,
      );
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.content = content;
    };
    meta("name", "description", page.description);
    meta("name", "robots", page.index ? "index, follow" : "noindex, follow");
    meta("property", "og:title", page.title);
    meta("property", "og:description", page.description);
    meta("property", "og:url", canonical);
    meta("property", "og:site_name", "GAMESET");
    meta("property", "og:type", "website");
    meta("property", "og:image", `${origin}/social-card.png`);
    meta("name", "twitter:title", page.title);
    meta("name", "twitter:description", page.description);
    meta("name", "twitter:image", `${origin}/social-card.png`);
    let link = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;
    let schema =
      document.head.querySelector<HTMLScriptElement>("#gameset-schema");
    if (!schema) {
      schema = document.createElement("script");
      schema.id = "gameset-schema";
      schema.type = "application/ld+json";
      document.head.appendChild(schema);
    }
    schema.textContent = JSON.stringify(structuredData(path, origin));
  }, [pathname]);
  return null;
}
