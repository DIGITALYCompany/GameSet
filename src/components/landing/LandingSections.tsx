import { GAME_ASSETS } from '@/data/gameAssets';
import { GameIcon } from "@/components/games/GameIcon";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Crosshair,
  Check,
  Timer,
  Sparkles,
} from "lucide-react";
import { ToolCard } from "@/components/ui/ToolCard";
import { getAvailableTools } from "@/data/tools";
import { GAMES } from "@/data/games";
import { SessionPlanner } from "./SessionPlanner";

const FEATURED = [
  "aim-trainer",
  "tracking-trainer",
  "crosshair-generator",
  "sensitivity-converter",
  "reaction-time-test",
  "polling-rate-test",
];

export function LandingSections() {
  const tools = getAvailableTools();
  return (
    <>
      <SessionPlanner />

      <section className="toolkit-section relative border-y border-white/[0.06]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">PICK YOUR NEXT MOVE / 02</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                A better setup starts here.
              </h2>
              <p className="mt-3 text-sm text-ink-muted">
                Small adjustments. Focused practice. Tools made for both.
              </p>
            </div>
            <Link to="/tools" className="arena-secondary focus-ring">
              All {tools.length} tools
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED.map((id) => {
              const tool = tools.find((t) => t.id === id);
              return tool && <ToolCard key={id} tool={tool} />;
            })}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-xl border border-white/[0.06] bg-black/20 px-5 py-4">
            <span className="text-xs text-ink-muted">Dial in the details</span>
            {tools
              .filter((t) =>
                ["edpi-calculator", "cm360-calculator"].includes(t.id),
              )
              .map((tool) => (
                <Link
                  key={tool.id}
                  to={tool.route}
                  className="inline-flex items-center gap-2 rounded text-xs font-medium text-ink transition-colors hover:text-accent-purple-light focus-ring"
                >
                  {tool.name}
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">CHOOSE YOUR ARENA / 03</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Different games. Your feel.
            </h2>
            <p className="mt-3 text-sm text-ink-muted">
              Game-specific settings, conversion and crosshair options.
            </p>
          </div>
          <Link to="/games" className="arena-secondary focus-ring">
            Explore games
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {GAMES.map((game, i) => (
            <Link
              key={game.id}
              to={`/games/${game.slug}`}
              className="arena-game group focus-ring"
              style={{ "--game-color": game.color } as React.CSSProperties}
            >
              <div className="game-card-cover relative isolate overflow-hidden" aria-hidden="true">
                <img src={GAME_ASSETS[game.id].artwork} alt="" loading="lazy" className="game-card-image absolute inset-0 z-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="game-card-shade pointer-events-none absolute -inset-px z-10" />
                <span className="arena-game-number">0{i + 1}</span>
                <GameIcon gameId={game.id} className="absolute left-4 top-9 z-20" />
                <Crosshair className="arena-game-crosshair" />
              </div>
              <div className="relative px-4 pb-4">
                <p className="font-mono text-[9px] uppercase tracking-wider text-ink-muted">
                  {game.genre}
                </p>
                <h3 className="mt-1 flex items-center justify-between gap-2 font-display text-sm font-semibold text-ink">
                  {game.name}
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-ink-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <div className="ready-panel relative overflow-hidden rounded-2xl border border-accent-purple/25 px-6 py-10 sm:p-12">
          <Crosshair className="ready-reticle" aria-hidden="true" />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="eyebrow">YOUR NEXT SESSION, UPGRADED.</p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Make your setup
                <br />
                <span className="hero-gradient">feel like home.</span>
              </h2>
              <p className="mt-4 flex items-center gap-2 text-sm text-ink-muted">
                <Timer className="h-4 w-4" /> A few minutes to find your
                starting point.
              </p>
            </div>
            <div className="flex flex-col items-start gap-4">
              <Link to="/sensitivity" className="arena-primary focus-ring">
                Find my sensitivity
                <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="flex items-center gap-2 text-xs text-ink-muted">
                <Check className="h-3.5 w-3.5 text-accent-green" /> Free. No
                download. Just you and your mouse.
              </span>
            </div>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-3 rounded-xl border border-white/[0.06] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-4 w-4 text-accent-purple-light" />
            <p className="text-xs text-ink-muted">
              Want to go further to {" "}
              <span className="text-ink">Pro & Elite are coming soon.</span>
            </p>
          </div>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 rounded text-xs text-ink-muted transition-colors hover:text-ink focus-ring"
          >
            Explore future plans
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </>
  );
}
