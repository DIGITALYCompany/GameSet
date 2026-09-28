import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { Tool } from '@/types';
import { cn } from '@/utils/cn';

interface ToolCardProps {
  tool: Tool;
  className?: string;
}

function getIcon(name: string): React.FC<LucideProps> {
  const Icon = (Icons as unknown as Record<string, React.FC<LucideProps>>)[name];
  return Icon ?? Icons.Square;
}

export function ToolCard({ tool, className }: ToolCardProps) {
  const Icon = getIcon(tool.icon);
  const available = tool.status === 'available';

  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-md',
            available
              ? 'bg-accent-purple/10 text-accent-purple'
              : 'bg-base-surface-3 text-ink-dim'
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        {available ? (
          <span className="text-xs font-medium text-accent-purple">Available</span>
        ) : (
          <span className="text-xs font-medium text-ink-dim">Coming soon</span>
        )}
      </div>
      <h3 className="mt-4 font-display text-base font-semibold text-ink">
        {tool.name}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
        {tool.description}
      </p>
    </>
  );

  const cardClass = cn(
    'group flex flex-col rounded-lg border border-border bg-base-surface p-5 transition-colors duration-150',
    available
      ? 'hover:border-white/15 hover:bg-base-surface-2 cursor-pointer'
      : 'opacity-75',
    className
  );

  if (available) {
    return (
      <Link to={tool.route} className={cardClass}>
        {inner}
      </Link>
    );
  }

  return (
    <div className={cardClass} aria-disabled="true">
      {inner}
    </div>
  );
}
