import { Input } from '@/components/ui/Input';
import { calcEdpi, calcCm360, round } from '@/utils/calculations';
import type { GameConfig } from '@/types';

interface PlayerInputProps {
  game: GameConfig;
  dpi: string;
  sensitivity: string;
  fov: string;
  dpiError: string;
  sensError: string;
  onDpiChange: (v: string) => void;
  onSensitivityChange: (v: string) => void;
  onFovChange: (v: string) => void;
}

export function PlayerInput({
  game,
  dpi,
  sensitivity,
  fov,
  dpiError,
  sensError,
  onDpiChange,
  onSensitivityChange,
  onFovChange,
}: PlayerInputProps) {
  const dpiNum = parseFloat(dpi);
  const sensNum = parseFloat(sensitivity);
  const hasValidInput =
    !isNaN(dpiNum) && dpiNum > 0 && !isNaN(sensNum) && sensNum > 0;

  const edpi = hasValidInput ? calcEdpi(dpiNum, sensNum) : null;
  const cm360 = hasValidInput ? calcCm360(dpiNum, sensNum, game) : null;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="DPI"
          type="number"
          name="dpi"
          inputMode="numeric"
          placeholder="800"
          value={dpi}
          onChange={(e) => onDpiChange(e.target.value)}
          error={dpiError}
        />
        <Input
          label="Sensitivity"
          type="number"
          name="sensitivity"
          step="any"
          inputMode="decimal"
          placeholder={String(game.defaultSens)}
          value={sensitivity}
          onChange={(e) => onSensitivityChange(e.target.value)}
          error={sensError}
        />
      </div>

      {game.hasFov && (
        <div className="sm:max-w-[50%]">
          <Input
            label="FOV (optional)"
            type="number"
            name="fov"
            inputMode="numeric"
            placeholder={String(game.defaultFov ?? 90)}
            value={fov}
            onChange={(e) => onFovChange(e.target.value)}
            suffix="°"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-base-surface-2 p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-ink-dim">
            eDPI
          </p>
          <p className="mt-1 font-mono text-xl font-bold text-ink">
            {edpi !== null ? round(edpi, 1) : '—'}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-ink-dim">
            cm / 360°
          </p>
          <p className="mt-1 font-mono text-xl font-bold text-ink">
            {cm360 !== null ? `${round(cm360, 1)}` : '—'}
          </p>
        </div>
      </div>
    </div>
  );
}
