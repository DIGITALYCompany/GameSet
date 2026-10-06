import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, RotateCcw, MousePointer2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

const STANDARD_RATES = [125, 250, 500, 1000, 2000, 4000, 8000];
const SAMPLE_SIZE = 48;
const MAX_GAP_MS = 40;
const HISTORY_LENGTH = 60;

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function nearestStandard(hz: number): number {
  return STANDARD_RATES.reduce((best, r) =>
    Math.abs(Math.log(r / hz)) < Math.abs(Math.log(best / hz)) ? r : best,
  );
}

export function PollingRateTestPage() {
  const [current, setCurrent] = useState(0);
  const [peak, setPeak] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [moving, setMoving] = useState(false);

  const padRef = useRef<HTMLDivElement>(null);
  const intervalsRef = useRef<number[]>([]);
  const lastStampRef = useRef<number | null>(null);
  const lastMoveRef = useRef(0);

  useEffect(() => {
    const pad = padRef.current;
    if (!pad) return;

    const record = (stamp: number) => {
      const prev = lastStampRef.current;
      lastStampRef.current = stamp;
      if (prev === null) return;
      const gap = stamp - prev;
      if (gap <= 0 || gap > MAX_GAP_MS) return;
      const list = intervalsRef.current;
      list.push(gap);
      if (list.length > SAMPLE_SIZE) list.shift();
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const events =
        typeof e.getCoalescedEvents === "function"
          ? e.getCoalescedEvents()
          : [];
      if (events.length > 0) events.forEach((ce) => record(ce.timeStamp));
      else record(e.timeStamp);
      lastMoveRef.current = performance.now();
    };

    pad.addEventListener("pointermove", onMove);

    const sampler = window.setInterval(() => {
      const active = performance.now() - lastMoveRef.current < 150;
      setMoving(active);
      if (!active || intervalsRef.current.length < 12) return;
      const hz = Math.round(1000 / median(intervalsRef.current));
      setCurrent(hz);
      setPeak((p) => Math.max(p, hz));
      setHistory((h) => [...h.slice(-(HISTORY_LENGTH - 1)), hz]);
    }, 100);

    return () => {
      pad.removeEventListener("pointermove", onMove);
      window.clearInterval(sampler);
    };
  }, []);

  const reset = () => {
    intervalsRef.current = [];
    lastStampRef.current = null;
    setCurrent(0);
    setPeak(0);
    setHistory([]);
  };

  const average =
    history.length > 0
      ? Math.round(history.reduce((s, v) => s + v, 0) / history.length)
      : 0;
  const detected = average > 0 ? nearestStandard(average) : null;
  const stability = history.length > 4 ? stabilityPct(history) : null;
  const chartMax = Math.max(1100, peak * 1.1);

  return (
    <Layout>
      <ToolWorkspace toolId="polling-rate-test">
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatBox
            label="Live"
            value={current ? `${current} Hz` : "N/A"}
            accent
          />
          <StatBox label="Average" value={average ? `${average} Hz` : "N/A"} />
          <StatBox label="Peak" value={peak ? `${peak} Hz` : "N/A"} />
          <StatBox
            label="Stability"
            value={stability !== null ? `${stability}%` : "N/A"}
          />
        </div>

        <Card noPadding className="overflow-hidden">
          <div
            ref={padRef}
            className="training-stage relative flex h-[320px] w-full cursor-crosshair select-none items-center justify-center"
          >
            <div className="pointer-events-none text-center">
              <div
                className={cn(
                  "mx-auto flex h-16 w-16 items-center justify-center rounded-full border transition-all duration-300",
                  moving
                    ? "scale-110 border-accent-green/50 bg-accent-green/10 shadow-[0_0_40px_rgba(34,197,94,0.3)]"
                    : "border-border bg-base-surface-2",
                )}
              >
                <MousePointer2
                  className={cn(
                    "h-7 w-7",
                    moving ? "text-accent-green" : "text-ink-dim",
                  )}
                />
              </div>
              <p className="mt-4 font-mono text-5xl font-bold text-ink">
                {current || "0"}
                <span className="ml-1 text-xl text-ink-dim">Hz</span>
              </p>
              <p className="mt-2 text-sm text-ink-muted">
                {moving
                  ? "Measuring... keep moving"
                  : "Move your mouse quickly here"}
              </p>
            </div>
          </div>

          <div className="border-t border-border p-4">
            <div className="flex h-20 items-end gap-[2px]" aria-hidden="true">
              {Array.from({ length: HISTORY_LENGTH }).map((_, i) => {
                const value = history[i - (HISTORY_LENGTH - history.length)];
                return (
                  <div
                    key={i}
                    className={cn(
                      "flex-1 rounded-t-sm transition-[height] duration-150",
                      value
                        ? "bg-gradient-to-t from-accent-purple/40 to-accent-purple"
                        : "bg-base-surface-3",
                    )}
                    style={{
                      height: value
                        ? `${Math.max(4, (value / chartMax) * 100)}%`
                        : "4%",
                    }}
                  />
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-ink-dim">Last 6 seconds of readings</p>
              <Button variant="ghost" size="sm" onClick={reset}>
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        </Card>

        {detected && (
          <div className="mt-6 animate-fade-in rounded-xl border border-accent-purple/25 bg-accent-purple/5 p-5 shadow-card">
            <p className="text-xs font-medium uppercase tracking-wider text-ink-dim">
              Detected setting
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-ink">
              Likely {detected >= 1000 ? `${detected / 1000}K` : detected} Hz
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              {verdictFor(detected)}
            </p>
          </div>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Tip
            title="What to expect"
            text="Most gaming mice run at 1000 Hz. Readings within about 10% of the target are normal."
          />
          <Tip
            title="Reading low?"
            text="Check your mouse software, use a direct USB port on your PC, and avoid USB hubs."
          />
          <Tip
            title="Browser limits"
            text="Some browsers and screens cap readings. If you see exactly your monitor's refresh rate, try Chrome or Edge."
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

function stabilityPct(values: number[]): number {
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const variance =
    values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
  const cv = Math.sqrt(variance) / mean;
  return Math.max(0, Math.round((1 - cv) * 100));
}

function verdictFor(rate: number): string {
  if (rate >= 2000)
    return "High-end polling. Ultra-smooth input, ideal for competitive play.";
  if (rate >= 1000)
    return "The competitive standard. This is what most pro players use.";
  if (rate >= 500)
    return "Playable, but switching to 1000 Hz in your mouse software will feel more responsive.";
  return "Low polling rate. Your mouse may be in power-saving mode or on a slow port. Raise it to 1000 Hz.";
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
