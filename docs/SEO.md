# SEO and navigation

GameSet uses `https://gameset.tech` as its canonical origin. To change it, set
`VITE_SITE_URL` before building. Keep the same origin for the production host and
choose one HTTPS version (apex or www); redirect the other to it.

## What the build produces

- Unique titles, descriptions, canonical URLs and sharing tags for each public route.
- Route-specific HTML files with metadata already in their response, before JavaScript runs.
- `WebSite`, `Organization`, `WebPage` and public breadcrumb JSON-LD.
- A `sitemap.xml` with 25 public pages and a `robots.txt` pointing to it.
- `noindex, follow` metadata on account, history, settings and auth pages.
- The branded 1200 × 630 `social-card.png`, authored in `design/social-card.html`.
- A `_redirects` file mapping known routes to their HTML files before the SPA fallback.

Page content is still rendered by React in the browser. This change does not
provide full server rendering. Keep scripts, styles and public assets accessible
to crawlers. Personal data is protected by authentication and Supabase policies;
robots directives are not access control.

```sh
npm run typecheck
npm run lint
npm run build
npm run check:seo
npm run preview
```

The Vite preview server serves the correct per-route HTML at the canonical paths.
On a host that supports `_redirects`, the generated file supplies those rules.
On other hosts, configure equivalent routing: `/games/valorant` must serve
`dist/games/valorant/index.html`, not the home page HTML. Serve existing assets
and sitemap/robots files directly; use the root HTML only for unknown SPA paths.
Do not replace every route with `/index.html` before trying the generated files.
Check raw page responses after deployment, not only the browser's rendered DOM.

## After publishing

1. Verify the domain property `gameset.tech` in Google Search Console using the DNS
   verification record supplied by Google.
2. Submit `https://gameset.tech/sitemap.xml` in Search Console.
3. Inspect the home page, Games, Tools and Setup URLs and request indexing.
4. Check page indexing and whether Google can render the JavaScript content.
5. Check link previews using the deployed public URLs; social services may cache old previews.

Google generates sitelinks automatically from the site's structure. Neither
JSON-LD nor a sitemap guarantees the exact links or appearance from a reference
screenshot. Keep navigation, headings and link names descriptive and consistent.

References:
- https://developers.google.com/search/docs/appearance/sitelinks
- https://developers.google.com/search/docs/appearance/site-names
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://support.google.com/webmasters/answer/9008080

## Games menu

The desktop Games disclosure spans the navbar width, shows the eight supported
games with local logos, and includes an artwork preview that changes on hover or
keyboard focus. Asset sources are recorded in `public/games/sources.json`.
It opens on click, works with keyboard focus, closes on Escape/outside click,
and restores focus after Escape. Mobile navigation links directly to the game
catalog rather than placing a wide panel on a small screen.
