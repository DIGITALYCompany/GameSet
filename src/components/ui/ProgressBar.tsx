import { cn } from '@/utils/cn';

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export function ProgressBar({ current, total, className }: ProgressBarProps) {
  const pct = Math.min(100, (current / total) * 100);

  return (
    <div
      className={cn(
        'h-1.5 w-full overflow-hidden rounded-full bg-base-surface-3',
        className
      )}
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`Round ${current} of ${total}`}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-accent-purple to-accent-magenta transition-all duration-500 ease-smooth shadow-sm shadow-accent-purple/30"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
