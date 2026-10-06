import { Pause, Play, RotateCcw } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SessionControlsProps {
  paused?: boolean;
  onTogglePause?: () => void;
  onReset: () => void;
  className?: string;
}

const buttonClass =
  'inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition-all duration-200 focus-ring';

export function SessionControls({ paused, onTogglePause, onReset, className }: SessionControlsProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {onTogglePause && (
        <button
          type="button"
          onClick={onTogglePause}
          title={paused ? 'Resume (P)' : 'Pause (P or Esc)'}
          className={cn(
            buttonClass,
            paused
              ? 'border-accent-purple/40 bg-accent-purple/15 text-accent-purple-light hover:bg-accent-purple/25'
              : 'border-white/[0.08] bg-white/[0.03] text-ink hover:border-white/15 hover:bg-white/[0.06]'
          )}
        >
          {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          {paused ? 'Resume' : 'Pause'}
        </button>
      )}
      <button
        type="button"
        onClick={onReset}
        title="Restart from zero (R)"
        className={cn(buttonClass, 'border-white/[0.08] bg-white/[0.03] text-ink-muted hover:border-white/15 hover:text-ink')}
      >
        <RotateCcw className="h-4 w-4" />
        Restart
      </button>
    </div>
  );
}

export function PausedOverlay({ onResume, onReset }: { onResume: () => void; onReset: () => void }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-base-bg/75 text-center backdrop-blur-sm animate-fade-in">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
        <Pause className="h-6 w-6 text-ink" />
      </span>
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent-purple-light">Paused</p>
        <p className="mt-1 text-sm text-ink-muted">Your progress is kept. Press P to resume.</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onResume(); }}
          className="btn-shine inline-flex h-10 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-base-bg transition-transform duration-200 hover:scale-[1.02] focus-ring"
        >
          <Play className="h-4 w-4" />
          Resume
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onReset(); }}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-ink transition-colors hover:bg-white/[0.08] focus-ring"
        >
          <RotateCcw className="h-4 w-4" />
          Restart
        </button>
      </div>
    </div>
  );
}
