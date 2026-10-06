import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { GameIcon } from "@/components/games/GameIcon";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { GAMES } from "@/data/games";
import { calcCm360, round } from "@/utils/calculations";
import type { GameConfig } from "@/types";

export function SensitivityConverterPage() {
  const [searchParams] = useSearchParams();
  const [sourceGame, setSourceGame] = useState<GameConfig>(() => GAMES.find(item => item.id === searchParams.get('game')) || GAMES[0]);
  const [targetGame, setTargetGame] = useState<GameConfig>(() => GAMES.find(item => item.id !== sourceGame.id)!);
  const [dpi, setDpi] = useState("800");
  const [sensitivity, setSensitivity] = useState(String(sourceGame.defaultSens));

  const dpiNum = parseFloat(dpi);
  const sensNum = parseFloat(sensitivity);
  const valid = !isNaN(dpiNum) && dpiNum > 0 && !isNaN(sensNum) && sensNum > 0;

  // Convert: cm/360 stays constant. Solve for target sensitivity.
  // cm360 = 360 / (sens * yaw * dpi) * 2.54
  // target_sens = 360 / (cm360 / 2.54 * target_yaw * target_dpi)
  const cm360 = valid ? calcCm360(dpiNum, sensNum, sourceGame) : null;
  const targetSens =
    cm360 !== null && valid
      ? 360 / ((cm360 / 2.54) * targetGame.yaw * dpiNum)
      : null;

  const targetEdpi = targetSens !== null ? dpiNum * targetSens : null;

  const swap = () => {
    setSourceGame(targetGame);
    setTargetGame(sourceGame);
    setSensitivity(
      targetSens !== null ? round(targetSens, 4).toString() : sensitivity,
    );
  };

  return (
    <Layout>
      <ToolWorkspace toolId="sensitivity-converter">
        {/* Source and target game selectors */}
        <div className="grid items-start gap-4 lg:grid-cols-[1fr_auto_1fr]">
          <Card>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-dim">
              From
            </p>
            <GameDropdown
              games={GAMES}
              selected={sourceGame}
              onSelect={setSourceGame}
            />
            <div className="mt-4 space-y-3">
              <Input
                label="DPI"
                type="number"
                name="dpi"
                inputMode="numeric"
                placeholder="800"
                value={dpi}
                onChange={(e) => setDpi(e.target.value)}
              />
              <Input
                label="Sensitivity"
                type="number"
                name="sensitivity"
                step="any"
                inputMode="decimal"
                placeholder={String(sourceGame.defaultSens)}
                value={sensitivity}
                onChange={(e) => setSensitivity(e.target.value)}
              />
            </div>
          </Card>

          {/* Swap button */}
          <div className="flex items-center justify-center py-2 lg:pt-12">
            <button
              onClick={swap}
              className="rounded-lg border border-border bg-base-surface-2 p-3 text-ink-muted transition-colors hover:border-white/15 hover:text-ink focus-ring"
              aria-label="Swap source and target games"
            >
              <ArrowRight className="h-5 w-5 lg:rotate-90" />
            </button>
          </div>

          <Card>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-dim">
              To
            </p>
            <GameDropdown
              games={GAMES}
              selected={targetGame}
              onSelect={setTargetGame}
            />
            <div className="mt-4 space-y-3">
              <div className="rounded-lg border border-border bg-base-surface-2 p-3">
                <p className="text-xs font-medium text-ink-dim">DPI (same)</p>
                <p className="mt-1 font-mono text-lg font-bold text-ink">
                  {valid ? dpiNum : "N/A"}
                </p>
              </div>
              <div className="rounded-lg border border-accent-purple/40 bg-accent-purple/5 p-3">
                <p className="text-xs font-medium text-accent-purple">
                  Converted Sensitivity
                </p>
                <p className="mt-1 font-mono text-lg font-bold text-ink">
                  {targetSens !== null ? round(targetSens, 4) : "N/A"}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Result summary */}
        {targetSens !== null && Number.isFinite(targetSens) && (
          <Link
            to={`/setup?${new URLSearchParams({ game: targetGame.id, dpi: String(dpiNum), sensitivity: String(targetSens) }).toString()}`}
            className="arena-secondary mt-6 focus-ring"
          >
            Use converted sensitivity in my setup
          </Link>
        )}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard
            label="Source cm/360"
            value={cm360 !== null ? `${round(cm360, 1)} cm` : "N/A"}
          />
          <StatCard
            label="Target cm/360"
            value={cm360 !== null ? `${round(cm360, 1)} cm` : "N/A"}
          />
          <StatCard
            label="Target eDPI"
            value={
              targetEdpi !== null ? round(targetEdpi, 0).toString() : "N/A"
            }
          />
        </div>

        <div className="mt-6 rounded-xl border border-border bg-base-surface-2 p-4 shadow-card">
          <p className="text-sm leading-relaxed text-ink-muted">
            <span className="font-semibold text-ink">How it works:</span> Your
            cm/360 (centimeters per full turn) stays constant when converting.
            The converter calculates your cm/360 from the source game, then
            solves for the sensitivity in the target game that produces the same
            cm/360 at the same DPI.
          </p>
        </div>
      </ToolWorkspace>
    </Layout>
  );
}

function GameDropdown({
  games,
  selected,
  onSelect,
}: {
  games: GameConfig[];
  selected: GameConfig;
  onSelect: (g: GameConfig) => void;
}) {
  return (
    <div className="relative">
      <GameIcon
        gameId={selected.id}
        size="sm"
        className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2"
      />
      <select
        value={selected.id}
        onChange={(e) => {
          const game = games.find((g) => g.id === e.target.value);
          if (game) onSelect(game);
        }}
        className="w-full appearance-none rounded-lg border border-border bg-base-surface-2 pl-12 pr-4 py-2.5 text-sm font-medium text-ink transition-colors focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple"
        aria-label="Select game"
      >
        {games.map((g) => (
          <option key={g.id} value={g.id} className="bg-base-surface text-ink">
            {g.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-base-surface p-4 text-center shadow-card">
      <p className="text-xs font-medium uppercase tracking-wider text-ink-dim">
        {label}
      </p>
      <p className="mt-1.5 font-mono text-lg font-bold text-ink">{value}</p>
    </div>
  );
}
