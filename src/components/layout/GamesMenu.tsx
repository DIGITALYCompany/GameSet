import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Crosshair,
  Repeat,
  Plus,
} from "lucide-react";
import { GAMES } from "@/data/games";
import { GAME_ASSETS } from "@/data/gameAssets";
import { GameIcon } from "@/components/games/GameIcon";
import type { GameId } from "@/types";
import { cn } from "@/utils/cn";

export function GamesMenu() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const [previewId, setPreviewId] = useState<GameId>("valorant");
  const selected = GAMES.find((game) => game.id === previewId)!;
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();
  const cancelClose = () => clearTimeout(closeTimer.current);
  const showMenu = () => {
    cancelClose();
    if (!open) {
      setPreviewId(GAMES.find(game => pathname === `/games/${game.slug}`)?.id || 'valorant');
      setOpen(true);
    }
  };
  useEffect(() => () => clearTimeout(closeTimer.current), []);
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  const toggle = () => {
    if (!open)
      setPreviewId(
        GAMES.find((game) => pathname === `/games/${game.slug}`)?.id ||
          "valorant",
      );
    setOpen((value) => !value);
  };
  return (
    <div
      ref={container}
      onPointerEnter={event => { if (event.pointerType === 'mouse') showMenu(); }}
      onPointerLeave={event => {
        if (event.pointerType !== 'mouse') return;
        cancelClose();
        closeTimer.current = setTimeout(() => setOpen(false), 250);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls="games-navigation-panel"
        onClick={toggle}
        className={cn(
          "relative inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors focus-ring",
          pathname.startsWith("/games") || open
            ? "text-ink"
            : "text-ink-muted hover:text-ink",
        )}
      >
        Games
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform",
            open && "rotate-180",
          )}
        />
        {pathname.startsWith("/games") && (
          <span className="absolute inset-x-3 bottom-0 h-px bg-accent-purple-light" />
        )}
      </button>
      {open && (
        <div
          id="games-navigation-panel"
          className="games-megamenu absolute inset-x-0 top-full z-50 mt-3 overflow-hidden rounded-2xl border border-white/10 bg-[#11111b] shadow-[0_24px_70px_rgba(0,0,0,0.65)]"
        >
          <div className="grid grid-cols-[1.25fr_1fr] lg:grid-cols-[1.65fr_1fr]">
            <div className="p-5 lg:p-6">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="eyebrow">CHOOSE YOUR ARENA</p>
                  <p className="mt-2 text-xs text-ink-muted">
                    Your game. Your settings. Your next level.
                  </p>
                </div>
                <span className="rounded-md border border-white/10 px-2 py-1 font-mono text-[9px] text-ink-muted">
                  {GAMES.length} GAMES
                </span>
              </div>
              <ul className="grid grid-cols-2 gap-1.5">
                {GAMES.map((game) => (
                  <li key={game.id}>
                    <Link
                      to={`/games/${game.slug}`}
                      title={game.name}
                      onMouseEnter={() => setPreviewId(game.id)}
                      onFocus={() => setPreviewId(game.id)}
                      aria-current={
                        pathname === `/games/${game.slug}` ? "page" : undefined
                      }
                      className={cn(
                        "group flex items-center gap-3 rounded-xl border px-3 py-3 transition-colors focus-ring",
                        previewId === game.id
                          ? "border-white/10 bg-white/[0.05]"
                          : "border-transparent hover:bg-white/[0.04]",
                      )}
                    >
                      <GameIcon gameId={game.id} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-semibold text-ink">
                          {game.name}
                        </span>
                        <span className="mt-1 block text-[10px] text-ink-muted">
                          {game.genre}
                        </span>
                      </span>
                      <ArrowUpRight
                        className={cn(
                          "hidden h-3.5 w-3.5 shrink-0 lg:block",
                          previewId === game.id
                            ? "text-accent-purple-light"
                            : "text-ink-muted/40",
                        )}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/[0.08] pt-4">
                <span className="hidden text-[10px] text-ink-muted lg:block">
                  Built for your next session.
                </span>
                <Link
                  to="/games"
                  className="inline-flex items-center gap-2 rounded text-xs font-semibold text-accent-purple-light hover:text-ink focus-ring"
                >
                  See all games
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
            <div className="flex min-w-0 flex-col border-l border-white/[0.08] bg-black/20">
              <div
                className="relative h-[190px] overflow-hidden lg:h-[210px]"
                style={{ backgroundColor: `${selected.color}15` }}
              >
                <img
                  key={selected.id}
                  src={GAME_ASSETS[selected.id].artwork}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#101019] via-transparent to-black/10" />
                <span className="absolute left-5 top-4 rounded-md border border-white/20 bg-black/50 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-white backdrop-blur-sm">
                  {selected.genre}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5 pt-2 lg:p-6 lg:pt-2">
                <div className="flex h-12 items-center gap-3">
                  <GameIcon gameId={selected.id} className="h-9 w-9" />
                  <h2 className="line-clamp-2 font-display text-xl font-semibold tracking-tight text-ink">
                    {selected.name}
                  </h2>
                </div>
                <p className="mt-3 h-10 line-clamp-2 text-xs leading-relaxed text-ink-muted">
                  {selected.tagline}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-[10px] text-ink-muted">
                  {[
                    { icon: Crosshair, label: "Sensitivity" },
                    { icon: Repeat, label: "Conversion" },
                    { icon: Plus, label: "Crosshair" },
                  ].map(({ icon: Icon, label }) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.02] px-2 py-1.5"
                    >
                      <Icon className="h-3 w-3" />
                      {label}
                    </span>
                  ))}
                </div>
                <Link
                  to={`/games/${selected.slug}`}
                  aria-label={`Explore ${selected.name}`}
                  className="arena-primary mt-5 w-full focus-ring"
                >
                  Explore game
                  <ArrowUpRight className="h-4 w-4 shrink-0" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
