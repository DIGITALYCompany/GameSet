import { ArrowLeft, ArrowRight, Equal, PictureInPicture2, RotateCcw, X } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { formatSens } from '@/utils/calculations';
import { cn } from '@/utils/cn';
import { useComparisonChoice, type Choice } from '@/hooks/useComparisonChoice';
import { SiteGrid } from '@/components/ui/SiteGrid';

interface ComparisonViewProps {
  round: number;
  totalRounds: number;
  lower: number;
  higher: number;
  gapPercent: number;
  onChoose: (choice: Choice) => void;
  onExit: () => void;
  onRestart: () => void;
  canDetach: boolean;
  detached: boolean;
  onDetach: () => void;
  onReattach: () => void;
}

export function ComparisonView({
  round,
  totalRounds,
  lower,
  higher,
  gapPercent,
  onChoose,
  onExit,
  onRestart,
  canDetach,
  detached,
  onDetach,
  onReattach,
}: ComparisonViewProps) {
  const { selection, select: handleSelect } = useComparisonChoice(round, onChoose, onExit, detached ? null : window);

  return (
    <div className="tool-tone-sensitivity sensitivity-session relative isolate flex min-h-screen flex-col bg-base-bg">
      <SiteGrid />
      {/* Header */}
      <div className="border-b border-border nav-blur px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-2">
            {canDetach && !detached && (
              <button
                onClick={onDetach}
                title="Open in a small window that stays on top of your game"
                className="inline-flex items-center gap-1.5 rounded-lg border border-accent-purple/30 bg-accent-purple/10 px-3 py-1.5 text-sm font-medium text-accent-purple-light transition-all duration-200 hover:border-accent-purple/50 hover:bg-accent-purple/20 focus-ring"
              >
                <PictureInPicture2 className="h-4 w-4" />
                Detach
              </button>
            )}
            {round > 1 && (
              <button
                onClick={onRestart}
                title="Start again from round 1"
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-ink-muted transition-all duration-200 hover:bg-base-surface-2 hover:text-ink focus-ring"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="hidden sm:inline">Restart</span>
              </button>
            )}
            <button
              onClick={onExit}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-ink-muted transition-all duration-200 hover:bg-base-surface-2 hover:text-ink focus-ring"
            >
              <X className="h-4 w-4" />
              Exit
            </button>
          </div>
        </div>
      </div>

      {detached ? (
        <div className="flex flex-1 items-center justify-center px-4 py-16">
          <div className="max-w-sm text-center animate-fade-in">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-accent-purple/30 bg-accent-purple/10">
              <PictureInPicture2 className="h-6 w-6 text-accent-purple-light" />
            </div>
            <h2 className="mt-5 font-display text-2xl font-semibold tracking-tight text-ink">Test is in the floating window</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Round {round} / {totalRounds}. Switch back to your game; the small window stays on top so you can pick without alt-tabbing.
            </p>
            <p className="mt-3 text-xs text-ink-dim">
              Tip: this only shows above games running in borderless or windowed mode. In your game's video settings, set Display mode to "Borderless" or "Windowed fullscreen" (Alt+Enter often switches it). Exclusive fullscreen hides every other window, and no website can draw over it.
            </p>
            <Button variant="secondary" size="sm" className="mt-6" onClick={onReattach}>
              Bring it back here
            </Button>
          </div>
        </div>
      ) : (
        <>
      {/* Round info */}
      <div className="px-4 pt-10 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between">
            <p className="font-display text-sm font-semibold uppercase tracking-wider text-ink-muted">
              Round {round} / {totalRounds}
            </p>
            <p className="text-sm text-ink-dim">
              {totalRounds - round} remaining
            </p>
          </div>
          <ProgressBar
            current={round}
            total={totalRounds}
            className="mt-3"
          />
        </div>
      </div>

      {/* Comparison cards */}
      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <div className="mx-auto w-full max-w-3xl">
          <p className="mb-3 text-center text-base text-ink-muted animate-fade-in">
            Test both values in your game, then choose which felt better
          </p>
          <p className="mb-8 text-center text-xs text-ink-dim">
            Gap between values:{' '}
            <span className={cn('font-mono font-semibold', gapPercent < 4 ? 'text-accent-orange' : 'text-ink-muted')}>
              {gapPercent.toFixed(1)}%
            </span>
            {gapPercent < 4 && ' · very fine difference. "Felt the same" is a valid answer'}
          </p>
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <ComparisonCard
              label="LOW"
              value={lower}
              selected={selection === 'lower' || selection === 'same'}
              dimmed={selection === 'higher'}
              onClick={() => handleSelect('lower')}
            />
            <ComparisonCard
              label="HIGH"
              value={higher}
              selected={selection === 'higher' || selection === 'same'}
              dimmed={selection === 'lower'}
              onClick={() => handleSelect('higher')}
            />
          </div>

          {/* Action buttons */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6">
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={() => handleSelect('lower')}
              disabled={!!selection}
              className="h-14 text-base"
            >
              <ArrowLeft className="h-5 w-5" />
              Low Felt Better
            </Button>
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={() => handleSelect('higher')}
              disabled={!!selection}
              className="h-14 text-base"
            >
              High Felt Better
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="md"
            fullWidth
            onClick={() => handleSelect('same')}
            disabled={!!selection}
            className={cn('mt-3', selection === 'same' && 'text-accent-purple')}
          >
            <Equal className="h-4 w-4" />
            Felt the same: finish here
          </Button>

          <p className="mt-5 text-center text-xs text-ink-dim">
            Keyboard: <kbd className="font-mono">←</kbd> low ·{' '}
            <kbd className="font-mono">→</kbd> high ·{' '}
            <kbd className="font-mono">↓</kbd> or <kbd className="font-mono">S</kbd> same
          </p>
        </div>
      </div>
        </>
      )}
    </div>
  );
}

interface ComparisonCardProps {
  label: string;
  value: number;
  selected: boolean;
  dimmed: boolean;
  onClick: () => void;
}

function ComparisonCard({
  label,
  value,
  selected,
  dimmed,
  onClick,
}: ComparisonCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${label} sensitivity: ${formatSens(value)}`}
      aria-pressed={selected}
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border p-6 transition-all duration-200 focus-ring sm:p-10',
        'min-h-[200px] sm:min-h-[240px]',
        selected
          ? 'border-accent-purple bg-accent-purple/8 scale-[1.03] shadow-glow'
          : dimmed
            ? 'border-border bg-base-surface opacity-40'
            : 'border-border bg-base-surface shadow-card hover:border-white/12 hover:bg-base-surface-2 hover:-translate-y-[3px] hover:shadow-card-hover'
      )}
    >
      <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-ink-muted sm:text-sm">
        {label}
      </span>
      <span
        className={cn(
          'mt-3 font-mono text-4xl font-bold transition-colors sm:text-6xl',
          selected ? 'text-accent-purple' : 'text-ink'
        )}
      >
        {formatSens(value)}
      </span>
    </button>
  );
}
