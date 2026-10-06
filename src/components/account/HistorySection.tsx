import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Crosshair, Target, Trash2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GAMES } from '@/data/games';
import { formatDateTime } from '@/utils/helpers';
import { round } from '@/utils/calculations';
import { cn } from '@/utils/cn';
import type { AimTrainingScore } from '@/types';
import { EmptyState, GameMark, type CloudTest } from './AccountUI';

interface Props {
  tests: CloudTest[];
  aimScores: AimTrainingScore[];
  isPremium: boolean;
  onDeleteTest: (id: string) => Promise<boolean>;
}

type View = 'sensitivity' | 'aim';

export function HistorySection({ tests, aimScores, isPremium, onDeleteTest }: Props) {
  const [view, setView] = useState<View>('sensitivity');
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const remove = async (id: string) => {
    const ok = await onDeleteTest(id);
    setError(!ok);
    setConfirmId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight text-ink">History</h2>
          <p className="mt-1 text-sm text-ink-muted">Every result you have saved to your account.</p>
        </div>
        <div className="inline-flex rounded-lg border border-white/[0.08] bg-white/[0.02] p-1" role="tablist">
          {(['sensitivity', 'aim'] as View[]).map((v) => (
            <button
              key={v}
              type="button"
              role="tab"
              aria-selected={view === v}
              onClick={() => setView(v)}
              className={cn(
                'rounded-md px-3.5 py-1.5 text-sm font-medium transition-all duration-200 focus-ring',
                view === v ? 'bg-white/[0.08] text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]' : 'text-ink-muted hover:text-ink'
              )}
            >
              {v === 'sensitivity' ? `Sensitivity · ${tests.length}` : `Aim · ${aimScores.length}`}
            </button>
          ))}
        </div>
      </div>

      {error && <p role="alert" className="text-sm text-accent-red">Could not delete that result. Please try again.</p>}

      {view === 'sensitivity' &&
        (tests.length === 0 ? (
          <EmptyState
            icon={Crosshair}
            title="No saved tests"
            text="Finish a sensitivity test and save it to see it here."
            action={
              <Link to="/sensitivity">
                <Button variant="primary" size="sm">Start a test</Button>
              </Link>
            }
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-white/[0.06]">
            <div className="hidden grid-cols-[1fr_90px_90px_90px_48px] gap-4 border-b border-white/[0.06] bg-white/[0.02] px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-dim sm:grid">
              <span>Game</span>
              <span className="text-right">Sens</span>
              <span className="text-right">eDPI</span>
              <span className="text-right">cm/360</span>
              <span />
            </div>
            <ul className="divide-y divide-white/[0.06]">
              {tests.map((t) => {
                const game = GAMES.find((g) => g.id === t.game_id);
                const confirming = confirmId === t.id;
                return (
                  <li
                    key={t.id}
                    className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 px-4 py-3.5 transition-colors hover:bg-white/[0.02] sm:grid-cols-[1fr_90px_90px_90px_48px]"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <GameMark name={t.game_name} color={game?.color} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink">{t.game_name}</p>
                        <p className="text-xs text-ink-dim">{formatDateTime(t.created_at)} · {t.rounds} rounds</p>
                      </div>
                    </div>
                    <Num className="hidden sm:block" value={round(Number(t.sensitivity), 3)} strong />
                    <Num className="hidden sm:block" value={round(Number(t.edpi), 0)} />
                    <Num className="hidden sm:block" value={round(Number(t.cm360), 1)} />
                    <div className="flex justify-end">
                      {confirming ? (
                        <div className="flex items-center gap-1 animate-fade-in">
                          <button type="button" onClick={() => remove(t.id)} className="rounded-md bg-accent-red/15 px-2 py-1 text-xs font-semibold text-accent-red hover:bg-accent-red/25 focus-ring">
                            Delete
                          </button>
                          <button type="button" onClick={() => setConfirmId(null)} className="rounded-md px-2 py-1 text-xs text-ink-muted hover:text-ink focus-ring">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmId(t.id)}
                          className="rounded-lg p-2 text-ink-dim transition-colors hover:bg-accent-red/10 hover:text-accent-red focus-ring"
                          aria-label="Delete result"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <p className="col-span-2 font-mono text-xs text-ink-muted sm:hidden">
                      Sens {round(Number(t.sensitivity), 3)} · eDPI {round(Number(t.edpi), 0)} · {round(Number(t.cm360), 1)} cm/360
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

      {view === 'aim' &&
        (aimScores.length === 0 ? (
          <EmptyState
            icon={Target}
            title={isPremium ? 'No training sessions yet' : 'Aim analytics are a Pro feature'}
            text={isPremium ? 'Play a round in the Aim Trainer to start tracking progress.' : 'Upgrade to keep a record of every aim training session.'}
            action={
              <Link to={isPremium ? '/tools/aim-trainer' : '/pricing'}>
                <Button variant="primary" size="sm">
                  {isPremium ? 'Open Aim Trainer' : <><Zap className="h-4 w-4" />Upgrade</>}
                </Button>
              </Link>
            }
          />
        ) : (
          <ul className="divide-y divide-white/[0.06] overflow-hidden rounded-xl border border-white/[0.06]">
            {aimScores.map((s) => (
              <li key={s.id} className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-white/[0.02]">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-accent-purple/20 bg-accent-purple/10">
                  <Target className="h-4 w-4 text-accent-purple-light" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium capitalize text-ink">{s.game_mode} · {s.duration_seconds}s</p>
                  <p className="text-xs text-ink-dim">{formatDateTime(s.created_at)}</p>
                </div>
                <div className="flex gap-6 text-right">
                  <Stat label="Score" value={String(s.score)} />
                  <Stat label="Acc." value={`${round(Number(s.accuracy), 0)}%`} />
                  {s.avg_reaction_ms ? <Stat label="React." value={`${s.avg_reaction_ms}ms`} className="hidden sm:block" /> : null}
                </div>
              </li>
            ))}
          </ul>
        ))}
    </div>
  );
}

function Num({ value, strong, className }: { value: number; strong?: boolean; className?: string }) {
  return (
    <p className={cn('text-right font-mono text-sm tabular-nums', strong ? 'text-ink' : 'text-ink-muted', className)}>{value}</p>
  );
}

function Stat({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-dim">{label}</p>
      <p className="font-mono text-sm tabular-nums text-ink">{value}</p>
    </div>
  );
}
