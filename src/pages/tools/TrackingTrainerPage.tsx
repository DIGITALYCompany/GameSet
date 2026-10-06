import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { useState, useRef, useEffect } from "react";
import { Radar, RotateCcw, ArrowLeft, Trophy, Zap, Cloud } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import {
  SessionControls,
  PausedOverlay,
} from "@/components/ui/SessionControls";
import { useSessionShortcuts } from "@/hooks/useSessionShortcuts";
import { cn } from "@/utils/cn";

type GameState = "idle" | "playing" | "paused" | "finished";
type Difficulty = "easy" | "medium" | "hard";

const GAME_DURATION = 30;
const BEST_KEY = "tracking-trainer-best";

const DIFFICULTIES: Record<
  Difficulty,
  { label: string; speed: number; radius: number; turnMs: [number, number] }
> = {
  easy: { label: "Easy", speed: 220, radius: 34, turnMs: [700, 1400] },
  medium: { label: "Medium", speed: 360, radius: 28, turnMs: [450, 1000] },
  hard: { label: "Hard", speed: 520, radius: 22, turnMs: [250, 700] },
};

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

interface Sim {
  pos: { x: number; y: number };
  vel: { x: number; y: number };
  desired: { x: number; y: number };
  onMs: number;
  elapsedMs: number;
}

export function TrackingTrainerPage() {
  const { user } = useAuth();
  const [gameState, setGameState] = useState<GameState>("idle");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [onTargetPct, setOnTargetPct] = useState(0);
  const [isOnTarget, setIsOnTarget] = useState(false);
  const [best, setBest] = useState<Record<Difficulty, number>>({
    easy: 0,
    medium: 0,
    hard: 0,
  });
  const [syncState, setSyncState] = useState<
    "idle" | "syncing" | "synced" | "error"
  >("idle");

  const arenaRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);
  const targetRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const simRef = useRef<Sim | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(BEST_KEY);
      if (saved) setBest((prev) => ({ ...prev, ...JSON.parse(saved) }));
    } catch {
      localStorage.removeItem(BEST_KEY);
    }
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;
    const arena = arenaRef.current;
    const targetEl = targetRef.current;
    if (!arena || !targetEl) return;

    const cfg = DIFFICULTIES[difficulty];
    const { width, height } = arena.getBoundingClientRect();
    if (!simRef.current) {
      simRef.current = {
        pos: { x: width / 2, y: height / 2 },
        vel: { x: cfg.speed, y: 0 },
        desired: { x: cfg.speed, y: 0 },
        onMs: 0,
        elapsedMs: 0,
      };
    }
    const sim = simRef.current;
    const { pos, vel, desired } = sim;
    let nextTurn = 0;
    let last = performance.now();
    let lastUiUpdate = 0;
    let lastOn = false;
    let frame = 0;

    const pickDirection = (now: number) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = cfg.speed * randomBetween(0.6, 1.15);
      desired.x = Math.cos(angle) * speed;
      desired.y = Math.sin(angle) * speed * 0.55;
      nextTurn = now + randomBetween(cfg.turnMs[0], cfg.turnMs[1]);
    };

    const tick = (now: number) => {
      const dt = Math.min(50, now - last);
      last = now;
      sim.elapsedMs += dt;
      const { elapsedMs } = sim;

      if (now >= nextTurn) pickDirection(now);
      const steer = Math.min(1, dt / 120);
      vel.x += (desired.x - vel.x) * steer;
      vel.y += (desired.y - vel.y) * steer;

      pos.x += (vel.x * dt) / 1000;
      pos.y += (vel.y * dt) / 1000;
      const r = cfg.radius;
      if (pos.x < r || pos.x > width - r) {
        pos.x = Math.max(r, Math.min(width - r, pos.x));
        vel.x *= -1;
        desired.x *= -1;
      }
      if (pos.y < r || pos.y > height - r) {
        pos.y = Math.max(r, Math.min(height - r, pos.y));
        vel.y *= -1;
        desired.y *= -1;
      }
      targetEl.style.transform = `translate(${pos.x - r}px, ${pos.y - r}px)`;

      const m = mouseRef.current;
      const on = !!m && Math.hypot(m.x - pos.x, m.y - pos.y) <= r;
      if (on) sim.onMs += dt;
      const { onMs } = sim;
      if (on !== lastOn) {
        lastOn = on;
        setIsOnTarget(on);
      }

      if (now - lastUiUpdate > 100) {
        lastUiUpdate = now;
        setTimeLeft(Math.max(0, GAME_DURATION - elapsedMs / 1000));
        setOnTargetPct(elapsedMs > 0 ? (onMs / elapsedMs) * 100 : 0);
      }

      if (elapsedMs >= GAME_DURATION * 1000) {
        setTimeLeft(0);
        setOnTargetPct((onMs / elapsedMs) * 100);
        setIsOnTarget(false);
        setGameState("finished");
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    pickDirection(last);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [gameState, difficulty]);

  useEffect(() => {
    if (gameState !== "finished" || completedRef.current) return;
    completedRef.current = true;
    const pct = Math.round(onTargetPct * 10) / 10;
    setBest((prev) => {
      if (pct <= prev[difficulty]) return prev;
      const next = { ...prev, [difficulty]: pct };
      localStorage.setItem(BEST_KEY, JSON.stringify(next));
      return next;
    });

    if (!user) return;
    setSyncState("syncing");
    supabase
      .from("aim_training_scores")
      .insert({
        game_mode: "tracking",
        score: Math.round(pct * 10),
        accuracy: pct,
        duration_seconds: GAME_DURATION,
      })
      .then(({ error }) => setSyncState(error ? "error" : "synced"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  const startGame = () => {
    completedRef.current = false;
    simRef.current = null;
    setTimeLeft(GAME_DURATION);
    setOnTargetPct(0);
    setSyncState("idle");
    setGameState("playing");
  };

  const pauseGame = () => {
    if (gameState !== "playing") return;
    setIsOnTarget(false);
    setGameState("paused");
  };

  const resumeGame = () => {
    if (gameState === "paused") setGameState("playing");
  };

  const resetGame = () => {
    simRef.current = null;
    setTimeLeft(GAME_DURATION);
    setOnTargetPct(0);
    setIsOnTarget(false);
    setGameState("idle");
  };

  useSessionShortcuts({
    running: gameState === "playing",
    paused: gameState === "paused",
    onPause: pauseGame,
    onResume: resumeGame,
    onReset: resetGame,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const cfg = DIFFICULTIES[difficulty];
  const finalPct = Math.round(onTargetPct * 10) / 10;
  const isNewBest =
    gameState === "finished" && finalPct > 0 && finalPct >= best[difficulty];

  return (
    <Layout>
      <ToolWorkspace toolId="tracking-trainer" status={gameState}>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex rounded-xl border border-border bg-base-surface p-1 shadow-card">
            {(Object.keys(DIFFICULTIES) as Difficulty[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                disabled={gameState === "playing" || gameState === "paused"}
                aria-pressed={difficulty === d}
                className={cn(
                  "rounded-lg px-4 py-1.5 text-sm font-semibold transition-all duration-200 focus-ring disabled:cursor-not-allowed",
                  difficulty === d
                    ? "bg-accent-purple/15 text-accent-purple shadow-glow-sm"
                    : "text-ink-muted hover:text-ink",
                )}
              >
                {DIFFICULTIES[d].label}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            {(gameState === "playing" || gameState === "paused") && (
              <SessionControls
                paused={gameState === "paused"}
                onTogglePause={gameState === "paused" ? resumeGame : pauseGame}
                onReset={resetGame}
              />
            )}
            <div className="grid grid-cols-3 gap-3 sm:w-[360px]">
              <StatBox label="Time" value={`${timeLeft.toFixed(1)}s`} />
              <StatBox
                label="On target"
                value={`${onTargetPct.toFixed(1)}%`}
                accent
              />
              <StatBox
                label="Best"
                value={best[difficulty] > 0 ? `${best[difficulty]}%` : "N/A"}
              />
            </div>
          </div>
        </div>

        <Card noPadding className="relative overflow-hidden">
          <div
            ref={arenaRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {
              mouseRef.current = null;
            }}
            className={cn(
              "training-stage relative h-[440px] w-full select-none overflow-hidden",
              gameState === "playing" ? "cursor-crosshair" : "cursor-default",
            )}
          >
            {(gameState === "playing" || gameState === "paused") && (
              <div
                ref={targetRef}
                className={cn(
                  "pointer-events-none absolute left-0 top-0 rounded-full border-2 transition-[background-color,box-shadow,border-color] duration-100",
                  isOnTarget
                    ? "border-accent-green bg-accent-green/30 shadow-[0_0_30px_rgba(34,197,94,0.45)]"
                    : "border-accent-purple bg-accent-purple/20",
                )}
                style={{ width: cfg.radius * 2, height: cfg.radius * 2 }}
              >
                <span className="absolute inset-[30%] rounded-full border border-white/30" />
                <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
              </div>
            )}

            {gameState === "paused" && (
              <PausedOverlay onResume={resumeGame} onReset={resetGame} />
            )}

            {gameState === "idle" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-accent-purple/15 to-accent-magenta/10 shadow-glow-sm">
                  <Radar className="h-8 w-8 text-accent-purple" />
                </div>
                <div>
                  <p className="font-display text-lg font-semibold text-ink">
                    Stay on the target
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">
                    {GAME_DURATION} seconds · no clicking, just smooth tracking
                  </p>
                </div>
                <Button variant="primary" size="lg" onClick={startGame}>
                  <Zap className="h-5 w-5" />
                  Start Tracking
                </Button>
              </div>
            )}

            {gameState === "finished" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center animate-fade-in">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-accent-purple/15 to-accent-magenta/10">
                  <Trophy className="h-8 w-8 text-accent-orange" />
                </div>
                <div>
                  <p className="font-mono text-5xl font-bold text-gradient">
                    {finalPct}%
                  </p>
                  <p className="mt-2 text-sm text-ink-muted">
                    time on target · {cfg.label}
                    {isNewBest && (
                      <span className="font-semibold text-accent-orange">
                        {" "}
                        · New best!
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-xs text-ink-dim">
                    {ratingFor(finalPct)}
                  </p>
                  {user && syncState !== "idle" && (
                    <p
                      className={cn(
                        "mt-2 flex items-center justify-center gap-1.5 text-xs",
                        syncState === "error"
                          ? "text-accent-red"
                          : "text-accent-green",
                      )}
                    >
                      <Cloud
                        className={cn(
                          "h-3 w-3",
                          syncState === "syncing" && "animate-pulse",
                        )}
                      />
                      {syncState === "syncing" && "Syncing..."}
                      {syncState === "synced" && "Synced to your account"}
                      {syncState === "error" &&
                        "Could not sync. Saved on this device only"}
                    </p>
                  )}
                </div>
                <Button variant="primary" size="lg" onClick={startGame}>
                  <RotateCcw className="h-5 w-5" />
                  Go Again
                </Button>
              </div>
            )}
          </div>
        </Card>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Tip
            title="Lead with your arm"
            text="Large, smooth corrections come from the arm. Use your wrist for micro-adjustments."
          />
          <Tip
            title="Don't chase"
            text="React to direction changes, don't over-predict them. Overshooting costs more than lag."
          />
          <Tip
            title="Test your sens"
            text="If you overshoot a lot, your sensitivity may be too high for tracking."
          />
        </div>

        <div className="mt-8">
          <Link
            to="/tools"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to tools
          </Link>
        </div>
      </ToolWorkspace>
    </Layout>
  );
}

function ratingFor(pct: number): string {
  if (pct >= 75) return "Elite tracking. Pro-level consistency.";
  if (pct >= 60) return "Strong. Your tracking holds up in real fights.";
  if (pct >= 45) return "Solid. Work on reacting to direction changes.";
  return "Keep training. Focus on smooth, steady movement.";
}

function StatBox({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="tool-metric rounded-xl border border-border bg-base-surface p-3 text-center shadow-card">
      <p className="text-[11px] font-medium uppercase tracking-wider text-ink-dim">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 font-mono text-lg font-bold",
          accent ? "text-accent-purple" : "text-ink",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function Tip({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-border bg-base-surface-2 p-4 shadow-card">
      <p className="text-sm font-semibold text-ink">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-ink-muted">{text}</p>
    </div>
  );
}
