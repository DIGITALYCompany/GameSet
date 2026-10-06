import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { useState } from "react";

import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { GameSelector } from "@/components/sensitivity/GameSelector";
import { calcCm360, round } from "@/utils/calculations";
import type { GameConfig } from "@/types";

export function Cm360CalculatorPage() {
  const [game, setGame] = useState<GameConfig | null>(null);
  const [dpi, setDpi] = useState("800");
  const [sensitivity, setSensitivity] = useState("");

  const dpiNum = parseFloat(dpi);
  const sensNum = parseFloat(sensitivity);
  const valid =
    game && !isNaN(dpiNum) && dpiNum > 0 && !isNaN(sensNum) && sensNum > 0;
  const cm360 = valid ? calcCm360(dpiNum, sensNum, game!) : null;

  const handleGameSelect = (g: GameConfig) => {
    setGame(g);
    if (!sensitivity) setSensitivity(String(g.defaultSens));
  };

  return (
    <ToolWorkspace toolId="cm360-calculator">
      <Card className="mb-4">
        <p className="mb-3 text-sm font-medium text-ink-muted">Select game</p>
        <GameSelector
          selectedId={game?.id ?? null}
          onSelect={handleGameSelect}
        />
      </Card>

      {game && (
        <Card className="mb-6">
          <div className="grid gap-4 sm:grid-cols-2">
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
              placeholder={String(game.defaultSens)}
              value={sensitivity}
              onChange={(e) => setSensitivity(e.target.value)}
            />
          </div>
        </Card>
      )}

      <div className="rounded-lg border border-border bg-base-surface p-8 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-ink-dim">
          cm / 360°
        </p>
        <p className="mt-3 font-mono text-5xl font-bold text-ink">
          {cm360 !== null ? round(cm360, 1) : "N/A"}
        </p>
        <p className="mt-4 text-sm text-ink-muted">
          {game
            ? `Based on ${game.name} conversion factor`
            : "Select a game to calculate"}
        </p>
      </div>

      <div className="mt-6 rounded-md border border-border bg-base-surface-2 p-4">
        <p className="text-sm leading-relaxed text-ink-muted">
          <span className="font-semibold text-ink">Tip:</span> Most professional
          FPS players use a cm/360 between 30 and 50 cm. A lower cm/360 means
          faster turning but less precision; a higher cm/360 means more
          precision but slower turns.
        </p>
      </div>
    </ToolWorkspace>
  );
}
