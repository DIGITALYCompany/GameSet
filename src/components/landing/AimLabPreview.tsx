import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Crosshair, RotateCcw, Target, Plus } from "lucide-react";
import { SensitivityFinderEngine } from "@/lib/sensitivityFinderEngine";
import { cn } from "@/utils/cn";

type Mode = "calibrate" | "train" | "design";
const MODES = [
  { id: "calibrate" as const, label: "Calibrate", icon: Crosshair },
  { id: "train" as const, label: "Train", icon: Target },
  { id: "design" as const, label: "Design", icon: Plus },
];
const POSITIONS = [
  [26, 37],
  [72, 61],
  [63, 29],
  [34, 68],
  [51, 44],
  [79, 39],
];

export function AimLabPreview() {
  const [mode, setMode] = useState<Mode>("calibrate");
  const engine = useRef(new SensitivityFinderEngine(0.4, 3));
  const [finder, setFinder] = useState(() => engine.current.getState());
  const [hits, setHits] = useState(0);
  const [preset, setPreset] = useState(0);
  const choose = (choice: "low" | "high") => {
    if (choice === "low") engine.current.selectLower();
    else engine.current.selectHigher();
    setFinder(engine.current.getState());
  };
  const reset = () => {
    engine.current = new SensitivityFinderEngine(0.4, 3);
    setFinder(engine.current.getState());
    setHits(0);
  };
  const route =
    mode === "calibrate"
      ? "/sensitivity"
      : mode === "train"
        ? "/tools/aim-trainer"
        : "/tools/crosshair-generator";
  return (
    <div className="aim-lab relative min-w-0 animate-slide-up">
      <div className="lab-frame">
        <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
          <div className="flex items-center gap-2">
            <Crosshair className="h-4 w-4 text-accent-purple-light" />
            <span className="font-mono text-[11px] font-semibold tracking-[0.16em] text-ink">
              GAMESET / AIM LAB
            </span>
          </div>
          <span className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest text-accent-green">
            <span className="status-dot" /> INTERACTIVE DEMO
          </span>
        </div>
        <div
          className="flex gap-1 border-b border-white/[0.06] px-4 py-3"
          aria-label="Choose a demo"
        >
          {MODES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id)}
              aria-pressed={mode === id}
              className={cn(
                "lab-tab focus-ring",
                mode === id && "lab-tab-active",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
        <div
          className={cn("lab-arena", mode === "design" && "lab-arena-design")}
        >
          <div className="lab-topline">
            <span>
              {mode === "calibrate"
                ? "SENSITIVITY CALIBRATION"
                : mode === "train"
                  ? "MINI FLICK DRILL"
                  : "CROSSHAIR PREVIEW"}
            </span>
            <span>
              {mode === "train"
                ? `${hits} HITS`
                : mode === "design"
                  ? ["CLASSIC", "DOT", "T-SHAPE"][preset]
                  : "VALORANT / 800 DPI"}
            </span>
          </div>
          <div className="lab-perspective" aria-hidden="true" />
          <div className="lab-ring lab-ring-outer" aria-hidden="true" />
          <div className="lab-ring lab-ring-inner" aria-hidden="true" />
          {mode === "train" ? (
            <button
              type="button"
              aria-label="Demo target"
              className="lab-target focus-ring"
              style={{
                left: `${POSITIONS[hits % POSITIONS.length][0]}%`,
                top: `${POSITIONS[hits % POSITIONS.length][1]}%`,
              }}
              onClick={() => setHits((value) => value + 1)}
            >
              <span />
              <span />
            </button>
          ) : (
            <svg
              className="lab-reticle"
              viewBox="0 0 100 100"
              aria-hidden="true"
              style={{ color: mode === "design" ? "#67f5ba" : "#c4a2ff" }}
            >
              {!(mode === "design" && preset === 1) && (
                <g stroke="currentColor" strokeWidth="3">
                  {!(mode === "design" && preset === 2) && (
                    <path d="M50 26v16" />
                  )}
                  <path d="M50 58v16M26 50h16M58 50h16" />
                </g>
              )}
              <circle
                cx="50"
                cy="50"
                r={mode === "design" && preset === 1 ? 3 : 1.5}
                fill="currentColor"
              />
            </svg>
          )}
          <div className="lab-bottomline">
            <span>X: 050 / Y: 050</span>
            <span>MAKE EVERY MOVEMENT COUNT</span>
          </div>
        </div>
        <div className="flex h-[228px] flex-col justify-center p-4 sm:p-5">
          {mode === "calibrate" ? (
            <>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs text-ink-muted">
                  {finder.phase === "result"
                    ? "Demo complete. Try it in your game next."
                    : "Try a choice. See the range narrow."}
                </span>
                <button
                  type="button"
                  aria-label="Restart calibration demo"
                  onClick={reset}
                  className="rounded p-1 text-ink-muted hover:text-ink focus-ring"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
              {finder.phase === "result" ? (
                <div role="status" className="demo-result">
                  <span className="eyebrow">DEMO RESULT</span>
                  <strong>{finder.result?.toFixed(3)}</strong>
                  <span className="text-xs text-ink-muted">
                    Your real result depends on how each value feels in-game.
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {(["low", "high"] as const).map((choice) => (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => choose(choice)}
                      className={cn(
                        "demo-choice focus-ring",
                        choice === "high" && "demo-choice-high",
                      )}
                    >
                      <span className="font-mono text-[10px] uppercase tracking-widest">
                        {choice}{" "}
                        <span className="ml-1 opacity-60">
                          / {choice === "low" ? "01" : "02"}
                        </span>
                      </span>
                      <strong className="mt-1 block font-mono text-3xl sm:text-4xl">
                        {(choice === "low"
                          ? finder.lower
                          : finder.higher
                        ).toFixed(3)}
                      </strong>
                      <span className="mt-2 block text-[11px] text-ink-muted">
                        Choose {choice === "low" ? "lower" : "higher"}{" "}
                        <ArrowUpRight className="inline h-3 w-3" />
                      </span>
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-4 flex items-center gap-2">
                {[1, 2, 3].map((step) => (
                  <span
                    key={step}
                    className={cn(
                      "h-1 flex-1 rounded-full",
                      step <= finder.round
                        ? "bg-accent-purple-light"
                        : "bg-white/10",
                    )}
                  />
                ))}
                <span className="ml-2 whitespace-nowrap font-mono text-[10px] text-ink-muted">
                  {finder.round} / 3
                </span>
              </div>
            </>
          ) : mode === "train" ? (
            <div className="flex h-full flex-col justify-center">
              <p className="font-display text-lg font-semibold text-ink">
                Got a quick flick?
              </p>
              <p className="mt-2 text-sm text-ink-muted">
                Click the target above. Every hit moves it.
              </p>
              <button
                type="button"
                onClick={() => setHits(0)}
                className="mt-4 inline-flex w-fit items-center gap-2 rounded text-xs text-accent-green focus-ring"
              >
                <RotateCcw className="h-3 w-3" /> Reset mini drill
              </button>
            </div>
          ) : (
            <div className="flex h-full flex-col justify-center">
              <p className="font-display text-lg font-semibold text-ink">
                Small detail. Personal feel.
              </p>
              <p className="mt-1 text-xs text-ink-muted">
                Pick a shape and make it yours in the studio.
              </p>
              <div className="mt-4 flex gap-2">
                {["Classic", "Dot", "T-shape"].map((name, i) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setPreset(i)}
                    aria-pressed={preset === i}
                    className={cn(
                      "lab-tab focus-ring",
                      preset === i && "lab-tab-active",
                    )}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <Link to={route} className="lab-launch focus-ring">
          <span>
            Open the full{" "}
            {mode === "calibrate"
              ? "sensitivity finder"
              : mode === "train"
                ? "flick trainer"
                : "crosshair studio"}
          </span>
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
      <p className="mt-4 text-center font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted">
        Your setup is personal. Your tools should be too.
      </p>
    </div>
  );
}
