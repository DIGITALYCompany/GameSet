import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Bookmark,
  Check,
  Crosshair,
  Gauge,
  Keyboard,
  Target,
} from "lucide-react";
import { TOOLS } from "@/data/tools";
import { ToolArtwork } from "@/components/ui/ToolArtwork";
import { useAuth } from "@/hooks/useAuth";
import { useWorkspace } from "@/hooks/useWorkspace";
import { cn } from "@/utils/cn";

const GUIDES: Record<string, { steps: string[]; tip: string }> = {
  "sensitivity-finder": {
    steps: [
      "Choose your game and current settings.",
      "Test both values in your game each round.",
      "Save the value that feels comfortable.",
    ],
    tip: "Use the same mouse DPI throughout your test. Take your time with each comparison.",
  },
  "edpi-calculator": {
    steps: [
      "Enter your mouse DPI.",
      "Enter your in-game sensitivity.",
      "Compare the resulting eDPI within the same game.",
    ],
    tip: "eDPI is game-specific. Use cm/360 to compare physical mouse travel across games.",
  },
  "cm360-calculator": {
    steps: [
      "Select the game you play.",
      "Enter your DPI and sensitivity.",
      "Read the mouse travel for a complete turn.",
    ],
    tip: "A larger cm/360 means lower sensitivity and more mouse travel.",
  },
  "sensitivity-converter": {
    steps: [
      "Choose your source and destination games.",
      "Enter your current DPI and sensitivity.",
      "Try the converted value in the destination game.",
    ],
    tip: "This matches full-turn mouse travel. Differences in field of view can still change the perceived feel.",
  },
  "crosshair-generator": {
    steps: [
      "Select your game.",
      "Adjust shape, color and visibility.",
      "Copy the supported code or menu settings.",
    ],
    tip: "Check your crosshair against light and dark backgrounds before taking it into a match.",
  },
  "aim-trainer": {
    steps: [
      "Start a 30-second session.",
      "Click each target as it appears.",
      "Review hits and accuracy together.",
    ],
    tip: "Start with clean hits. Increase your speed once your accuracy feels consistent.",
  },
  "tracking-trainer": {
    steps: [
      "Choose a difficulty.",
      "Follow the moving target with your cursor.",
      "Review your time on target.",
    ],
    tip: "Keep your movements smooth. Use an easier difficulty before adding speed.",
  },
  "reaction-time-test": {
    steps: [
      "Start the test and wait.",
      "Click as soon as the area turns green.",
      "Complete five rounds to get an average.",
    ],
    tip: "Your browser, display and input device affect the result. Compare runs on the same setup.",
  },
  "polling-rate-test": {
    steps: [
      "Move your mouse inside the measurement area.",
      "Keep moving quickly for several seconds.",
      "Compare the average and stability.",
    ],
    tip: "This estimates browser input events. It is not a direct measurement of USB polling frequency.",
  },
};
export function ToolWorkspace({
  toolId,
  children,
  status,
}: {
  toolId: string;
  children: React.ReactNode;
  status?: string;
}) {
  const tool = TOOLS.find((item) => item.id === toolId)!;
  const guide = GUIDES[toolId];
  const { user } = useAuth();
  const { data, toggleFavorite, status: syncStatus } = useWorkspace();
  const favorite = data.favorites.includes(toolId);
  const Icon =
    tool.category === "aim"
      ? Target
      : tool.category === "performance"
        ? Gauge
        : Crosshair;
  const tone = {
    sensitivity: "tool-tone-sensitivity",
    aim: "tool-tone-aim",
    performance: "tool-tone-performance",
  }[tool.category];
  const category = {
    sensitivity: "Sensitivity lab",
    aim: "Aim training",
    performance: "Performance lab",
  }[tool.category];
  const related = TOOLS.filter(
    (item) => item.id !== toolId && item.category === tool.category,
  ).slice(0, 3);
  return (
    <div
      className={cn(
        "tool-workspace mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-10",
        tone,
      )}
    >
      <header className="tool-workspace-header relative overflow-hidden rounded-2xl border border-white/10 px-5 py-6 sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <p className="tool-eyebrow">
            <Icon className="h-3.5 w-3.5" />
            {category}
            <span className="ml-2 rounded border border-white/10 px-1.5 py-0.5 text-[8px] text-ink-muted">
              FREE TOOL
            </span>
          </p>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
            {tool.name}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
            {tool.description}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-2 text-[11px] text-ink-muted">
              <span className="status-dot" />
              {status
                ? {
                    idle: "Ready for your next session",
                    playing: "Session in progress",
                    paused: "Session paused",
                    finished: "Session complete",
                    waiting: "Waiting for the signal",
                    ready: "React now",
                    result: "Results ready",
                    tooEarly: "Try again",
                  }[status] || "Ready to use"
                : "Ready to use"}
            </span>
            {user ? (
              <button
                type="button"
                disabled={syncStatus === "loading"}
                onClick={() => toggleFavorite(toolId)}
                aria-pressed={favorite}
                className="inline-flex items-center gap-2 rounded text-[11px] text-ink-muted hover:text-ink focus-ring"
              >
                <Bookmark
                  className={cn(
                    "h-3.5 w-3.5",
                    favorite && "fill-current text-accent-purple-light",
                  )}
                />
                {favorite ? "Pinned to my tools" : "Pin this tool"}
              </button>
            ) : (
              <Link
                to="/setup"
                className="inline-flex items-center gap-2 rounded text-[11px] text-ink-muted hover:text-ink focus-ring"
              >
                <Bookmark className="h-3.5 w-3.5" />
                Keep it in my setup
              </Link>
            )}
          </div>
        </div>
        <div
          className="tool-header-art pointer-events-none absolute -right-12 top-5 hidden w-[340px] opacity-45 lg:block"
          aria-hidden="true"
        >
          <ToolArtwork id={toolId} />
        </div>
      </header>
      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_260px]">
        <section
          className="tool-main min-w-0"
          aria-label={`${tool.name} workspace`}
        >
          <div className="mb-4 flex items-center justify-between border-b border-white/[0.08] pb-3">
            <p className="tool-eyebrow text-[9px]">
              {tool.category === "aim"
                ? "TRAINING AREA"
                : tool.category === "performance"
                  ? "MEASUREMENT AREA"
                  : "YOUR WORKSPACE"}
            </p>
            <span className="font-mono text-[9px] text-ink-muted">
              GAMESET / {String(TOOLS.indexOf(tool) + 1).padStart(2, "0")}
            </span>
          </div>
          {children}
        </section>
        <aside className="grid gap-4 sm:grid-cols-2 xl:sticky xl:top-24 xl:grid-cols-1">
          <section className="tool-guide">
            <h2 className="font-display text-sm font-semibold text-ink">
              Your game plan
            </h2>
            <ol className="mt-4 space-y-4">
              {guide.steps.map((step, index) => (
                <li
                  key={step}
                  className="flex gap-3 text-xs leading-relaxed text-ink-muted"
                >
                  <span className="tool-step">{index + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-5 border-t border-white/[0.08] pt-4 text-xs leading-relaxed text-ink-muted">
              {guide.tip}
            </p>
          </section>
          <section className="tool-guide">
            <p className="tool-eyebrow text-[9px]">YOUR NEXT MOVE</p>
            <div className="mt-3 space-y-1">
              {related.map((item) => (
                <Link
                  key={item.id}
                  to={item.route}
                  className="flex items-center justify-between gap-2 rounded-lg py-2 text-xs text-ink-muted hover:text-ink focus-ring"
                >
                  {item.name}
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                </Link>
              ))}
            </div>
            <Link
              to="/tools"
              className="mt-3 inline-flex items-center gap-2 rounded text-xs text-ink focus-ring"
            >
              All tools
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </section>
          {["aim-trainer", "tracking-trainer", "reaction-time-test"].includes(
            toolId,
          ) && (
            <section className="tool-guide sm:col-span-2 xl:col-span-1">
              <h2 className="flex items-center gap-2 text-xs font-semibold text-ink">
                <Keyboard className="h-4 w-4" />
                Session shortcuts
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-ink-muted">
                {toolId === "reaction-time-test"
                  ? "Press R to restart the test."
                  : "P or Esc to pause. R to restart. Sessions pause when you switch windows."}
              </p>
            </section>
          )}
          <p className="flex items-center gap-2 text-[10px] text-ink-muted sm:col-span-2 xl:col-span-1">
            <Check className="h-3 w-3 text-accent-green" />
            No download needed.
          </p>
        </aside>
      </div>
    </div>
  );
}
