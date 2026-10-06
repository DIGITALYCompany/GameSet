import { GAME_ASSETS } from "@/data/gameAssets";
import { GameSettingsLab } from "@/components/games/GameSettingsLab";
import { PROSETTINGS_LINKS, PLAYER_REFERENCES } from "@/data/proSettings";
import { GameIcon } from "@/components/games/GameIcon";
import { ToolArtwork } from '@/components/ui/ToolArtwork';
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Crosshair,
  Repeat,
  Target,
  Radar,
  Plus,
  ArrowUpRight,
  Bookmark,
  ExternalLink,
  ArrowRight,
  Heart,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { AuthModal } from "@/components/auth/AuthModal";

import { Button } from "@/components/ui/Button";
import { getGameBySlug } from "@/data/games";
import { saveSelectedGame } from "@/lib/storage";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useEffect, useState, useCallback } from "react";
import { cn } from "@/utils/cn";

export function GamePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const game = slug ? getGameBySlug(slug) : undefined;

  const [followed, setFollowed] = useState(false);
  const [followedLoading, setFollowedLoading] = useState(false);
  const [followError, setFollowError] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);

  const checkFollowed = useCallback(async () => {
    if (!user || !game) {
      setFollowed(false);
      return;
    }
    const { data } = await supabase
      .from("user_games")
      .select("game_id")
      .eq("user_id", user.id)
      .eq("game_id", game.id)
      .maybeSingle();
    setFollowed(!!data);
  }, [user, game]);

  useEffect(() => {
    checkFollowed();
  }, [checkFollowed]);

  if (!game) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
          <h1 className="font-display text-3xl font-bold text-ink">
            Game not found
          </h1>
          <p className="mt-2 text-ink-muted">
            This game doesn't exist in our database.
          </p>
          <Link to="/games" className="mt-6 inline-block">
            <Button variant="secondary">
              <ArrowLeft className="h-4 w-4" />
              Browse all games
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleFollow = async () => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    setFollowedLoading(true);
    setFollowError(null);
    const { error } = followed
      ? await supabase
          .from("user_games")
          .delete()
          .eq("user_id", user.id)
          .eq("game_id", game.id)
      : await supabase.from("user_games").insert({ game_id: game.id });
    setFollowedLoading(false);
    if (error) {
      setFollowError(
        error.message.includes("follow_limit_reached")
          ? "Free plan is limited to 3 games. Unfollow one or upgrade."
          : "Could not update. Please try again.",
      );
      return;
    }
    setFollowed(!followed);
  };

  const handleQuickStart = () => {
    saveSelectedGame(game.id);
    navigate(`/sensitivity?game=${game.id}`);
  };

  const gameTools = [
    {
      icon: Crosshair,
      label: "Sensitivity Finder",
      desc: "Find your starting point",
      route: "/sensitivity",
    },
    {
      icon: Repeat,
      label: "Sensitivity Converter",
      desc: "Carry your feel between games",
      route: "/tools/sensitivity-converter",
    },
    {
      icon: Plus,
      label: "Crosshair Studio",
      desc: "Build a clear point of focus",
      route: "/tools/crosshair-generator",
    },
    {
      icon: Target,
      label: "Flick Trainer",
      desc: "Warm up with a quick drill",
      route: "/tools/aim-trainer",
    },
    {
      icon: Radar,
      label: "Tracking Trainer",
      desc: "Work on smooth movement",
      route: "/tools/tracking-trainer",
    },
  ];
  const source = PROSETTINGS_LINKS[game.id];
  const references = PLAYER_REFERENCES[game.id] || [];
  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-10">
        <Link
          to="/games"
          className="mb-5 inline-flex items-center gap-2 rounded text-xs text-ink-muted hover:text-ink focus-ring"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All games
        </Link>
        <section className="relative isolate overflow-hidden rounded-2xl border border-white/10 bg-base-surface">
          <img
            src={GAME_ASSETS[game.id].artwork}
            alt=""
            className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover object-right opacity-70"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-[#10111bf5] via-[#10111bcc] to-[#10111b40]"
          />
          <div className="p-5 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <GameIcon gameId={game.id} size="lg" />
                <div className="min-w-0">
                  <p
                    className="font-mono text-[10px] uppercase tracking-[.18em]"
                    style={{ color: game.color }}
                  >
                    {game.genre} / GAMESET GAME HUB
                  </p>
                  <h1 className="mt-2 break-words font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
                    {game.name}
                  </h1>
                </div>
              </div>
              <button
                type="button"
                onClick={handleFollow}
                disabled={followedLoading}
                className="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg border border-white/20 bg-black/40 px-4 py-2.5 text-xs font-semibold text-ink backdrop-blur-sm hover:bg-black/60 focus-ring disabled:opacity-40"
              >
                <Heart
                  className={cn(
                    "h-4 w-4",
                    followed && "fill-current text-accent-purple-light",
                  )}
                />
                {followed ? "Following" : "Follow game"}
              </button>
            </div>
            {followError && (
              <p role="alert" className="mt-3 text-xs text-accent-red">
                {followError}
              </p>
            )}
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-ink-muted">
              {game.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleQuickStart}
                className="arena-primary focus-ring"
              >
                <Crosshair className="h-4 w-4" />
                Find my sensitivity
                <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                to={`/setup?game=${game.id}`}
                className="arena-secondary bg-black/30 focus-ring"
              >
                <Bookmark className="h-4 w-4" />
                My {game.id === "cod" ? "Warzone" : game.name} setup
              </Link>
            </div>
          </div>
          <div className="relative grid grid-cols-2 border-t border-white/10 bg-[#10111be6] sm:grid-cols-4">
            <GameFact label="Sensitivity scale" value={game.sensDisplay} />
            <GameFact
              label="Example starting sens"
              value={String(game.defaultSens) + (game.sensUnit || "")}
            />
            <GameFact label="Conversion" value="Match cm/360" />
            <GameFact
              label="FOV adjustment"
              value={game.hasFov ? "Supported" : "Fixed in GameSet"}
            />
          </div>
        </section>
        <section className="mt-8" aria-label="Tools for this game">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-semibold text-ink">
              Your next move
            </h2>
            <Link
              to="/tools"
              className="inline-flex items-center gap-1 rounded text-xs text-ink-muted hover:text-ink focus-ring"
            >
              All tools
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {gameTools.map(({ icon: Icon, label, desc, route }, index) => (
              <Link
                key={route}
                to={
                  [
                    "/sensitivity",
                    "/tools/sensitivity-converter",
                    "/tools/crosshair-generator",
                  ].includes(route)
                    ? `${route}?game=${game.id}`
                    : route
                }
                className={cn('next-move-card group relative flex flex-col overflow-hidden rounded-xl border border-white/10 p-4 transition-all duration-300 focus-ring', index >= 3 ? 'tool-tone-aim' : index === 1 ? 'tool-tone-performance' : index === 2 ? 'next-move-design' : 'tool-tone-sensitivity')}
              >
                <div className="flex items-center justify-between">
                  <span className="next-move-icon"><Icon className="h-4 w-4" /></span>
                  <span className="font-mono text-[9px] tracking-wider text-ink-muted">0{index + 1}</span>
                </div>
                <ToolArtwork id={index === 0 ? 'sensitivity-finder' : route.split('/').pop()!} />
                <p className="next-move-category">{index >= 3 ? 'WARM UP' : index === 2 ? 'PERSONALIZE' : 'CALIBRATE'}</p>
                <p className="mt-1 text-sm font-semibold text-ink">{label}</p>
                <p className="mt-2 flex-1 text-[11px] leading-relaxed text-ink-muted">
                  {desc}
                </p>
                <span className="next-move-action mt-4 inline-flex items-center justify-between border-t border-white/[0.08] pt-3 text-[10px] font-medium">{index === 0 ? 'Find my sensitivity' : index >= 3 ? 'Start training' : 'Open tool'}<ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
              </Link>
            ))}
          </div>
        </section>
        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <GameSettingsLab key={game.id} game={game} />
          <aside className="space-y-5">
            <section className="rounded-2xl border border-white/10 bg-base-surface p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="eyebrow">PLAYER REFERENCES</p>
                <ExternalLink className="h-4 w-4 text-ink-muted" />
              </div>
              <h2 className="mt-3 font-display text-xl font-semibold text-ink">
                Explore how others play
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                Browse player profiles on ProSettings, then enter the settings
                you want to compare in the lab.
              </p>
              {!!references.length && (
                <ul className="mt-4 grid gap-2">
                  {references.map((player) => (
                    <li key={player.url}>
                      <a
                        href={player.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-lg border border-white/[0.08] bg-black/15 px-4 py-3 text-sm font-medium text-ink hover:border-accent-purple/30 focus-ring"
                      >
                        {player.name}
                        <ArrowUpRight className="h-3.5 w-3.5 text-ink-muted" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              {source ? (
                <a
                  href={source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="arena-secondary mt-4 w-full focus-ring"
                >
                  Explore {game.id === "cod" ? "Warzone" : game.name} on
                  ProSettings
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                </a>
              ) : (
                <p className="mt-4 rounded-lg border border-white/[0.08] bg-black/15 p-3 text-xs leading-relaxed text-ink-muted">
                  Have settings from a player or your own notes? Enter them in
                  the comparison lab to try them at your DPI.
                </p>
              )}
              <p className="mt-4 text-[10px] leading-relaxed text-ink-muted">
                External reference links. GameSet is independent from
                ProSettings. Check the source profile for its current settings.
              </p>
            </section>
            <section className="rounded-2xl border border-white/10 bg-base-surface p-5 sm:p-6">
              <GameIcon gameId={game.id} size="sm" />
              <h2 className="mt-3 font-display text-lg font-semibold text-ink">
                Your own settings matter.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                A player profile is inspiration. Test the feel in your game,
                keep your DPI consistent and save the settings that work for
                you.
              </p>
              <Link
                to={`/setup?game=${game.id}`}
                className="mt-4 inline-flex items-center gap-2 rounded text-xs font-medium text-accent-purple-light focus-ring"
              >
                Keep my game loadout
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </section>
          </aside>
        </div>
      </div>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </Layout>
  );
}
function GameFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-r border-white/[0.06] p-4 sm:px-6">
      <p className="font-mono text-[9px] uppercase tracking-wider text-ink-muted">
        {label}
      </p>
      <p className="mt-2 font-mono text-xs font-medium text-ink">{value}</p>
    </div>
  );
}
