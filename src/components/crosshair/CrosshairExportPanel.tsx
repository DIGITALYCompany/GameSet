import { GameIcon } from '@/components/games/GameIcon';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GAMES } from '@/data/games';
import { Check, Copy, Terminal, KeyRound, ListChecks } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { CrosshairColor, CrosshairExport } from '@/data/crosshairConfigs';
import type { CrosshairShape } from '@/lib/crosshairCodes';

const KIND_ICON = { code: KeyRound, console: Terminal, manual: ListChecks } as const;

export function CrosshairExportPanel({
  exports,
  shape,
  color,
  gameName,
}: {
  exports: CrosshairExport[];
  shape: CrosshairShape;
  color: CrosshairColor | null;
  gameName: string;
}) {
  const [activeId, setActiveId] = useState(exports[0].id);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const active = exports.find((e) => e.id === activeId) ?? exports[0];
  const output = active.generate(shape, color);
  const game = GAMES.find(item => item.name === gameName);

  useEffect(() => {
    setCopied(false);
    setCopyError(false);
  }, [output]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setCopyError(false);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopyError(true);
    }
  };

  return (
    <div className="border-gradient overflow-hidden rounded-2xl bg-base-surface shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-dim"><GameIcon gameName={gameName} size="xs" className="mr-2" />Export to {gameName}</p>
          <h3 className="mt-1 font-display text-lg font-semibold text-ink">
            {active.kind === 'manual' ? 'Copy the menu values' : 'Paste it straight into the game'}
          </h3>
        </div>
        {exports.length > 1 && (
          <div className="flex rounded-lg border border-border bg-base-surface-2 p-1">
            {exports.map((e) => {
              const Icon = KIND_ICON[e.kind];
              return (
                <button
                  key={e.id}
                  onClick={() => setActiveId(e.id)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-200 focus-ring',
                    active.id === e.id ? 'bg-base-surface-3 text-ink shadow-card' : 'text-ink-muted hover:text-ink'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {e.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-5">
        {game && <Link to={`/setup?${new URLSearchParams({ game: game.id, crosshair: output }).toString()}`} className="mb-4 inline-flex items-center gap-2 rounded text-xs text-accent-purple-light focus-ring">Add this crosshair to my setup</Link>}
        <div className="group relative rounded-xl border border-border bg-black/40">
          <pre
            className={cn(
              'max-h-64 overflow-auto p-4 pr-28 font-mono text-[13px] leading-relaxed text-accent-green',
              active.kind === 'manual' ? 'whitespace-pre text-ink' : 'whitespace-pre-wrap break-all'
            )}
          >
            {output}
          </pre>
          <button
            onClick={copy}
            className={cn(
              'absolute right-3 top-3 flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 focus-ring',
              copied
                ? 'bg-accent-green text-black shadow-glow-sm'
                : 'bg-white text-black hover:-translate-y-px hover:shadow-glow-sm'
            )}
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        {copyError && (
          <p className="mt-2 text-xs text-accent-red">Couldn't copy automatically. Select the text above and copy it manually.</p>
        )}

        <ol className="mt-5 space-y-2.5">
          {active.steps.map((step, i) => (
            <li key={step} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-base-surface-2 font-mono text-[11px] font-semibold text-ink">
                {i + 1}
              </span>
              <span className="pt-0.5 text-sm leading-relaxed text-ink-muted">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
