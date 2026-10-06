import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  RotateCcw,
  ArrowLeft,
  Crosshair,
  Trophy,
  Zap,
  Cloud,
} from "lucide-react";
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
import { playHitSound } from "@/utils/sound";

type GameState = "idle" | "playing" | "paused" | "finished";

interface Target2 {
  id: number;
  x: number;
  y: number;
  size: number;
}

const ARENA_PADDING = 20;
const TARGET_SIZE = 44;
const GAME_DURATION = 30;

export function AimTrainerPage() {
  const { user } = useAuth();
  const [gameState, setGameState] = useState<GameState>("idle");
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [target, setTarget] = useState<Target2 | null>(null);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [synced, setSynced] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const arenaRef = useRef<HTMLDivElement>(null);
  const targetIdRef = useRef(0);
  const startTimeRef = useRef(0);
  const elapsedBeforeRef = useRef(0);
  const finalStatsRef = useRef({ hits: 0, misses: 0, accuracy: 0 });
  const completedRef = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem("aim-trainer-best");
    if (saved) setBestScore(parseInt(saved, 10));
  }, []);

  const spawnTarget = useCallback(() => {
    const arena = arenaRef.current;
    if (!arena) return;
    const rect = arena.getBoundingClientRect();
    const maxX = rect.width - TARGET_SIZE - ARENA_PADDING;
    const maxY = rect.height - TARGET_SIZE - ARENA_PADDING;
    const x = ARENA_PADDING + Math.random() * Math.max(0, maxX - ARENA_PADDING);
    const y = ARENA_PADDING + Math.random() * Math.max(0, maxY - ARENA_PADDING);
    targetIdRef.current += 1;
    setTarget({ id: targetIdRef.current, x, y, size: TARGET_SIZE });
  }, []);

  const startGame = () => {
    completedRef.current = false;
    setHits(0);
    setMisses(0);
    setTimeLeft(GAME_DURATION);
    setSynced(false);
    setGameState("playing");
    elapsedBeforeRef.current = 0;
    startTimeRef.current = Date.now();
    setTimeout(spawnTarget, 100);
  };

  const pauseGame = () => {
    if (gameState !== "playing") return;
    elapsedBeforeRef.current += (Date.now() - startTimeRef.current) / 1000;
    setGameState("paused");
  };

  const resumeGame = () => {
    if (gameState !== "paused") return;
    startTimeRef.current = Date.now();
    setGameState("playing");
  };

  const resetGame = () => {
    setHits(0);
    setMisses(0);
    setTarget(null);
    setTimeLeft(GAME_DURATION);
    elapsedBeforeRef.current = 0;
    setGameState("idle");
  };

  useSessionShortcuts({
    running: gameState === "playing",
    paused: gameState === "paused",
    onPause: pauseGame,
    onResume: resumeGame,
    onReset: resetGame,
  });

  useEffect(() => {
    if (gameState !== "playing") return;
    const interval = setInterval(() => {
      const elapsed =
        elapsedBeforeRef.current + (Date.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, GAME_DURATION - elapsed);
      setTimeLeft(remaining);
      if (remaining <= 0) {
        setGameState("finished");
        setTarget(null);
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [gameState]);

  const finalHits = hits;
  const finalMisses = misses;
  const finalAccuracy =
    finalHits + finalMisses > 0
      ? Math.round((finalHits / (finalHits + finalMisses)) * 100)
      : 0;

  useEffect(() => {
    if (gameState === "finished" && !completedRef.current) {
      completedRef.current = true;
      finalStatsRef.current = {
        hits: finalHits,
        misses: finalMisses,
        accuracy: finalAccuracy,
      };
      if (bestScore === null || finalHits > bestScore) {
        setBestScore(finalHits);
        localStorage.setItem("aim-trainer-best", String(finalHits));
      }
      // Auto-sync to Supabase if logged in
      if (user && finalHits > 0) {
        setSyncing(true);
        (async () => {
          try {
            const { error } = await supabase
              .from("aim_training_scores")
              .insert({
                game_mode: "flick",
                score: finalHits,
                accuracy: finalAccuracy,
                duration_seconds: GAME_DURATION,
              });
            if (!error) setSynced(true);
          } catch {
            // ignore sync errors
          } finally {
            setSyncing(false);
          }
        })();
      } else {
        setSynced(false);
      }
    }
  }, [gameState, finalHits, finalMisses, finalAccuracy, bestScore, user]);

  const handleArenaClick = (e: React.MouseEvent<HTMLElement>) => {
    if (gameState !== "playing" || !target) {
      if (gameState === "playing") setMisses((m) => m + 1);
      return;
    }
    const arena = arenaRef.current;
    if (!arena) return;
    const rect = arena.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const targetCenterX = target.x + target.size / 2;
    const targetCenterY = target.y + target.size / 2;
    const dist = Math.hypot(clickX - targetCenterX, clickY - targetCenterY);
    if (dist <= target.size / 2) {
      setHits((h) => h + 1);
      playHitSound();
      spawnTarget();
    } else {
      setMisses((m) => m + 1);
    }
  };

  const accuracy =
    hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 0;

  return (
    <Layout>
      <ToolWorkspace toolId="aim-trainer" status={gameState}>
        {(gameState === "playing" || gameState === "paused") && (
          <SessionControls
            className="mb-3 justify-end"
            paused={gameState === "paused"}
            onTogglePause={gameState === "paused" ? resumeGame : pauseGame}
            onReset={resetGame}
          />
        )}

        {/* Stats bar */}
        <div className="mb-4 grid grid-cols-4 gap-3">
          <StatBox
            label="Time"
            value={
              gameState === "playing" || gameState === "paused"
                ? timeLeft.toFixed(1) + "s"
                : `${GAME_DURATION}s`
            }
          />
          <StatBox label="Hits" value={String(hits)} accent />
          <StatBox label="Accuracy" value={`${accuracy}%`} />
          <StatBox
            label="Best"
            value={bestScore !== null ? String(bestScore) : "N/A"}
          />
        </div>

        {/* Arena */}
        <Card noPadding className="relative overflow-hidden">
          <div
            ref={arenaRef}
            onClick={handleArenaClick}
            className={cn(
              "training-stage relative h-[400px] w-full select-none",
              gameState === "playing" ? "cursor-crosshair" : "cursor-default",
            )}
          >
            {gameState === "idle" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-accent-green/15 to-accent-magenta/10">
                  <Crosshair className="h-8 w-8 text-accent-green" />
                </div>
                <div>
                  <p className="font-display text-lg font-semibold text-ink">
                    Ready to start?
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">
                    Click targets as fast as you can.
                  </p>
                </div>
                <Button variant="primary" size="lg" onClick={startGame}>
                  <Zap className="h-5 w-5" />
                  Start Game
                </Button>
              </div>
            )}

            {gameState === "playing" && target && (
              <button
                key={target.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleArenaClick(e);
                }}
                className="absolute rounded-full border-2 border-accent-green bg-accent-green/20 transition-transform duration-100 hover:scale-110 focus-ring"
                style={{
                  left: target.x,
                  top: target.y,
                  width: target.size,
                  height: target.size,
                }}
                aria-label="Target"
              >
                <span className="absolute inset-2 rounded-full border border-accent-green/50" />
                <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-green" />
              </button>
            )}

            {gameState === "paused" && (
              <PausedOverlay onResume={resumeGame} onReset={resetGame} />
            )}

            {gameState === "finished" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center animate-fade-in">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-accent-green/15 to-accent-magenta/10">
                  <Trophy className="h-8 w-8 text-accent-orange" />
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-ink">
                    {hits} hits
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">
                    {accuracy}% accuracy · {misses} misses
                    {bestScore === hits && hits > 0 && " · New best!"}
                  </p>
                  {user && (
                    <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-accent-green">
                      {syncing ? (
                        <>
                          <Cloud className="h-3 w-3 animate-pulse" /> Syncing...
                        </>
                      ) : synced ? (
                        <>
                          <Cloud className="h-3 w-3" /> Synced to your account
                        </>
                      ) : null}
                    </p>
                  )}
                </div>
                <Button variant="primary" size="lg" onClick={startGame}>
                  <RotateCcw className="h-5 w-5" />
                  Play Again
                </Button>
              </div>
            )}
          </div>
        </Card>

        <div className="mt-6 rounded-xl border border-border bg-base-surface-2 p-4 shadow-card">
          <p className="text-sm leading-relaxed text-ink-muted">
            <span className="font-semibold text-ink">How it works:</span> Click
            the green targets as quickly as you can. Misses count against your
            accuracy. Press P or Esc to pause, R to restart. The run pauses on
            its own if you switch windows.
          </p>
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
      <p className="text-xs font-medium uppercase tracking-wider text-ink-dim">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 font-mono text-lg font-bold",
          accent ? "text-accent-green" : "text-ink",
        )}
      >
        {value}
      </p>
    </div>
  );
}
