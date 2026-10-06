import { GameIcon } from './GameIcon';
import { GAME_ASSETS } from '@/data/gameAssets';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Heart, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { GameConfig } from '@/types';

interface Props {
  game: GameConfig;
  followed: boolean;
  busy: boolean;
  onToggleFollow: () => void;
}

export function GameCard({ game, followed, busy, onToggleFollow }: Props) {
  const rec = game.recommendedRange;

  return (
    <article className="arena-game group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] transition-all duration-300 ease-smooth hover:-translate-y-1 hover:shadow-card-hover" style={{ '--game-color': game.color } as React.CSSProperties}>
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
        style={{ backgroundColor: game.color }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${game.color}, transparent)` }}
      />

      <div className="game-card-cover relative isolate flex items-start justify-between overflow-hidden p-5">
        <img src={GAME_ASSETS[game.id].artwork} alt="" loading="lazy" className="game-card-image pointer-events-none absolute inset-0 z-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div aria-hidden="true" className="game-card-shade pointer-events-none absolute -inset-px z-10" />
        <GameIcon gameId={game.id} className="relative z-20 h-12 w-12" />
        <button
          type="button"
          onClick={onToggleFollow}
          disabled={busy}
          aria-pressed={followed}
          aria-label={followed ? `Unfollow ${game.name}` : `Follow ${game.name}`}
          className={cn(
            'relative z-20 inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-all duration-200 focus-ring',
            followed
              ? 'border-accent-purple/40 bg-accent-purple/15 text-accent-purple-light hover:bg-accent-purple/25'
              : 'border-white/25 bg-black/55 text-white backdrop-blur-sm hover:border-white/40 hover:bg-black/70'
          )}
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Heart className={cn('h-3.5 w-3.5', followed && 'fill-current')} />}
          {followed ? 'Following' : 'Follow'}
        </button>
      </div>

      <Link to={`/games/${game.slug}`} className="relative flex flex-1 flex-col p-5 focus-ring rounded-b-2xl">
        <span className="absolute inset-0" aria-hidden="true" />
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: game.color }}>
          {game.genre}
        </p>
        <h3 className="mt-1.5 flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-ink">
          {game.name}
          <ArrowUpRight className="h-4 w-4 text-ink-dim transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-muted">{game.tagline}</p>

        <dl className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.06]">
          <Spec label="Range" value={game.sensDisplay} />
          <Spec label="Sweet spot" value={`${rec.min} to ${rec.max}`} />
          <Spec label="Example sens" value={`${game.defaultSens}${game.sensUnit || ''}`} />
        </dl>
      </Link>
    </article>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-base-surface px-3 py-2.5">
      <dt className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-dim">{label}</dt>
      <dd className="mt-0.5 truncate font-mono text-xs tabular-nums text-ink">{value}</dd>
    </div>
  );
}
