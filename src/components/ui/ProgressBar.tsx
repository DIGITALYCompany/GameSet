import { cn } from '@/utils/cn';

interface ProgressBarProps {
  /** Current progress (1-indexed) */
  current: number;
  /** Total steps */
  total: number;
  className?: string;
}

export function ProgressBar({ current, total, className }: ProgressBarProps) {
  const pct = Math.min(100, (current / total) * 100);

  return (
    <div
      className={cn(
        'h-1 w-full overflow-hidden rounded-full bg-base-surface-3',
        className
      )}
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`Round ${current} of ${total}`}
    >
      <div
        className="h-full rounded-full bg-accent-purple transition-all duration-300 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
