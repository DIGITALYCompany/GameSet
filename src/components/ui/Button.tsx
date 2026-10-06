import { cn } from '@/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    'btn-shine bg-gradient-to-b from-accent-purple-light to-accent-purple text-white border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_10px_30px_-10px_rgba(142,59,255,0.6)] hover:-translate-y-px hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_16px_40px_-12px_rgba(142,59,255,0.75)]',
  secondary:
    'bg-white/[0.04] text-ink border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:bg-white/[0.07] hover:border-white/[0.14] active:bg-white/[0.09]',
  ghost:
    'bg-transparent text-ink-muted hover:text-ink hover:bg-base-surface-2 border-transparent',
  danger:
    'bg-transparent text-accent-red hover:bg-accent-red/10 border-border hover:border-accent-red/40',
};

const sizes: Record<Size, string> = {
  sm: 'text-sm px-3.5 py-2',
  md: 'text-sm px-4 py-2.5',
  lg: 'text-base px-6 py-3',
  xl: 'text-lg px-8 py-4',
};

export function Button({
  variant = 'secondary',
  size = 'md',
  fullWidth,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg border font-medium transition-all duration-200 ease-smooth focus-ring select-none',
        'active:scale-[0.98] disabled:active:scale-100',
        'disabled:opacity-40 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
