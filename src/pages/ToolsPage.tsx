import { ToolCard } from '@/components/ui/ToolCard';
import { TOOLS } from '@/data/tools';

export function ToolsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Tools
        </h1>
        <p className="mt-2 max-w-xl text-base text-ink-muted">
          The GAMESET toolkit — sensitivity tools are available now, with more
          on the way.
        </p>
      </div>

      {/* Tool grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
