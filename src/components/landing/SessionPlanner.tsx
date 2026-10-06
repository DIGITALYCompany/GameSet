import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check, RotateCcw, Timer } from "lucide-react";
import { cn } from "@/utils/cn";

const ROUTINES = [
  {
    id: "setup",
    label: "New setup",
    time: "About 6 minutes",
    description:
      "Changed your mouse or picked up a new game? Start with a setup that feels right.",
    steps: [
      {
        label: "Find your sensitivity",
        detail: "Compare settings in your game.",
        route: "/sensitivity",
      },
      {
        label: "Carry it to another game",
        detail: "Match your mouse travel across titles.",
        route: "/tools/sensitivity-converter",
      },
      {
        label: "Make your crosshair",
        detail: "Build a clear point of focus.",
        route: "/tools/crosshair-generator",
      },
    ],
  },
  {
    id: "warmup",
    label: "Warm-up",
    time: "About 2 minutes",
    description:
      "A quick pre-game routine. Get moving, find your rhythm, then jump into a match.",
    steps: [
      {
        label: "Wake up your reflexes",
        detail: "Complete five reaction rounds.",
        route: "/tools/reaction-time-test",
      },
      {
        label: "Sharpen your flicks",
        detail: "Run one 30-second flick session.",
        route: "/tools/aim-trainer",
      },
      {
        label: "Stay on target",
        detail: "Finish one 30-second tracking session.",
        route: "/tools/tracking-trainer",
      },
    ],
  },
  {
    id: "mouse",
    label: "Mouse check",
    time: "About 2 minutes",
    description:
      "Know your settings before changing them. Check the basics of your mouse setup.",
    steps: [
      {
        label: "Check reported polling rate",
        detail: "Estimate mouse events in your browser.",
        route: "/tools/polling-rate-test",
      },
      {
        label: "Calculate your eDPI",
        detail: "Combine mouse DPI and sensitivity.",
        route: "/tools/edpi-calculator",
      },
      {
        label: "Measure your cm/360",
        detail: "Find your mouse travel for a full turn.",
        route: "/tools/cm360-calculator",
      },
    ],
  },
];
const STORAGE_KEY = "gameset:routines";
type Progress = Record<string, boolean[]>;
function restoreProgress(): Progress {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return Object.fromEntries(
      ROUTINES.map((routine) => [
        routine.id,
        routine.steps.map((_, index) => saved?.[routine.id]?.[index] === true),
      ]),
    );
  } catch {
    return {};
  }
}

export function SessionPlanner() {
  const [active, setActive] = useState("warmup");
  const [progress, setProgress] = useState<Progress>(restoreProgress);
  const routine = ROUTINES.find((item) => item.id === active)!;
  const completed = progress[active] || [false, false, false];
  const count = completed.filter(Boolean).length;
  const next = routine.steps.find((_, index) => !completed[index]);
  const persist = (updated: Progress) => {
    setProgress(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      /* Session still works without storage. */
    }
  };
  const toggle = (index: number) =>
    persist({
      ...progress,
      [active]: routine.steps.map((_, step) =>
        step === index ? !completed[step] : completed[step],
      ),
    });
  return (
    <section
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
      aria-labelledby="routine-heading"
    >
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">YOUR PRE-GAME ROUTINE / 01</p>
          <h2
            id="routine-heading"
            className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            Come in ready.
          </h2>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-ink-muted">
          Pick a goal. Follow three steps.
          <br />
          Keep your checklist on this device.
        </p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-base-surface/80">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] px-5 py-4 sm:px-6">
          <div
            className="flex flex-wrap gap-1"
            aria-label="Choose your routine"
          >
            {ROUTINES.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={item.id === active}
                onClick={() => setActive(item.id)}
                className={cn(
                  "lab-tab focus-ring",
                  item.id === active && "lab-tab-active",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          <span className="inline-flex items-center gap-2 font-mono text-[10px] text-ink-muted">
            <Timer className="h-3.5 w-3.5" />
            {routine.time}
          </span>
        </div>
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[.8fr_1.4fr] lg:gap-12">
          <div className="flex flex-col items-start">
            <p className="text-sm leading-relaxed text-ink-muted">
              {routine.description}
            </p>
            <p
              aria-live="polite"
              className="mt-5 font-mono text-xs text-accent-green"
            >
              {count === 3
                ? "CHECKLIST COMPLETE. GOOD LUCK IN YOUR NEXT GAME."
                : `${count} / 3 STEPS CHECKED`}
            </p>
            {next ? (
              <Link to={next.route} className="arena-primary mt-5 focus-ring">
                {count ? "Continue routine" : "Start routine"}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() =>
                  persist({ ...progress, [active]: [false, false, false] })
                }
                className="arena-secondary mt-5 focus-ring"
              >
                <RotateCcw className="h-4 w-4" />
                Start again
              </button>
            )}
            <p className="mt-4 text-[11px] leading-relaxed text-ink-muted">
              Mark each step when you finish. Your checklist is saved locally.
            </p>
          </div>
          <ol className="grid gap-2">
            {routine.steps.map((step, index) => (
              <li
                key={step.route}
                className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-black/20 px-3 py-3 sm:px-4"
              >
                <button
                  type="button"
                  aria-label={`Mark ${step.label} ${completed[index] ? "incomplete" : "complete"}`}
                  aria-pressed={completed[index]}
                  onClick={() => toggle(index)}
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border font-mono text-xs transition-colors focus-ring",
                    completed[index]
                      ? "border-accent-green/40 bg-accent-green/10 text-accent-green"
                      : "border-white/15 text-ink-muted hover:border-accent-purple-light/60",
                  )}
                >
                  {completed[index] ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    `0${index + 1}`
                  )}
                </button>
                <Link
                  to={step.route}
                  className="group flex min-w-0 flex-1 items-center justify-between gap-3 rounded focus-ring"
                >
                  <div>
                    <span
                      className={cn(
                        "text-sm font-medium",
                        completed[index] ? "text-ink-muted" : "text-ink",
                      )}
                    >
                      {step.label}
                    </span>
                    <p className="mt-0.5 text-xs text-ink-muted">
                      {step.detail}
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-muted transition-colors group-hover:text-accent-purple-light" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
