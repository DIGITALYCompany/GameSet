import { cn } from '@/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  suffix?: string;
  error?: string;
}

export function Input({
  label,
  suffix,
  error,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-ink-muted"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          className={cn(
            'w-full rounded-md border border-border bg-base-surface-2 px-4 py-2.5 text-ink',
            'placeholder:text-ink-dim transition-colors duration-150',
            'focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple',
            suffix && 'pr-14',
            error && 'border-red-500/50',
            className
          )}
          {...props}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-ink-dim">
            {suffix}
          </span>
        )}
      </div>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
