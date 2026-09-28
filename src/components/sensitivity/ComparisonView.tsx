import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { formatSens } from '@/utils/calculations';
import { cn } from '@/utils/cn';

interface ComparisonViewProps {
  round: number;
  totalRounds: number;
  lower: number;
  higher: number;
  onLower: () => void;
  onHigher: () => void;
  onExit: () => void;
}

export function ComparisonView({
  round,
  totalRounds,
  lower,
  higher,
  onLower,
  onHigher,
  onExit,
}: ComparisonViewProps) {
  const [selection, setSelection] = useState<'lower' | 'higher' | null>(null);

  // Reset selection when round changes
  useEffect(() => {
    setSelection(null);
  }, [round]);

  const handleSelect = (choice: 'lower' | 'higher') => {
    if (selection) return; // Prevent double-selection during the delay
    setSelection(choice);
    // Brief confirmation before advancing
    window.setTimeout(() => {
      if (choice === 'lower') onLower();
      else onHigher();
    }, 350);
  };

  // Keyboard support: Arrow Left / L = lower, Arrow Right / H = higher
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'l') {
        e.preventDefault();
        handleSelect('lower');
      } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'h') {
        e.preventDefault();
        handleSelect('higher');
      } else if (e.key === 'Escape') {
        onExit();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection, round]);

  return (
    <div className="flex min-h-screen flex-col bg-base-bg">
      {/* Minimal focused header */}
      <div className="border-b border-border px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Logo size="sm" />
          <button
            onClick={onExit}
            className="text-sm text-ink-muted transition-colors hover:text-ink focus-ring rounded-md px-2 py-1"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Round info */}
      <div className="px-4 pt-8 sm:px-6">
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
      <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
        <div className="mx-auto w-full max-w-3xl">
          <p className="mb-6 text-center text-sm text-ink-muted">
            Test both values in your game, then choose which felt better
          </p>
          <div className="grid grid-cols-2 gap-3 sm:gap-5">
            {/* LOW */}
            <ComparisonCard
              label="LOW"
              value={lower}
              selected={selection === 'lower'}
              dimmed={selection === 'higher'}
              onClick={() => handleSelect('lower')}
              accent="left"
            />
            {/* HIGH */}
            <ComparisonCard
              label="HIGH"
              value={higher}
              selected={selection === 'higher'}
              dimmed={selection === 'lower'}
              onClick={() => handleSelect('higher')}
              accent="right"
            />
          </div>

          {/* Action buttons */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5">
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

          <p className="mt-4 text-center text-xs text-ink-dim">
            Keyboard: <kbd className="font-mono">←</kbd> or{' '}
            <kbd className="font-mono">L</kbd> for low ·{' '}
            <kbd className="font-mono">→</kbd> or{' '}
            <kbd className="font-mono">H</kbd> for high
          </p>
        </div>
      </div>
    </div>
  );
}

interface ComparisonCardProps {
  label: string;
  value: number;
  selected: boolean;
  dimmed: boolean;
  onClick: () => void;
  accent: 'left' | 'right';
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
        'flex flex-col items-center justify-center rounded-lg border p-6 transition-all duration-200 focus-ring sm:p-10',
        'min-h-[180px] sm:min-h-[220px]',
        selected
          ? 'border-accent-purple bg-accent-purple/5 scale-[1.02]'
          : dimmed
            ? 'border-border bg-base-surface opacity-40'
            : 'border-border bg-base-surface hover:border-white/15 hover:bg-base-surface-2'
      )}
    >
      <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-ink-muted sm:text-sm">
        {label}
      </span>
      <span
        className={cn(
          'mt-3 font-mono text-3xl font-bold transition-colors sm:text-5xl',
          selected ? 'text-accent-purple' : 'text-ink'
        )}
      >
        {formatSens(value)}
      </span>
    </button>
  );
}
