import { Link } from "react-router-dom";
import { ArrowRight, Crosshair, ShieldCheck, Zap } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { LandingSections } from "@/components/landing/LandingSections";
import { AimLabPreview } from "@/components/landing/AimLabPreview";
import { QuickAccess } from '@/components/landing/QuickAccess';
import { getAvailableTools } from "@/data/tools";
import { GAMES } from "@/data/games";

export function LandingPage() {
  return (
    <Layout>
      <section className="arena-hero relative overflow-hidden">
        <div className="hero-orbit" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-16 lg:pb-20 lg:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
            <div className="relative z-10 animate-slide-up">
              <p className="eyebrow flex items-center gap-2">
                <span className="status-dot" /> YOUR NEXT LEVEL STARTS HERE
              </p>
              <h1 className="hero-title mt-6 font-display font-bold text-ink">
                Your aim.
                <br />
                Your settings.
                <br />
                <span className="hero-gradient">Your advantage.</span>
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-ink-muted sm:text-lg">
                Stop guessing. Find the sensitivity that clicks, build your
                crosshair and put your aim to the test.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/sensitivity" className="arena-primary focus-ring">
                  <Crosshair className="h-4 w-4" /> Find my sensitivity{" "}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/tools" className="arena-secondary focus-ring">
                  Explore the toolkit <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink-muted">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent-green" /> No
                  account needed
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-accent-green" /> Runs in your
                  browser
                </span>
              </div>
              <div className="hero-stats mt-9 grid max-w-md grid-cols-3">
                {[
                  {
                    value: String(getAvailableTools().length).padStart(2, "0"),
                    label: "FREE TOOLS",
                  },
                  {
                    value: String(GAMES.length).padStart(2, "0"),
                    label: "FPS GAMES",
                  },
                  { value: "01", label: "PLACE TO LEVEL UP" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <span className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                      {stat.value}
                      <span className="text-accent-purple-light">.</span>
                    </span>
                    <p className="mt-1 font-mono text-[9px] tracking-wider text-ink-muted">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <AimLabPreview />
          </div>
        </div>
        <div className="game-ribbon relative border-y border-white/[0.08]">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-3 px-4 py-5 sm:justify-between sm:px-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
              One toolkit. Every arena.
            </span>
            {GAMES.slice(0, 5).map((game) => (
              <Link
                key={game.id}
                to={`/games/${game.slug}`}
                className="rounded font-display text-xs font-semibold uppercase tracking-wider text-ink-muted transition-colors hover:text-ink focus-ring"
              >
                {game.id === "cod"
                  ? "WARZONE"
                  : game.id === "r6"
                    ? "RAINBOW SIX"
                    : game.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <QuickAccess />
      <LandingSections />
    </Layout>
  );
}
