import { GameIcon } from "@/components/games/GameIcon";
import { GAMES } from "@/data/games";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { getPageMetadata, normalizePath } from "@/lib/seo";

export function PageBreadcrumbs() {
  const { pathname } = useLocation();
  const path = normalizePath(pathname);
  const page = getPageMetadata(path);
  const game = GAMES.find((item) => path === `/games/${item.slug}`);
  if (path === "/" || !page.index) return null;
  const parent = path.startsWith("/games/")
    ? { path: "/games", label: "Games" }
    : path.startsWith("/tools/")
      ? { path: "/tools", label: "Tools" }
      : null;
  return (
    <nav
      aria-label="Breadcrumb"
      className="mx-auto max-w-6xl px-4 pt-6 sm:px-6"
    >
      <ol className="flex flex-wrap items-center gap-2 text-[11px] text-ink-muted">
        <li>
          <Link to="/" className="rounded hover:text-ink focus-ring">
            GAMESET
          </Link>
        </li>
        {parent && (
          <>
            <li aria-hidden="true">
              <ChevronRight className="h-3 w-3" />
            </li>
            <li>
              <Link
                to={parent.path}
                className="rounded hover:text-ink focus-ring"
              >
                {parent.label}
              </Link>
            </li>
          </>
        )}
        <li aria-hidden="true">
          <ChevronRight className="h-3 w-3" />
        </li>
        <li
          aria-current="page"
          className="inline-flex items-center gap-2 text-ink"
        >
          {game && <GameIcon gameId={game.id} size="xs" />}
          {page.label}
        </li>
      </ol>
    </nav>
  );
}
