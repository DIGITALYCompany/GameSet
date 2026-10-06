import { cn } from '@/utils/cn';
import { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

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
  type,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id || props.name || generatedId;
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password';
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
          type={isPassword && visible ? 'text' : type}
          className={cn(
            'w-full rounded-lg border border-white/[0.08] bg-black/30 px-4 py-2.5 text-ink shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] hover:border-white/[0.14]',
            'placeholder:text-ink-dim transition-all duration-200',
            'focus:border-accent-purple/60 focus:outline-none focus:ring-2 focus:ring-accent-purple/20 focus:bg-base-surface-3',
            (suffix || isPassword) && 'pr-14',
            error && 'border-accent-red/50 focus:border-accent-red focus:ring-accent-red/20',
            className
          )}
          {...props}
        />
        {isPassword && (
          <button type="button" disabled={props.disabled} aria-label={visible ? 'Hide password' : 'Show password'} aria-pressed={visible} aria-controls={inputId} onClick={() => setVisible(value => !value)} className="focus-ring absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-ink-dim hover:bg-white/5 hover:text-ink disabled:opacity-40">
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
        {suffix && !isPassword && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-ink-dim">
            {suffix}
          </span>
        )}
      </div>
      {error && <span className="text-xs text-accent-red">{error}</span>}
    </div>
  );
}
