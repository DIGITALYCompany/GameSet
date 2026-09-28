import { cn } from '@/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  noPadding?: boolean;
}

export function Card({
  className,
  hover,
  noPadding,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-base-surface',
        !noPadding && 'p-6',
        hover &&
          'transition-colors duration-150 hover:border-white/15 hover:bg-base-surface-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
