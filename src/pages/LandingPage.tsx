import { Link } from 'react-router-dom';
import { ArrowRight, Crosshair, Layers } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ToolCard } from '@/components/ui/ToolCard';
import { getAvailableTools, getComingSoonTools } from '@/data/tools';
import { ProgressBar } from '@/components/ui/ProgressBar';

export function LandingPage() {
  const availableTools = getAvailableTools();
  const comingSoon = getComingSoonTools().slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-md border border-border bg-base-surface px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-purple" />
                <span className="text-xs font-medium text-ink-muted">
                  GAMESET Beta
                </span>
              </div>

              <h1 className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">
                Find your perfect
                <br />
                <span className="text-accent-purple">sensitivity.</span>
              </h1>

              <p className="mt-5 max-w-md text-base leading-relaxed text-ink-muted sm:text-lg">
                Test, compare and fine-tune your FPS sensitivity with a
                structured calibration process.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/sensitivity">
                  <Button variant="primary" size="lg">
                    <Crosshair className="h-5 w-5" />
                    Find My Sensitivity
                  </Button>
                </Link>
                <Link to="/tools">
                  <Button variant="secondary" size="lg">
                    <Layers className="h-5 w-5" />
                    Explore Tools
                  </Button>
                </Link>
              </div>
            </div>

            {/* Preview card */}
            <div className="hidden lg:block">
              <PreviewCard />
            </div>
          </div>
        </div>
      </section>

      {/* Preview card on mobile */}
      <section className="border-b border-border px-4 py-8 lg:hidden sm:px-6">
        <PreviewCard />
      </section>

      {/* Available tools */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
              Available now
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              Tools you can use right now, with more on the way.
            </p>
          </div>
          <Link to="/tools" className="hidden shrink-0 text-sm font-medium text-accent-purple transition-colors hover:text-accent-magenta sm:block">
            View all tools →
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {availableTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* Coming tools */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 border-t border-border">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
              Coming tools
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              GAMESET is built to grow into a complete gaming toolkit.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {comingSoon.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>
    </div>
  );
}

function PreviewCard() {
  return (
    <Card noPadding className="overflow-hidden">
      {/* Mock Sensitivity Finder interface */}
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center justify-between">
          <span className="font-display text-sm font-bold tracking-tight text-ink">
            Sensitivity Finder
          </span>
          <span className="text-xs text-ink-dim">Round 3 / 7</span>
        </div>
        <ProgressBar current={3} total={7} className="mt-3" />
      </div>
      <div className="grid grid-cols-2 gap-3 p-5">
        <div className="flex flex-col items-center justify-center rounded-md border border-border bg-base-surface-2 py-8">
          <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-ink-muted">
            Low
          </span>
          <span className="mt-2 font-mono text-3xl font-bold text-ink">
            0.420
          </span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-md border border-accent-purple/40 bg-accent-purple/5 py-8">
          <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-accent-purple">
            High
          </span>
          <span className="mt-2 font-mono text-3xl font-bold text-accent-purple">
            0.560
          </span>
        </div>
      </div>
      <div className="px-5 pb-5">
        <div className="flex items-center gap-2 rounded-md border border-border bg-base-surface-2 px-4 py-3">
          <ArrowRight className="h-4 w-4 text-ink-muted" />
          <span className="text-sm text-ink-muted">
            Choose which sensitivity felt better
          </span>
        </div>
      </div>
    </Card>
  );
}
