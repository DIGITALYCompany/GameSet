import { GAMES } from '@/data/games';
import type { GameConfig } from '@/types';
import { cn } from '@/utils/cn';

interface GameSelectorProps {
  selectedId: string | null;
  onSelect: (game: GameConfig) => void;
}

/** Compact game initials badge — avoids needing image assets. */
function GameBadge({ name }: { name: string }) {
  const initials = name
    .split(/[\s/]+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-base-surface-3 font-display text-sm font-bold text-ink-muted">
      {initials}
    </div>
  );
}

export function GameSelector({ selectedId, onSelect }: GameSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {GAMES.map((game) => {
        const active = game.id === selectedId;
        return (
          <button
            key={game.id}
            type="button"
            onClick={() => onSelect(game)}
            aria-pressed={active}
            className={cn(
              'flex items-center gap-3 rounded-md border p-3 text-left transition-colors duration-150 focus-ring',
              active
                ? 'border-accent-purple bg-accent-purple/5'
                : 'border-border bg-base-surface hover:border-white/15 hover:bg-base-surface-2'
            )}
          >
            <GameBadge name={game.name} />
            <div className="min-w-0">
              <p
                className={cn(
                  'truncate text-sm font-medium',
                  active ? 'text-ink' : 'text-ink-muted'
                )}
              >
                {game.name}
              </p>
              <p className="text-xs text-ink-dim">
                {game.sensRange.min}–{game.sensRange.max}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
