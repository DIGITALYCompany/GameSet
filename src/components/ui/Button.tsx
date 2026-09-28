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
    'bg-accent-purple text-white hover:bg-accent-purple/90 active:bg-accent-purple/80 border-transparent',
  secondary:
    'bg-base-surface-2 text-ink hover:bg-base-surface-3 active:bg-base-surface-3 border-border',
  ghost:
    'bg-transparent text-ink-muted hover:text-ink hover:bg-base-surface-2 border-transparent',
  danger:
    'bg-transparent text-red-400 hover:bg-red-500/10 border-border hover:border-red-500/40',
};

const sizes: Record<Size, string> = {
  sm: 'text-sm px-3 py-2',
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
        'inline-flex items-center justify-center gap-2 rounded-md border font-medium transition-colors duration-150 focus-ring select-none',
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
