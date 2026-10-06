import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Crosshair, Gauge, Search, SlidersHorizontal, Target } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ToolCard } from '@/components/ui/ToolCard';
import { TOOLS } from '@/data/tools';
import { cn } from '@/utils/cn';
import type { ToolCategory } from '@/types';

const CATEGORIES: { id: ToolCategory; label: string; blurb: string; icon: LucideIcon }[] = [
  { id: 'sensitivity', label: 'Sensitivity', blurb: 'Find it, then carry it to every game.', icon: SlidersHorizontal },
  { id: 'aim', label: 'Aim training', blurb: 'Flicks, tracking and the crosshair you aim with.', icon: Target },
  { id: 'performance', label: 'Reflexes & hardware', blurb: 'Measure yourself and check your gear.', icon: Gauge },
];

const FEATURED_ID = 'sensitivity-finder';

export function ToolsPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ToolCategory | 'all'>('all');

  const featured = TOOLS.find((t) => t.id === FEATURED_ID);
  const q = query.trim().toLowerCase();
  const filtering = q.length > 0 || category !== 'all';
  const matches = TOOLS.filter(
    (t) =>
      t.status === 'available' &&
      (filtering || t.id !== FEATURED_ID) &&
      (category === 'all' || t.category === category) &&
      (!q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
  );

  return (
    <Layout>
      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(ellipse_at_top,rgba(142,59,255,0.12),transparent_70%)]" />

        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pt-16">
          <header className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-purple-light">
              {TOOLS.length} tools · free to use
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Build your edge.
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-ink-muted">
              Your pre-game ritual starts here. Dial in your settings, warm up your aim and get to know your gear.
            </p>
          </header>

          {featured && !filtering && (
            <Link
              to={featured.route}
              className="group border-gradient relative mt-10 block overflow-hidden rounded-2xl transition-all duration-300 ease-smooth hover:-translate-y-1 hover:shadow-glow focus-ring"
            >
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent-purple/20 blur-3xl" />
              <div className="relative grid gap-8 p-6 sm:p-10 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-purple-light">Start here</p>
                  <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{featured.name}</h2>
                  <p className="mt-3 max-w-lg text-base leading-relaxed text-ink-muted">
                    {featured.description} Pick between two values each round until the right one is obvious.
                  </p>
                  <span className="btn-shine mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition-shadow duration-300 group-hover:shadow-[0_10px_30px_-10px_rgba(255,255,255,0.5)]">
                    Find my sensitivity
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </div>
                <div className="relative mx-auto hidden h-40 w-40 items-center justify-center md:flex" aria-hidden="true">
                  <span className="absolute inset-0 rounded-full border border-accent-purple/20" />
                  <span className="absolute inset-6 rounded-full border border-accent-purple/30" />
                  <span className="absolute inset-12 rounded-full border border-accent-purple/40 transition-transform duration-500 group-hover:scale-110" />
                  <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-accent-purple/40 to-transparent" />
                  <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-accent-purple/40 to-transparent" />
                  <Crosshair className="h-9 w-9 text-accent-purple-light" />
                </div>
              </div>
            </Link>
          )}

          <div className="sticky top-20 z-20 -mx-4 mt-10 px-4 py-3 backdrop-blur-xl sm:mx-0 sm:rounded-2xl sm:border sm:border-white/[0.06] sm:bg-base-bg/70 sm:px-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <label className="relative flex-1 lg:max-w-xs">
                <span className="sr-only">Search tools</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-dim" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search tools"
                  className="h-10 w-full rounded-lg border border-white/[0.08] bg-black/30 pl-9 pr-3 text-sm text-ink placeholder:text-ink-dim transition-colors hover:border-white/[0.14] focus:border-accent-purple/50 focus:outline-none"
                />
              </label>
              <div className="flex gap-1.5 overflow-x-auto" role="tablist" aria-label="Filter by category">
                <Chip active={category === 'all'} onClick={() => setCategory('all')}>All</Chip>
                {CATEGORIES.map((c) => (
                  <Chip key={c.id} active={category === c.id} onClick={() => setCategory(c.id)}>
                    <c.icon className="h-3.5 w-3.5" />
                    {c.label}
                  </Chip>
                ))}
              </div>
            </div>
          </div>

          {matches.length === 0 ? (
            <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-white/10 px-6 py-16 text-center">
              <Search className="h-6 w-6 text-ink-dim" />
              <p className="mt-4 text-sm font-semibold text-ink">No tools match your search</p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setCategory('all');
                }}
                className="mt-3 rounded text-sm font-medium text-accent-purple-light hover:underline focus-ring"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="mt-10 space-y-14">
              {CATEGORIES.map(({ id, label, blurb }, index) => {
                const tools = matches.filter((t) => t.category === id);
                if (tools.length === 0) return null;
                return (
                  <section key={id} className="animate-fade-in">
                    <div className="mb-5 flex items-end justify-between gap-4 border-b border-white/[0.06] pb-4">
                      <div>
                        <h2 className="font-display text-xl font-semibold tracking-tight text-ink">{label}</h2>
                        <p className="mt-0.5 text-sm text-ink-dim">{blurb}</p>
                      </div>
                      <span className="font-mono text-xs text-ink-dim">0{index + 1}</span>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {tools.map((tool) => (
                        <ToolCard key={tool.id} tool={tool} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'inline-flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border px-3.5 text-sm font-medium transition-all duration-200 focus-ring',
        active
          ? 'border-white/15 bg-white/[0.08] text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
          : 'border-transparent text-ink-muted hover:bg-white/[0.04] hover:text-ink'
      )}
    >
      {children}
    </button>
  );
}
