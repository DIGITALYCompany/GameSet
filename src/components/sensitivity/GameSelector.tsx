import { GameIcon } from '@/components/games/GameIcon';
import { GAMES } from '@/data/games';
import type { GameConfig } from '@/types';
import { cn } from '@/utils/cn';

interface GameSelectorProps {
  selectedId: string | null;
  onSelect: (game: GameConfig) => void;
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
              'flex items-center gap-3 rounded-lg border p-3 text-left transition-all duration-200 focus-ring',
              active
                ? 'border-accent-purple bg-accent-purple/5 shadow-glow-sm'
                : 'border-border bg-base-surface hover:border-white/15 hover:bg-base-surface-2'
            )}
          >
            <GameIcon gameId={game.id} />
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
                <span className="text-ink-dim/70">Sensitivity scale: </span>
                {game.sensDisplay}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
