import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Search, X } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { AuthModal } from '@/components/auth/AuthModal';
import { GameCard } from '@/components/games/GameCard';
import { GAMES } from '@/data/games';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { cn } from '@/utils/cn';

const FREE_FOLLOW_LIMIT = 3;
const ALL = 'All';

export function GamesPage() {
  const { user } = useAuth();
  const [followed, setFollowed] = useState<Set<string>>(new Set());
  const [isPremium, setIsPremium] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<'limit' | 'error' | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState(ALL);
  const [onlyFollowed, setOnlyFollowed] = useState(false);

  const load = useCallback(async () => {
    if (!user) {
      setFollowed(new Set());
      return;
    }
    const [games, profile] = await Promise.all([
      supabase.from('user_games').select('game_id').eq('user_id', user.id),
      supabase.from('profiles').select('subscription_tier').eq('id', user.id).maybeSingle(),
    ]);
    if (games.data) setFollowed(new Set(games.data.map((d: { game_id: string }) => d.game_id)));
    setIsPremium(Boolean(profile.data && profile.data.subscription_tier !== 'free'));
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const genres = useMemo(() => [ALL, ...new Set(GAMES.map((g) => g.genre))], []);

  const visible = GAMES.filter((g) => {
    if (genre !== ALL && g.genre !== genre) return false;
    if (onlyFollowed && !followed.has(g.id)) return false;
    const q = query.trim().toLowerCase();
    return !q || g.name.toLowerCase().includes(q) || g.genre.toLowerCase().includes(q);
  });

  const toggleFollow = async (gameId: string) => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    const isFollowed = followed.has(gameId);
    if (!isFollowed && !isPremium && followed.size >= FREE_FOLLOW_LIMIT) {
      setNotice('limit');
      return;
    }
    setBusyId(gameId);
    setNotice(null);
    const { error } = isFollowed
      ? await supabase.from('user_games').delete().eq('user_id', user.id).eq('game_id', gameId)
      : await supabase.from('user_games').insert({ game_id: gameId });
    setBusyId(null);
    if (error) {
      setNotice(error.message.includes('follow_limit_reached') ? 'limit' : 'error');
      return;
    }
    setFollowed((prev) => {
      const next = new Set(prev);
      if (isFollowed) next.delete(gameId);
      else next.add(gameId);
      return next;
    });
  };

  const resetFilters = () => {
    setQuery('');
    setGenre(ALL);
    setOnlyFollowed(false);
  };

  return (
    <Layout>
      <div className="relative">

        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pt-16">
          <header className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-purple-light">
              {GAMES.length} games supported
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Find your home arena.
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-ink-muted">
              Sensitivity ranges, pro settings and the right tools for every title. Follow the ones you play to keep them one click away.
            </p>
          </header>

          <div className="sticky top-20 z-20 -mx-4 mt-10 px-4 py-3 backdrop-blur-xl sm:mx-0 sm:rounded-2xl sm:border sm:border-white/[0.06] sm:bg-base-bg/70 sm:px-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <label className="relative flex-1 lg:max-w-xs">
                <span className="sr-only">Search games</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-dim" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search games"
                  className="h-10 w-full rounded-lg border border-white/[0.08] bg-black/30 pl-9 pr-3 text-sm text-ink placeholder:text-ink-dim transition-colors hover:border-white/[0.14] focus:border-accent-purple/50 focus:outline-none"
                />
              </label>
              <div className="flex gap-1.5 overflow-x-auto" role="tablist" aria-label="Filter by genre">
                {genres.map((g) => (
                  <FilterChip key={g} active={genre === g} onClick={() => setGenre(g)}>
                    {g}
                  </FilterChip>
                ))}
                {user && (
                  <FilterChip active={onlyFollowed} onClick={() => setOnlyFollowed((v) => !v)}>
                    Following · {followed.size}
                  </FilterChip>
                )}
              </div>
            </div>
          </div>

          {notice && (
            <div
              role="alert"
              className={cn(
                'mt-6 flex flex-col gap-3 rounded-xl border px-4 py-3 text-sm animate-fade-in sm:flex-row sm:items-center sm:justify-between',
                notice === 'limit' ? 'border-accent-purple/25 bg-accent-purple/[0.07]' : 'border-accent-red/25 bg-accent-red/[0.06]'
              )}
            >
              <span className="flex items-center gap-2 text-ink">
                {notice === 'limit' && <Lock className="h-4 w-4 text-accent-purple-light" />}
                {notice === 'limit'
                  ? `The Free plan lets you follow up to ${FREE_FOLLOW_LIMIT} games.`
                  : 'Could not update your games. Please try again.'}
              </span>
              <div className="flex items-center gap-3">
                {notice === 'limit' && (
                  <Link to="/pricing" className="font-semibold text-accent-purple-light hover:underline">
                    Upgrade to Pro
                  </Link>
                )}
                <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss" className="rounded p-1 text-ink-dim hover:text-ink focus-ring">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {visible.length === 0 ? (
            <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-white/10 px-6 py-16 text-center">
              <Search className="h-6 w-6 text-ink-dim" />
              <p className="mt-4 text-sm font-semibold text-ink">No games match your filters</p>
              <button type="button" onClick={resetFilters} className="mt-3 text-sm font-medium text-accent-purple-light hover:underline focus-ring rounded">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  followed={followed.has(game.id)}
                  busy={busyId === game.id}
                  onToggleFollow={() => toggleFollow(game.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </Layout>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'h-10 shrink-0 whitespace-nowrap rounded-lg border px-3.5 text-sm font-medium transition-all duration-200 focus-ring',
        active
          ? 'border-white/15 bg-white/[0.08] text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
          : 'border-transparent text-ink-muted hover:bg-white/[0.04] hover:text-ink'
      )}
    >
      {children}
    </button>
  );
}
