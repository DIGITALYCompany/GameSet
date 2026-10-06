import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Crosshair, Gamepad2, HeartOff, Lock, Plus, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GAMES } from '@/data/games';
import { EmptyState, GameMark, SectionHeader } from './AccountUI';

interface Props {
  followedIds: string[];
  testCounts: Record<string, number>;
  isPremium: boolean;
  onQuickStart: (gameId: string) => void;
  onUnfollow: (gameId: string) => Promise<boolean>;
}

const FREE_LIMIT = 3;

export function GamesSection({ followedIds, testCounts, isPremium, onQuickStart, onUnfollow }: Props) {
  const [error, setError] = useState(false);
  const games = GAMES.filter((g) => followedIds.includes(g.id));
  const atLimit = !isPremium && followedIds.length >= FREE_LIMIT;

  const unfollow = async (id: string) => {
    setError(!(await onUnfollow(id)));
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="My games"
        description={isPremium ? `${games.length} followed` : `${games.length} of ${FREE_LIMIT} followed on the Free plan`}
        action={
          <Link to="/games">
            <Button variant="secondary" size="sm">
              <Plus className="h-4 w-4" />
              Add games
            </Button>
          </Link>
        }
      />

      {!isPremium && (
        <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent-purple-light to-accent-purple transition-all duration-500 ease-smooth"
            style={{ width: `${Math.min(100, (followedIds.length / FREE_LIMIT) * 100)}%` }}
          />
        </div>
      )}

      {error && <p role="alert" className="text-sm text-accent-red">Could not update your games. Please try again.</p>}

      {games.length === 0 ? (
        <EmptyState
          icon={Gamepad2}
          title="You are not following any games"
          text="Follow the games you play to get one-click access to their tests and tools."
          action={
            <Link to="/games">
              <Button variant="primary" size="sm">Browse games</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {games.map((game) => {
            const count = testCounts[game.id] || 0;
            return (
              <div
                key={game.id}
                className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.015] p-4 transition-all duration-300 ease-smooth hover:border-white/[0.12] hover:bg-white/[0.03]"
              >
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-60"
                  style={{ background: `linear-gradient(90deg, transparent, ${game.color}, transparent)` }}
                />
                <div className="flex items-center gap-3">
                  <GameMark name={game.name} color={game.color} />
                  <div className="min-w-0 flex-1">
                    <Link to={`/games/${game.slug}`} className="block truncate text-sm font-semibold text-ink hover:underline">
                      {game.name}
                    </Link>
                    <p className="text-xs text-ink-dim">{count ? `${count} saved test${count > 1 ? 's' : ''}` : 'No tests yet'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => unfollow(game.id)}
                    className="rounded-lg p-2 text-ink-dim opacity-100 transition-all hover:bg-accent-red/10 hover:text-accent-red focus-ring sm:opacity-0 sm:group-hover:opacity-100"
                    aria-label={`Unfollow ${game.name}`}
                    title="Unfollow"
                  >
                    <HeartOff className="h-4 w-4" />
                  </button>
                </div>
                <Button variant="secondary" size="sm" fullWidth className="mt-4" onClick={() => onQuickStart(game.id)}>
                  <Crosshair className="h-4 w-4" />
                  Start sensitivity test
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {atLimit && (
        <div className="flex flex-col gap-4 rounded-xl border border-accent-purple/20 bg-accent-purple/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Lock className="mt-0.5 h-4 w-4 text-accent-purple-light" />
            <div>
              <p className="text-sm font-semibold text-ink">Free plan limit reached</p>
              <p className="mt-0.5 text-sm text-ink-muted">Upgrade to Pro to follow as many games as you like.</p>
            </div>
          </div>
          <Link to="/pricing">
            <Button variant="primary" size="sm">
              <Zap className="h-4 w-4" />
              Upgrade
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
