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
        'card-sheen relative rounded-xl border border-border bg-base-surface shadow-card transition-all duration-300 ease-smooth',
        !noPadding && 'p-6',
        hover &&
          'hover:border-white/10 hover:bg-base-surface-2 hover:-translate-y-[3px] hover:shadow-card-hover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
