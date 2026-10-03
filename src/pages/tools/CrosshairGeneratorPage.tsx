import { useState, useMemo } from 'react';
import { Plus, Copy, Check, RotateCcw, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { GameSelector } from '@/components/sensitivity/GameSelector';
import { cn } from '@/utils/cn';
import { GAMES } from '@/data/games';
import {
  GAME_CROSSHAIR_CONFIGS,
  getCrosshairConfig,
  type ExportSettings,
} from '@/data/crosshairConfigs';
import type { GameConfig } from '@/types';

interface CrosshairSettings {
  gap: number;
  length: number;
  thickness: number;
  dotSize: number;
  outlineThickness: number;
  colorId: string;
  outline: boolean;
  dot: boolean;
  tShape: boolean;
}

function defaultsToSettings(
  d: ReturnType<typeof getCrosshairConfig>['defaults']
): CrosshairSettings {
  return {
    gap: d.gap,
    length: d.length,
    thickness: d.thickness,
    dotSize: d.dotSize,
    outlineThickness: d.outlineThickness,
    colorId: d.colorId,
    outline: d.outline,
    dot: d.dot,
    tShape: d.tShape,
  };
}

export function CrosshairGeneratorPage() {
  const [selectedGame, setSelectedGame] = useState<GameConfig | null>(GAMES[0]);
  const [settings, setSettings] = useState<CrosshairSettings>(() =>
    defaultsToSettings(GAME_CROSSHAIR_CONFIGS.valorant.defaults)
  );
  const [copied, setCopied] = useState(false);

  const config = selectedGame
    ? getCrosshairConfig(selectedGame.id)
    : GAME_CROSSHAIR_CONFIGS.valorant;

  const update = (patch: Partial<CrosshairSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  };

  const handleGameSelect = (game: GameConfig) => {
    setSelectedGame(game);
    const gameConfig = getCrosshairConfig(game.id);
    setSettings(defaultsToSettings(gameConfig.defaults));
    setCopied(false);
  };

  const applyPreset = (preset: typeof config.presets[number]) => {
    setSettings(defaultsToSettings(preset.settings));
  };

  const reset = () => {
    setSettings(defaultsToSettings(config.defaults));
  };

  const selectedColor = useMemo(
    () => config.colors.find((c) => c.id === settings.colorId) ?? config.colors[0],
    [config, settings.colorId]
  );

  const handleCopy = () => {
    const exportSettings: ExportSettings = {
      gap: settings.gap,
      length: settings.length,
      thickness: settings.thickness,
      colorId: settings.colorId,
      colorHex: selectedColor.hex,
      colorExport: selectedColor.exportValue,
      outline: settings.outline,
      outlineThickness: settings.outlineThickness,
      dot: settings.dot,
      dotSize: settings.dotSize,
      tShape: settings.tShape,
    };
    navigator.clipboard.writeText(config.exportFormat(exportSettings)).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  };

  const availableParams = config.params.filter((p) => p.available);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-md border border-border bg-base-surface px-3 py-1.5">
            <Plus className="h-3.5 w-3.5 text-accent-purple" />
            <span className="text-xs font-medium text-ink-muted">Crosshair Generator</span>
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Crosshair Generator
          </h1>
          <p className="mt-2 text-base text-ink-muted">
            Design and preview your crosshair, adapted to each game's settings.
            Pick a game, adjust the parameters, then copy the values to apply
            in-game.
          </p>
        </div>

        {/* Game selector */}
        <div className="mb-6">
          <p className="mb-3 text-sm font-medium text-ink-muted">Select game</p>
          <GameSelector selectedId={selectedGame?.id ?? null} onSelect={handleGameSelect} />
        </div>

        {/* Unsupported game notice */}
        {!config.supported && (
          <div className="mb-6 flex items-start gap-3 rounded-md border border-accent-orange/30 bg-accent-orange/5 p-4">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent-orange" />
            <p className="text-sm leading-relaxed text-ink-muted">
              {selectedGame?.name} has limited crosshair customization. You can
              still design a crosshair here and use the exported values as a
              reference, but the game may not support all parameters.
            </p>
          </div>
        )}

        {/* Presets */}
        {config.presets.length > 0 && (
          <div className="mb-6">
            <p className="mb-2 text-sm font-medium text-ink-muted">
              Presets for {selectedGame?.name}
            </p>
            <div className="flex flex-wrap gap-2">
              {config.presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="rounded-md border border-border bg-base-surface-2 px-3 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:border-white/15 hover:text-ink focus-ring"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Preview */}
          <Card noPadding className="overflow-hidden">
            <div
              className="relative flex items-center justify-center"
              style={{
                background:
                  'repeating-conic-gradient(#1a1a22 0% 25%, #15151c 0% 50%) 50% / 24px 24px',
                height: '320px',
              }}
            >
              <svg width="200" height="200" viewBox="0 0 200 200" className="absolute">
                {settings.length > 0 && settings.thickness > 0 && (
                  <>
                    {!settings.tShape && (
                      <rect
                        x={100 - settings.thickness / 2}
                        y={100 - settings.gap - settings.length}
                        width={settings.thickness}
                        height={settings.length}
                        fill={selectedColor.hex}
                        stroke={settings.outline ? 'rgba(0,0,0,0.8)' : 'none'}
                        strokeWidth={settings.outline ? settings.outlineThickness : 0}
                      />
                    )}
                    <rect
                      x={100 - settings.thickness / 2}
                      y={100 + settings.gap}
                      width={settings.thickness}
                      height={settings.length}
                      fill={selectedColor.hex}
                      stroke={settings.outline ? 'rgba(0,0,0,0.8)' : 'none'}
                      strokeWidth={settings.outline ? settings.outlineThickness : 0}
                    />
                    <rect
                      x={100 - settings.gap - settings.length}
                      y={100 - settings.thickness / 2}
                      width={settings.length}
                      height={settings.thickness}
                      fill={selectedColor.hex}
                      stroke={settings.outline ? 'rgba(0,0,0,0.8)' : 'none'}
                      strokeWidth={settings.outline ? settings.outlineThickness : 0}
                    />
                    <rect
                      x={100 + settings.gap}
                      y={100 - settings.thickness / 2}
                      width={settings.length}
                      height={settings.thickness}
                      fill={selectedColor.hex}
                      stroke={settings.outline ? 'rgba(0,0,0,0.8)' : 'none'}
                      strokeWidth={settings.outline ? settings.outlineThickness : 0}
                    />
                  </>
                )}
                {settings.dot && settings.dotSize > 0 && (
                  <circle
                    cx={100}
                    cy={100}
                    r={settings.dotSize / 2}
                    fill={selectedColor.hex}
                    stroke={settings.outline ? 'rgba(0,0,0,0.8)' : 'none'}
                    strokeWidth={settings.outline ? settings.outlineThickness : 0}
                  />
                )}
              </svg>
            </div>
            <div className="border-t border-border p-4 flex items-center justify-between">
              <p className="text-xs text-ink-dim">Live preview · {selectedGame?.name}</p>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={reset}>
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
                <Button variant="secondary" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </div>
          </Card>

          {/* Controls */}
          <Card>
            <h2 className="mb-4 font-display text-lg font-semibold text-ink">
              {selectedGame?.name} Settings
            </h2>

            <div className="space-y-5">
              {availableParams.map((param) => (
                <Slider
                  key={param.key}
                  label={param.label}
                  value={settings[param.key]}
                  min={param.min}
                  max={param.max}
                  onChange={(v) => update({ [param.key]: v })}
                />
              ))}

              <div>
                <p className="mb-2 text-sm font-medium text-ink-muted">Color</p>
                <div className="flex flex-wrap gap-2">
                  {config.colors.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => update({ colorId: c.id })}
                      className={cn(
                        'h-8 w-8 rounded-md border-2 transition-transform focus-ring',
                        settings.colorId === c.id
                          ? 'border-white scale-110'
                          : 'border-transparent hover:scale-105'
                      )}
                      style={{ backgroundColor: c.hex }}
                      aria-label={c.label}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              {config.hasOutline && (
                <>
                  <ToggleRow
                    label="Outline"
                    checked={settings.outline}
                    onChange={(v) => update({ outline: v })}
                  />
                  {settings.outline && (
                    <Slider
                      label="Outline Thickness"
                      value={settings.outlineThickness}
                      min={0}
                      max={6}
                      onChange={(v) => update({ outlineThickness: v })}
                    />
                  )}
                </>
              )}

              {config.hasDot && (
                <>
                  <ToggleRow
                    label="Center Dot"
                    checked={settings.dot}
                    onChange={(v) => update({ dot: v })}
                  />
                  {settings.dot && (
                    <Slider
                      label="Dot Size"
                      value={settings.dotSize}
                      min={0}
                      max={10}
                      onChange={(v) => update({ dotSize: v })}
                    />
                  )}
                </>
              )}

              {config.hasTShape && (
                <ToggleRow
                  label="T-Shape (no top line)"
                  checked={settings.tShape}
                  onChange={(v) => update({ tShape: v })}
                />
              )}
            </div>

            {/* Apply instructions */}
            <div className="mt-5 rounded-md border border-border bg-base-surface-2 p-3">
              <p className="text-xs leading-relaxed text-ink-muted">
                <span className="font-semibold text-ink">How to apply:</span>{' '}
                {config.applyInstructions}
              </p>
            </div>
          </Card>
        </div>
      </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-ink-muted">{label}</label>
        <span className="font-mono text-sm font-bold text-ink">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="mt-2 w-full accent-accent-purple"
      />
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-ink-muted">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-200 focus-ring',
          checked ? 'border-accent-purple bg-accent-purple' : 'border-border bg-base-surface-3'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform duration-200',
            checked ? 'translate-x-[22px]' : 'translate-x-1'
          )}
        />
      </button>
    </div>
  );
}
