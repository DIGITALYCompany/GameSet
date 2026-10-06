import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { useState, useRef, useEffect, useCallback } from "react";
import { RotateCcw, ArrowLeft, Zap, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/Card";
import { SessionControls } from "@/components/ui/SessionControls";
import { useSessionShortcuts } from "@/hooks/useSessionShortcuts";
import { cn } from "@/utils/cn";
import { playHitSound } from "@/utils/sound";

type TestState = "idle" | "waiting" | "ready" | "result" | "tooEarly";

const TEST_ROUNDS = 5;
const MIN_WAIT = 1500;
const MAX_WAIT = 4000;

export function ReactionTimeTestPage() {
  const [state, setState] = useState<TestState>("idle");
  const [results, setResults] = useState<number[]>([]);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const startTimeRef = useRef(0);

  useEffect(() => {
    const saved = localStorage.getItem("reaction-best");
    if (saved) setBestTime(parseInt(saved, 10));
  }, []);

  const startTest = useCallback(() => {
    setState("waiting");
    const wait = MIN_WAIT + Math.random() * (MAX_WAIT - MIN_WAIT);
    timeoutRef.current = setTimeout(() => {
      setState("ready");
      startTimeRef.current = performance.now();
    }, wait);
  }, []);

  const handleClick = () => {
    if (state === "idle" || state === "result") {
      setResults([]);
      startTest();
      return;
    }
    if (state === "tooEarly") {
      startTest();
      return;
    }

    if (state === "waiting") {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setState("tooEarly");
      return;
    }

    if (state === "ready") {
      const elapsed = Math.round(performance.now() - startTimeRef.current);
      playHitSound();
      const newResults = [...results, elapsed];
      setResults(newResults);

      if (newResults.length >= TEST_ROUNDS) {
        const best = Math.min(...newResults);
        if (bestTime === null || best < bestTime) {
          setBestTime(best);
          localStorage.setItem("reaction-best", String(best));
        }
        setState("result");
      } else {
        setState("waiting");
        const wait = MIN_WAIT + Math.random() * (MAX_WAIT - MIN_WAIT);
        timeoutRef.current = setTimeout(() => {
          setState("ready");
          startTimeRef.current = performance.now();
        }, wait);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const resetTest = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setResults([]);
    setState("idle");
  };

  const inSeries =
    state === "waiting" ||
    state === "ready" ||
    (state === "tooEarly" && results.length > 0);

  useSessionShortcuts({ running: false, paused: inSeries, onReset: resetTest });

  const avg =
    results.length > 0
      ? Math.round(results.reduce((a, b) => a + b, 0) / results.length)
      : null;
  const progress = results.length;
  const isComplete = state === "result" && results.length >= TEST_ROUNDS;

  const getRating = (ms: number) => {
    if (ms < 200) return { label: "Lightning", color: "text-accent-green" };
    if (ms < 250) return { label: "Excellent", color: "text-accent-cyan" };
    if (ms < 300) return { label: "Good", color: "text-accent-purple" };
    if (ms < 400) return { label: "Average", color: "text-ink" };
    return { label: "Slow", color: "text-ink-muted" };
  };

  return (
    <Layout>
      <ToolWorkspace toolId="reaction-time-test" status={state}>
        {/* Stats bar */}
        <div className="mb-4 grid grid-cols-3 gap-3">
          <StatBox
            label="Round"
            value={`${Math.min(progress + (state === "ready" || state === "waiting" ? 1 : 0), TEST_ROUNDS)} / ${TEST_ROUNDS}`}
          />
          <StatBox
            label="Average"
            value={avg !== null ? `${avg}ms` : "N/A"}
            accent
          />
          <StatBox
            label="Best"
            value={bestTime !== null ? `${bestTime}ms` : "N/A"}
          />
        </div>

        {/* Test area */}
        <Card noPadding className="overflow-hidden">
          <button
            type="button"
            onClick={handleClick}
            className={cn(
              "reaction-stage flex h-[300px] w-full flex-col items-center justify-center gap-3 transition-colors duration-100 focus-ring",
              state === "waiting" && "bg-base-surface-3 cursor-pointer",
              state === "ready" && "bg-accent-green/15 cursor-pointer",
              state === "tooEarly" && "bg-accent-red/10 cursor-pointer",
              (state === "idle" || state === "result") &&
                "bg-base-surface-2 cursor-pointer",
            )}
          >
            {state === "idle" && (
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent-purple/15 to-accent-magenta/10">
                  <Zap className="h-7 w-7 text-accent-purple" />
                </div>
                <p className="font-display text-lg font-semibold text-ink">
                  Click to start
                </p>
                <p className="text-sm text-ink-muted">
                  Wait for green, then click as fast as you can
                </p>
              </>
            )}

            {state === "waiting" && (
              <>
                <div className="h-14 w-14 rounded-full border-2 border-ink-dim border-t-accent-purple animate-spin" />
                <p className="font-display text-lg font-semibold text-ink">
                  Wait for it...
                </p>
                <p className="text-sm text-ink-muted">Don't click yet</p>
              </>
            )}

            {state === "ready" && (
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-green/20">
                  <Zap className="h-7 w-7 text-accent-green" />
                </div>
                <p className="font-display text-3xl font-bold text-accent-green">
                  CLICK!
                </p>
              </>
            )}

            {state === "tooEarly" && (
              <>
                <p className="font-display text-xl font-bold text-accent-red">
                  Too early!
                </p>
                <p className="text-sm text-ink-muted">Click to try again</p>
              </>
            )}

            {state === "result" && isComplete && (
              <div className="text-center animate-pop">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent-orange/15 to-accent-magenta/10">
                  <Trophy className="h-7 w-7 text-accent-orange" />
                </div>
                <p className="mt-3 font-display text-3xl font-bold text-gradient">
                  {avg}ms
                </p>
                <p className="mt-1 text-sm text-ink-muted">
                  Average over {TEST_ROUNDS} rounds
                </p>
                {bestTime !== null && (
                  <p className="mt-0.5 text-xs text-ink-dim">
                    Best: {bestTime}ms
                  </p>
                )}
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {results.map((r, i) => {
                    const rating = getRating(r);
                    return (
                      <span
                        key={i}
                        className={cn(
                          "rounded-lg border border-border bg-base-surface px-2.5 py-1 font-mono text-xs font-bold",
                          rating.color,
                        )}
                      >
                        {r}ms
                      </span>
                    );
                  })}
                </div>
                <div className="mt-5">
                  <span className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-base-bg">
                    <RotateCcw className="h-4 w-4" />
                    Click to test again
                  </span>
                </div>
              </div>
            )}
          </button>
        </Card>

        {/* Progress dots */}
        {inSeries && (
          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="flex gap-2">
              {Array.from({ length: TEST_ROUNDS }).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-2 w-2 rounded-full transition-colors",
                    i < progress
                      ? "bg-accent-purple"
                      : i === progress
                        ? "bg-accent-purple/50"
                        : "bg-base-surface-3",
                  )}
                />
              ))}
            </div>
            <SessionControls onReset={resetTest} />
          </div>
        )}

        <div className="mt-6 rounded-xl border border-border bg-base-surface-2 p-4 shadow-card">
          <p className="text-sm leading-relaxed text-ink-muted">
            <span className="font-semibold text-ink">How it works:</span> Wait
            for the screen to turn green, then click as fast as possible. The
            average human reaction time is 250ms. Pro gamers can hit under
            150ms.
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
          accent ? "text-accent-purple" : "text-ink",
        )}
      >
        {value}
      </p>
    </div>
  );
}
