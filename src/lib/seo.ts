import { GAMES } from "../data/games";
import { TOOLS } from "../data/tools";

export const DEFAULT_SITE_URL = "https://gameset.tech";
export const HOME_TITLE =
  "GAMESET | FPS Sensitivity & Gaming Tools Built for Players";
export const HOME_DESCRIPTION =
  "Find your perfect FPS sensitivity with GAMESET. Calibrate your mouse sensitivity, optimize your aim and access gaming tools built for players.";
export interface PageMetadata {
  title: string;
  description: string;
  label: string;
  index: boolean;
}
const PAGES: Record<string, PageMetadata> = {
  "/": {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    label: "Home",
    index: true,
  },
  "/games": {
    title: "FPS Game Settings & Sensitivity Tools | GAMESET",
    description:
      "Explore supported FPS games. Find sensitivity settings, cm/360 conversion and crosshair tools for Valorant, CS2, Apex Legends and more.",
    label: "Games",
    index: true,
  },
  "/tools": {
    title: "Free FPS Sensitivity, Aim & Mouse Tools | GAMESET",
    description:
      "Find your sensitivity, convert between games, design crosshairs and train flicks, tracking and reactions with free browser tools.",
    label: "Tools",
    index: true,
  },
  "/setup": {
    title: "My Setup: Your Personal Gaming Loadout | GAMESET",
    description:
      "Create a GameSet account to keep your game sensitivities, DPI, crosshairs, personal notes and favorite tools together.",
    label: "Setup",
    index: true,
  },
  "/pricing": {
    title: "Free Tools & Upcoming Premium Plans | GAMESET",
    description:
      "Explore GameSet free tools and upcoming Pro and Elite plans. Paid plans are not available yet.",
    label: "Plans",
    index: true,
  },
  "/about": {
    title: "About GAMESET: Gaming Tools Built for Players",
    description:
      "Learn about GameSet and its browser tools for FPS sensitivity calibration, aim training and personal game settings.",
    label: "About",
    index: true,
  },
  "/privacy": {
    title: "Privacy Policy | GAMESET",
    description:
      "Read how GameSet handles account information, locally saved settings and cloud data.",
    label: "Privacy",
    index: true,
  },
  "/terms": {
    title: "Terms of Service | GAMESET",
    description:
      "Read the terms of service for using GameSet gaming tools and account services.",
    label: "Terms",
    index: true,
  },
  "/account": {
    title: "My Account | GAMESET",
    description:
      "Manage your GameSet account, game setups, favorites and history.",
    label: "Account",
    index: false,
  },
  "/history": {
    title: "My Sensitivity History | GAMESET",
    description: "Review your saved sensitivity test results.",
    label: "History",
    index: false,
  },
  "/settings": {
    title: "My Preferences | GAMESET",
    description: "Manage local GameSet preferences.",
    label: "Settings",
    index: false,
  },
  "/auth/callback": {
    title: "Completing Sign In | GAMESET",
    description: "Complete your GameSet sign-in.",
    label: "Sign in",
    index: false,
  },
  "/auth/reset-password": {
    title: "Reset Password | GAMESET",
    description: "Choose a new password for your GameSet account.",
    label: "Reset password",
    index: false,
  },
  "/auth": {
    title: "Sign In | GAMESET",
    description: "Sign in to your GameSet account.",
    label: "Sign in",
    index: false,
  },
};
export function normalizePath(path: string): string {
  return path === "/" ? "/" : path.replace(/\/+$/, "");
}
export function siteOrigin(value: string | undefined): string {
  const url = new URL(value || DEFAULT_SITE_URL);
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  )
    throw new Error(
      "VITE_SITE_URL must be an HTTPS site origin without credentials, path, query or hash.",
    );
  return url.origin;
}
export function getPageMetadata(pathname: string): PageMetadata {
  const path = normalizePath(pathname);
  if (PAGES[path]) return PAGES[path];
  const game = GAMES.find((item) => path === `/games/${item.slug}`);
  if (game)
    return {
      title: `${game.name} Sensitivity, Settings & Crosshair Tools | GAMESET`,
      description: `Explore ${game.name} sensitivity settings, mouse DPI, cm/360 conversion and crosshair options. Find the tools for your ${game.name} setup.`,
      label: game.name,
      index: true,
    };
  const tool = TOOLS.find((item) => path === item.route);
  if (tool)
    return {
      title: `${tool.name}: Free Browser Tool | GAMESET`,
      description: `${tool.description} Use the GameSet ${tool.name.toLowerCase()} in your browser.`,
      label: tool.name,
      index: true,
    };
  return {
    title: "Page Not Found | GAMESET",
    description: "Explore GameSet FPS gaming tools.",
    label: "Page not found",
    index: false,
  };
}
// The finder is a top-level tool route, not a /tools child.
PAGES["/sensitivity"] = {
  title: "FPS Sensitivity Finder: Calibrate Your Aim | GAMESET",
  description:
    "Find a comfortable FPS sensitivity with progressive in-game comparisons. Enter your DPI, test both values and save your sensitivity result.",
  label: "Sensitivity Finder",
  index: true,
};
export const PUBLIC_PATHS = [
  ...new Set([
    ...Object.keys(PAGES).filter((path) => PAGES[path].index),
    ...GAMES.map((game) => `/games/${game.slug}`),
    ...TOOLS.filter((tool) => tool.status === "available").map(
      (tool) => tool.route,
    ),
  ]),
];
export const ALL_SEO_PATHS = [
  ...new Set([...Object.keys(PAGES), ...PUBLIC_PATHS]),
];
export function structuredData(path: string, origin: string) {
  const page = getPageMetadata(path);
  const url = new URL(normalizePath(path), origin).href;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebSite",
      "@id": `${origin}/#website`,
      name: "GAMESET",
      alternateName: "GameSet",
      url: `${origin}/`,
      inLanguage: "en",
      publisher: { "@id": `${origin}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${origin}/#organization`,
      name: "GAMESET",
      url: `${origin}/`,
      logo: `${origin}/gameset-logo.png`,
    },
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: page.title,
      description: page.description,
      inLanguage: "en",
      isPartOf: { "@id": `${origin}/#website` },
    },
  ];
  if (path !== "/" && page.index) {
    const crumbs = [
      { "@type": "ListItem", position: 1, name: "GAMESET", item: `${origin}/` },
    ];
    if (path.startsWith("/games/"))
      crumbs.push({
        "@type": "ListItem",
        position: 2,
        name: "Games",
        item: `${origin}/games`,
      });
    if (path.startsWith("/tools/"))
      crumbs.push({
        "@type": "ListItem",
        position: 2,
        name: "Tools",
        item: `${origin}/tools`,
      });
    crumbs.push({
      "@type": "ListItem",
      position: crumbs.length + 1,
      name: page.label,
      item: url,
    });
    graph.push({ "@type": "BreadcrumbList", itemListElement: crumbs });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}
