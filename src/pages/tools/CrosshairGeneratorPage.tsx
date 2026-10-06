import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Crosshair, RotateCcw, AlertCircle, Zap, ListChecks, Pipette } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { GameSelector } from '@/components/sensitivity/GameSelector';
import { CrosshairPreview } from '@/components/crosshair/CrosshairPreview';
import { CrosshairExportPanel } from '@/components/crosshair/CrosshairExportPanel';
import { cn } from '@/utils/cn';
import { GAMES } from '@/data/games';
import {
  getCrosshairConfig,
  type CrosshairRange,
  type CrosshairSettings,
  type ImportSupport,
} from '@/data/crosshairConfigs';
import type { CrosshairShape } from '@/lib/crosshairCodes';
import type { GameConfig } from '@/types';

const SUPPORT_BADGE: Record<ImportSupport, { label: string; icon: typeof Zap; className: string }> = {
  code: { label: 'Direct import', icon: Zap, className: 'border-accent-green/30 bg-accent-green/10 text-accent-green' },
  manual: { label: 'Menu values', icon: ListChecks, className: 'border-accent-orange/30 bg-accent-orange/10 text-accent-orange' },
  limited: { label: 'Limited in-game', icon: AlertCircle, className: 'border-white/10 bg-white/5 text-ink-muted' },
};

export function CrosshairGeneratorPage() {
  const [searchParams] = useSearchParams();
  const [game, setGame] = useState<GameConfig>(() => GAMES.find(item => item.id === searchParams.get('game')) || GAMES[0]);
  const config = getCrosshairConfig(game.id);
  const [settings, setSettings] = useState<CrosshairSettings>(config.defaults);

  const update = (patch: Partial<CrosshairSettings>) => setSettings((prev) => ({ ...prev, ...patch }));

  const selectGame = (g: GameConfig) => {
    setGame(g);
    setSettings(getCrosshairConfig(g.id).defaults);
  };

  const color = settings.colorId === 'custom' ? null : config.colors.find((c) => c.id === settings.colorId) ?? config.colors[0];
  const hex = color?.hex ?? settings.customHex;

  const exportShape: CrosshairShape = { ...settings, hex };
  const previewShape: CrosshairShape = useMemo(
    () => ({ ...settings, ...config.toPixels(settings), hex }),
    [settings, config, hex]
  );

  const badge = SUPPORT_BADGE[config.support];
  const BadgeIcon = badge.icon;
  const lineKeys = (['gap', 'length', 'thickness'] as const).filter((k) => config.lines[k]);
  const outlineRange = typeof config.outline === 'object' ? config.outline : null;
  const dotRange = typeof config.dot === 'object' ? config.dot : null;

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <header className="mb-10 animate-fade-in">
          <span className="badge">
            <Crosshair className="h-3.5 w-3.5 text-accent-green" />
            Crosshair Studio
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl">
            Build it here. <span className="text-gradient">Paste it in-game.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
            Every slider uses your game's own crosshair settings. Valorant and CS2 get a real import code you can paste
            straight into the crosshair menu. No retyping values.
          </p>
        </header>

        <div className="mb-8">
          <GameSelector selectedId={game.id} onSelect={selectGame} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          <div className="space-y-6">
            <CrosshairPreview shape={previewShape} caption={`Preview at 1080p · ${game.name}`} />
            <CrosshairExportPanel
              key={game.id}
              exports={config.exports}
              shape={exportShape}
              color={color}
              gameName={game.name}
            />
          </div>

          <aside className="glass h-fit rounded-2xl border border-border p-6 shadow-card lg:sticky lg:top-24">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-semibold text-ink">{game.name} settings</h2>
              <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold', badge.className)}>
                <BadgeIcon className="h-3 w-3" />
                {badge.label}
              </span>
            </div>

            {config.note && (
              <p className="mt-4 rounded-xl border border-border bg-base-surface-2 p-3 text-sm leading-relaxed text-ink-muted">
                {config.note}
              </p>
            )}

            {config.presets.length > 0 && (
              <div className="mt-6">
                <Label>Pro-style presets</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {config.presets.map((p) => (
                    <button
                      key={p.name}
                      onClick={() => setSettings({ ...config.defaults, ...p.settings })}
                      className="rounded-lg border border-border bg-base-surface-2 px-3 py-2 text-left text-sm font-medium text-ink-muted transition-all duration-200 hover:-translate-y-px hover:border-white/15 hover:text-ink focus-ring"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 space-y-5">
              {lineKeys.map((k) => (
                <Slider key={k} range={config.lines[k]!} value={settings[k]} onChange={(v) => update({ [k]: v })} />
              ))}

              <div>
                <Label>Color</Label>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {config.colors.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => update({ colorId: c.id })}
                      className={cn(
                        'h-8 w-8 rounded-lg ring-2 ring-offset-2 ring-offset-base-surface transition-all duration-200 focus-ring',
                        settings.colorId === c.id ? 'scale-110 ring-white' : 'ring-transparent hover:scale-105'
                      )}
                      style={{ backgroundColor: c.hex }}
                      aria-label={c.label}
                      title={c.label}
                    />
                  ))}
                  {config.customColor && (
                    <label
                      className={cn(
                        'relative flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border px-2 text-xs font-semibold transition-all duration-200',
                        settings.colorId === 'custom' ? 'border-white text-ink' : 'border-border text-ink-muted hover:text-ink'
                      )}
                    >
                      <Pipette className="h-3.5 w-3.5" />
                      <span className="h-4 w-4 rounded" style={{ background: settings.customHex }} />
                      Custom
                      <input
                        type="color"
                        value={settings.customHex}
                        onChange={(e) => update({ colorId: 'custom', customHex: e.target.value })}
                        className="absolute inset-0 cursor-pointer opacity-0"
                        aria-label="Custom color"
                      />
                    </label>
                  )}
                </div>
              </div>

              {config.outline && (
                <Toggle label="Outlines" checked={settings.outline} onChange={(v) => update({ outline: v })}>
                  {outlineRange && (
                    <Slider range={outlineRange} value={settings.outlineThickness} onChange={(v) => update({ outlineThickness: v })} />
                  )}
                </Toggle>
              )}

              {config.dot && (
                <Toggle label="Center dot" checked={settings.dot} onChange={(v) => update({ dot: v })}>
                  {dotRange && <Slider range={dotRange} value={settings.dotSize} onChange={(v) => update({ dotSize: v })} />}
                </Toggle>
              )}

              {config.tShape && (
                <Toggle label="T-style (no top line)" checked={settings.tShape} onChange={(v) => update({ tShape: v })} />
              )}
            </div>

            <button
              onClick={() => setSettings(config.defaults)}
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink-dim transition-colors hover:text-ink focus-ring rounded"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset to default
            </button>
          </aside>
        </div>
      </div>
    </Layout>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-dim">{children}</p>;
}

function Slider({ range, value, onChange }: { range: CrosshairRange; value: number; onChange: (v: number) => void }) {
  const pct = ((value - range.min) / (range.max - range.min)) * 100;
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-ink-muted">{range.label}</label>
        <span className="rounded-md bg-base-surface-3 px-2 py-0.5 font-mono text-sm font-semibold tabular-nums text-ink">{value}</span>
      </div>
      <input
        type="range"
        min={range.min}
        max={range.max}
        step={range.step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        aria-label={range.label}
        className="range-slider mt-3 w-full"
        style={{ '--pct': `${pct}%` } as React.CSSProperties}
      />
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
  children,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-base-surface-2/60 p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink">{label}</span>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={label}
          onClick={() => onChange(!checked)}
          className={cn(
            'relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-200 focus-ring',
            checked ? 'border-accent-green bg-accent-green' : 'border-border bg-base-surface-3'
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200',
              checked ? 'translate-x-[22px]' : 'translate-x-1'
            )}
          />
        </button>
      </div>
      {checked && children && <div className="mt-4 animate-fade-in">{children}</div>}
    </div>
  );
}
