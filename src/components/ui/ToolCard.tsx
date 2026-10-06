import { Link } from 'react-router-dom';
import { Activity, ArrowUpRight, Bookmark, Calculator, Crosshair, Plus, Radar, Repeat, Ruler, Square, Target, Timer } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { Tool } from '@/types';
import { cn } from '@/utils/cn';
import { ToolArtwork } from './ToolArtwork';
import { useWorkspace } from '@/hooks/useWorkspace';

interface ToolCardProps {
  tool: Tool;
  className?: string;
}

const CATEGORY_LABEL: Record<Tool['category'], string> = {
  sensitivity: 'Sensitivity',
  aim: 'Aim',
  performance: 'Performance',
};

const CATEGORY_TONE: Record<Tool['category'], string> = {
  sensitivity: 'tool-tone-sensitivity',
  aim: 'tool-tone-aim',
  performance: 'tool-tone-performance',
};

function getIcon(name: string): React.FC<LucideProps> {
  const icons: Record<string, React.FC<LucideProps>> = { Activity, Calculator, Crosshair, Plus, Radar, Repeat, Ruler, Target, Timer };
  return icons[name] ?? Square;
}

export function ToolCard({ tool, className }: ToolCardProps) {
  const { data, toggleFavorite, status } = useWorkspace();
  const favorite = data.favorites.includes(tool.id);
  const Icon = getIcon(tool.icon);
  const available = tool.status === 'available';

  const inner = (
    <>
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-accent-purple/0 blur-3xl transition-colors duration-500 group-hover:bg-accent-purple/20" />
      <div className="relative flex items-start justify-between gap-3">
        <div
          className={cn(
            'tool-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-all duration-300 ease-smooth',
            available
              ? 'group-hover:scale-105'
              : 'border-white/[0.06] bg-white/[0.03] text-ink-dim'
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
        {available ? (
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.06] text-ink-dim transition-all duration-300 ease-smooth group-hover:border-white/20 group-hover:bg-white group-hover:text-black">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        ) : (
          <span className="rounded-full border border-white/[0.08] px-2.5 py-1 text-[11px] font-medium text-ink-dim">Soon</span>
        )}
      </div>
      <ToolArtwork id={tool.id} />
      <p className="relative mt-3 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
        {CATEGORY_LABEL[tool.category]}
      </p>
      <h3 className="relative mt-1 font-display text-lg font-semibold tracking-tight text-ink">{tool.name}</h3>
      <p className="relative mt-1.5 text-sm leading-relaxed text-ink-muted">{tool.description}</p>
    </>
  );

  const cardClass = cn(
    'tool-tile group relative flex flex-col overflow-hidden rounded-xl border bg-base-surface p-5 transition-all duration-300 ease-smooth focus-ring',
    CATEGORY_TONE[tool.category],
    available ? 'hover:-translate-y-1 hover:border-white/[0.12] hover:shadow-card-hover' : 'opacity-60',
    className
  );

  if (available) {
    return (
      <div className={cardClass}>
      <Link to={tool.route} className="block rounded-lg focus-ring">
        {inner}
      </Link>
      <button type="button" disabled={status === 'loading'} onClick={() => toggleFavorite(tool.id)} aria-pressed={favorite} aria-label={`${favorite ? 'Unpin' : 'Pin'} ${tool.name}`} className={cn('absolute right-16 top-5 flex h-8 w-8 items-center justify-center rounded-full border transition-colors focus-ring disabled:opacity-40', favorite ? 'border-accent-purple/40 bg-accent-purple/10 text-accent-purple-light' : 'border-white/[0.08] text-ink-muted hover:text-ink')}>
        <Bookmark className={cn('h-3.5 w-3.5', favorite && 'fill-current')} />
      </button>
      </div>
    );
  }

  return (
    <div className={cardClass} aria-disabled="true">
      {inner}
    </div>
  );
}
