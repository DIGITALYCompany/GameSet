# GameSet

FPS toolkit built with React, TypeScript, Vite and Tailwind CSS.

## Local development

```sh
npm ci
npm run dev
```

The tools and local sensitivity history work without a backend. For accounts and
cloud storage, copy `.env.example` to `.env` and set your Supabase project URL and
public anonymous key. Never put service-role credentials in Vite environment variables.

```sh
npm run typecheck
npm run lint
npm run build
npm run check:seo
```

`package-lock.json` is the canonical dependency lockfile; use npm for this project.

## Integrated features

- GameSet's responsive interface, searchable tools and game catalog.
- Sensitivity finder with keyboard shortcuts, equal-value choice and optional floating window.
- Sensitivity converter plus the original standalone eDPI and cm/360 calculators.
- Crosshair studio with previews and game-specific exports.
- Flick trainer, tracking trainer, reaction test and browser polling-rate estimate.
- Local history and settings, account profile, followed games and cloud training scores.
- My Setup inside the account: game loadouts, crosshair settings, notes and favorite tools.
- Public `/setup` introduces account benefits; signed-in visitors continue to `/account?tab=setup` with imported settings preserved.
- Premium plan presentation; paid checkout is not implemented.

Existing `gameset:tests`, `gameset:settings` and `gameset:selectedGame` storage keys
are preserved. The original `/settings` and calculator URLs remain available.

## Supabase

The five SQL migrations in `supabase/migrations` describe profiles, cloud tests,
followed games, training scores, private player workspaces and access restrictions. Review the target
database's existing schema and migration history before applying missing migrations
in timestamp order. No remote database changes are performed by the local build.

Subscription fields are writable only on the server. A future payment integration
must update them using trusted server credentials. Paid plans remain marked as
coming soon.

## Search appearance and sharing

The official origin is `https://gameset.tech`, configurable through `VITE_SITE_URL`.
The build generates per-route metadata, canonical URLs, structured data, a sitemap,
robots directives and HTML routing rules. A branded sharing image and accessible
Games dropdown are included. See [docs/SEO.md](docs/SEO.md) for hosting requirements
and the Google Search Console steps after deployment.

The previous archive's Supabase configuration has been removed. The user's
GameSet project will be connected separately. Use `VITE_SUPABASE_URL` and
`VITE_SUPABASE_PUBLISHABLE_KEY` (or the legacy `VITE_SUPABASE_ANON_KEY`).
Setup/favorites require an account; public tools remain accessible without one.
Account/setup browser flows were checked with a mocked backend, not the remote database.

## Validation and remaining work

The merged version passes TypeScript checking, ESLint and a production build.
Browser checks covered 19 public pages, mobile layouts, calculator output,
sensitivity results and local history, settings persistence, tool search,
crosshair export and training interactions. Authenticated cloud workflows still
need validation against the target Supabase database.

Compatible dependency updates reduced npm audit findings from 33 to 9
(3 moderate, 6 high). Remaining findings include Vite/esbuild and Tailwind's
dependency tree; major upgrades require a separate build-tool migration and
regression check before deployment.
