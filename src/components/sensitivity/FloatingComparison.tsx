import { GameIcon } from '@/components/games/GameIcon';
import { ArrowLeft, ArrowRight, Check, Equal, Maximize2, RotateCcw } from 'lucide-react';
import { formatSens } from '@/utils/calculations';
import { cn } from '@/utils/cn';
import { useComparisonChoice, type Choice } from '@/hooks/useComparisonChoice';

interface FloatingComparisonProps {
  round: number;
  totalRounds: number;
  lower: number;
  higher: number;
  gapPercent: number;
  onChoose: (choice: Choice) => void;
  onReattach: () => void;
  onRestart: () => void;
  target: Window;
}

export function FloatingComparison({ round, totalRounds, lower, higher, gapPercent, onChoose, onReattach, onRestart, target }: FloatingComparisonProps) {
  const { selection, select } = useComparisonChoice(round, onChoose, onReattach, target);

  return (
    <div className="flex min-h-screen flex-col gap-3 bg-base-bg p-3 font-sans text-ink">
      <header className="flex items-center justify-between">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
          Round <span className="text-ink">{round}</span> / {totalRounds}
        </p>
        <div className="flex items-center gap-0.5">
          {round > 1 && (
            <button
              type="button"
              onClick={onRestart}
              title="Start again from round 1"
              className="rounded-md p-1.5 text-ink-dim transition-colors hover:bg-white/[0.06] hover:text-ink"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={onReattach}
            title="Bring back to the main window"
            className="rounded-md p-1.5 text-ink-dim transition-colors hover:bg-white/[0.06] hover:text-ink"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-accent-purple transition-all duration-500 ease-smooth"
          style={{ width: `${(round / totalRounds) * 100}%` }}
        />
      </div>

      <div className="grid flex-1 grid-cols-2 gap-2">
        <MiniCard label="Low" value={lower} icon={<ArrowLeft className="h-3.5 w-3.5" />} selected={selection === 'lower' || selection === 'same'} dimmed={selection === 'higher'} onClick={() => select('lower')} />
        <MiniCard label="High" value={higher} icon={<ArrowRight className="h-3.5 w-3.5" />} selected={selection === 'higher' || selection === 'same'} dimmed={selection === 'lower'} onClick={() => select('higher')} />
      </div>

      <button
        type="button"
        onClick={() => select('same')}
        disabled={!!selection}
        className={cn(
          'inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border text-xs font-medium transition-all duration-200 disabled:opacity-60',
          selection === 'same'
            ? 'border-accent-purple/50 bg-accent-purple/15 text-accent-purple-light'
            : 'border-white/[0.08] bg-white/[0.02] text-ink-muted hover:border-white/15 hover:text-ink'
        )}
      >
        <Equal className="h-3.5 w-3.5" />
        Felt the same
      </button>

      <p className="text-center text-[10px] text-ink-dim">
        Gap {gapPercent.toFixed(1)}% · click the one that felt better
      </p>
    </div>
  );
}

function MiniCard({ label, value, icon, selected, dimmed, onClick }: { label: string; value: number; icon: React.ReactNode; selected: boolean; dimmed: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border px-2 py-4 transition-all duration-200',
        selected
          ? 'border-accent-purple bg-accent-purple/10 shadow-glow'
          : dimmed
            ? 'border-white/[0.06] bg-base-surface opacity-40'
            : 'border-white/[0.08] bg-base-surface hover:border-white/20 hover:bg-base-surface-2'
      )}
    >
      <span className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
        {label === 'Low' && icon}
        {label}
        {label === 'High' && icon}
      </span>
      <span className={cn('mt-2 font-mono text-3xl font-bold tabular-nums', selected ? 'text-accent-purple-light' : 'text-ink')}>
        {formatSens(value)}
      </span>
    </button>
  );
}

export function FloatingResult({ sensitivity, gameName, onClose }: { sensitivity: number; gameName: string; onClose: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-base-bg p-4 text-center font-sans text-ink">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-green/15">
        <Check className="h-5 w-5 text-accent-green" />
      </span>
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted"><GameIcon gameName={gameName} size="sm" className="mr-2" />Your {gameName} sensitivity</p>
      <p className="font-mono text-4xl font-bold tabular-nums text-ink">{formatSens(sensitivity)}</p>
      <p className="text-xs text-ink-dim">Full results and saving are in the main window.</p>
      <button
        type="button"
        onClick={onClose}
        className="mt-1 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-ink transition-colors hover:bg-white/[0.08]"
      >
        Close
      </button>
    </div>
  );
}
