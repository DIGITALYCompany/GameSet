import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Repeat, Bookmark } from "lucide-react";
import { calcCm360, round } from "@/utils/calculations";
import type { GameConfig } from "@/types";

const field =
  "mt-2 w-full min-w-0 rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 font-mono text-sm text-ink outline-none focus:border-accent-purple-light";
export function GameSettingsLab({ game }: { game: GameConfig }) {
  const [referenceDpi, setReferenceDpi] = useState("800");
  const [referenceSens, setReferenceSens] = useState(String(game.defaultSens));
  const [yourDpi, setYourDpi] = useState("800");
  const [yourSens, setYourSens] = useState(String(game.defaultSens));
  const rd = Number(referenceDpi),
    rs = Number(referenceSens),
    yd = Number(yourDpi),
    ys = Number(yourSens);
  const dpiValid = (v: number) => Number.isInteger(v) && v > 0 && v <= 100000;
  const sensValid = (v: number) =>
    Number.isFinite(v) &&
    v > 0 &&
    v >= game.sensScale.min &&
    v <= game.sensScale.max;
  const valid = dpiValid(rd) && dpiValid(yd) && sensValid(rs) && sensValid(ys);
  const matched = valid ? (rd * rs) / yd : null;
  const supported = matched !== null && sensValid(matched);
  const referenceCm = valid ? calcCm360(rd, rs, game) : null;
  const yourCm = valid ? calcCm360(yd, ys, game) : null;
  const difference =
    referenceCm && yourCm ? (yourCm / referenceCm - 1) * 100 : null;
  const query = supported
    ? new URLSearchParams({
        game: game.id,
        dpi: String(yd),
        sensitivity: String(round(matched, 6)),
      }).toString()
    : "";
  return (
    <section
      className="rounded-2xl border border-white/10 bg-base-surface p-5 sm:p-6"
      aria-labelledby="comparison-title"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-accent-purple/20 bg-accent-purple/10">
          <Repeat className="h-5 w-5 text-accent-purple-light" />
        </span>
        <div>
          <p className="eyebrow">MAKE IT YOURS</p>
          <h2
            id="comparison-title"
            className="mt-1 font-display text-xl font-semibold text-ink"
          >
            Compare a setup
          </h2>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-ink-muted">
        Enter a reference you want to try, then match its mouse travel at your
        own DPI. Values start with GameSet's example setup.
      </p>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {[
          {
            title: "Reference settings",
            dpi: referenceDpi,
            sens: referenceSens,
            onDpi: setReferenceDpi,
            onSens: setReferenceSens,
            prefix: "reference",
          },
          {
            title: "Your current settings",
            dpi: yourDpi,
            sens: yourSens,
            onDpi: setYourDpi,
            onSens: setYourSens,
            prefix: "your",
          },
        ].map((item) => (
          <fieldset
            key={item.prefix}
            className="min-w-0 rounded-xl border border-white/[0.08] bg-black/10 p-4"
          >
            <legend className="px-1 text-xs font-semibold text-ink-muted">
              {item.title}
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <label className="min-w-0 text-xs text-ink-muted">
                DPI
                <input
                  name={`${item.prefix}-dpi`}
                  type="number"
                  min="1"
                  max="100000"
                  step="1"
                  value={item.dpi}
                  onChange={(e) => item.onDpi(e.target.value)}
                  className={field}
                />
              </label>
              <label className="min-w-0 text-xs text-ink-muted">
                Sensitivity{game.sensUnit && ` (${game.sensUnit})`}
                <input
                  name={`${item.prefix}-sens`}
                  type="number"
                  min={game.sensScale.min}
                  max={game.sensScale.max}
                  step="any"
                  value={item.sens}
                  onChange={(e) => item.onSens(e.target.value)}
                  className={field}
                />
              </label>
            </div>
          </fieldset>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Metric
          label="Reference cm/360"
          value={referenceCm !== null ? String(round(referenceCm, 2)) : "N/A"}
        />
        <Metric
          label="Your cm/360"
          value={yourCm !== null ? String(round(yourCm, 2)) : "N/A"}
        />
      </div>
      <div className="mt-4 rounded-xl border border-accent-purple/25 bg-accent-purple/5 p-5">
        <p className="eyebrow">MATCHED TO YOUR DPI</p>
        <p className="mt-2 font-mono text-3xl font-semibold text-ink">
          {matched !== null ? round(matched, 6) : "N/A"}
          {game.sensUnit && (
            <span className="ml-1 text-lg text-ink-muted">{game.sensUnit}</span>
          )}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-ink-muted">
          {difference === null
            ? "Enter valid settings to compare."
            : Math.abs(difference) < 0.05
              ? "Your current setup matches the reference mouse travel."
              : `${round(Math.abs(difference), 1)}% ${difference > 0 ? "more" : "less"} mouse travel in your current setup than the reference.`}
        </p>
        {valid && !supported && (
          <p role="status" className="mt-2 text-xs text-accent-orange">
            The matched sensitivity is outside this game's supported range. Try
            another DPI.
          </p>
        )}
      </div>
      {supported && (
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to={`/setup?${query}`} className="arena-primary focus-ring">
            <Bookmark className="h-4 w-4" />
            Use in my setup
          </Link>
          <Link
            to={`/sensitivity?${query}`}
            className="arena-secondary focus-ring"
          >
            Test this starting point
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      )}
      <p className="mt-4 text-[11px] leading-relaxed text-ink-muted">
        Matching settings is a starting point. Comfort, field of view and scoped
        settings can still change how aiming feels.
      </p>
    </section>
  );
}
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/[0.08] bg-black/20 p-3">
      <p className="font-mono text-[9px] uppercase tracking-wider text-ink-muted">
        {label}
      </p>
      <p className="mt-2 font-mono text-lg text-ink">
        {value}
        <span className="ml-1 text-xs text-ink-muted">cm</span>
      </p>
    </div>
  );
}
