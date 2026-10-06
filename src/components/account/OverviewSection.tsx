import { Link } from 'react-router-dom';
import { Activity, ArrowRight, ArrowUpRight, Crosshair, Target } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GAMES } from '@/data/games';
import { formatDateTime } from '@/utils/helpers';
import { round } from '@/utils/calculations';
import type { AimTrainingScore } from '@/types';
import { EmptyState, GameMark, SectionHeader, StatTile, type CloudTest } from './AccountUI';

interface Props {
  tests: CloudTest[];
  aimScores: AimTrainingScore[];
  followedCount: number;
  onOpenHistory: () => void;
}

type ActivityItem =
  | { kind: 'test'; date: string; test: CloudTest }
  | { kind: 'aim'; date: string; score: AimTrainingScore };

export function OverviewSection({ tests, aimScores, followedCount, onOpenHistory }: Props) {
  const latest = tests[0];
  const latestGame = latest ? GAMES.find((g) => g.id === latest.game_id) : undefined;
  const avgAccuracy = aimScores.length
    ? round(aimScores.reduce((s, a) => s + Number(a.accuracy), 0) / aimScores.length, 1)
    : null;
  const best = aimScores.length ? Math.max(...aimScores.map((s) => s.score)) : null;

  const activity: ActivityItem[] = [
    ...tests.slice(0, 5).map((test) => ({ kind: 'test' as const, date: test.created_at, test })),
    ...aimScores.slice(0, 5).map((score) => ({ kind: 'aim' as const, date: score.created_at, score })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <div className="space-y-10">
      <section>
        {latest ? (
          <div className="border-gradient relative overflow-hidden rounded-2xl p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent-purple/20 blur-3xl" />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-purple-light">
                  Your current sensitivity
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <GameMark name={latest.game_name} color={latestGame?.color} size="sm" />
                  <p className="text-sm font-medium text-ink-muted">{latest.game_name}</p>
                </div>
                <p className="mt-3 font-display text-5xl font-semibold tabular-nums tracking-tight text-ink">
                  {round(Number(latest.sensitivity), 3)}
                </p>
                <p className="mt-2 text-sm text-ink-dim">Found on {formatDateTime(latest.created_at)}</p>
              </div>
              <div className="grid grid-cols-3 gap-6 sm:gap-8">
                <Metric label="DPI" value={String(latest.dpi)} />
                <Metric label="eDPI" value={String(round(Number(latest.edpi), 0))} />
                <Metric label="cm/360" value={String(round(Number(latest.cm360), 1))} />
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={Crosshair}
            title="No sensitivity saved yet"
            text="Run the finder once and your ideal sensitivity will live here, synced across your devices."
            action={
              <Link to="/sensitivity">
                <Button variant="primary" size="sm">
                  Find my sensitivity
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            }
          />
        )}
      </section>

      <section>
        <SectionHeader title="At a glance" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile label="Sens tests" value={String(tests.length)} />
          <StatTile label="Aim sessions" value={String(aimScores.length)} />
          <StatTile label="Avg accuracy" value={avgAccuracy !== null ? `${avgAccuracy}%` : 'N/A'} />
          <StatTile label="Best score" value={best !== null ? String(best) : 'N/A'} hint={`${followedCount} games followed`} />
        </div>
      </section>

      <section>
        <SectionHeader
          title="Recent activity"
          action={
            activity.length > 0 && (
              <button
                type="button"
                onClick={onOpenHistory}
                className="inline-flex items-center gap-1 text-sm font-medium text-ink-muted transition-colors hover:text-ink focus-ring rounded"
              >
                View all
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            )
          }
        />
        {activity.length === 0 ? (
          <EmptyState icon={Activity} title="Nothing here yet" text="Your tests and training sessions will show up here." />
        ) : (
          <ul className="divide-y divide-white/[0.06] overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.015]">
            {activity.map((item) =>
              item.kind === 'test' ? (
                <li key={`t-${item.test.id}`} className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-white/[0.02]">
                  <GameMark
                    name={item.test.game_name}
                    color={GAMES.find((g) => g.id === item.test.game_id)?.color}
                    size="sm"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">Sensitivity test · {item.test.game_name}</p>
                    <p className="text-xs text-ink-dim">{formatDateTime(item.date)}</p>
                  </div>
                  <p className="font-mono text-sm tabular-nums text-ink">{round(Number(item.test.sensitivity), 3)}</p>
                </li>
              ) : (
                <li key={`a-${item.score.id}`} className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-white/[0.02]">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-accent-purple/20 bg-accent-purple/10">
                    <Target className="h-4 w-4 text-accent-purple-light" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium capitalize text-ink">{item.score.game_mode} training</p>
                    <p className="text-xs text-ink-dim">{formatDateTime(item.date)}</p>
                  </div>
                  <p className="font-mono text-sm tabular-nums text-ink">
                    {item.score.score}
                    <span className="ml-2 text-ink-dim">{round(Number(item.score.accuracy), 0)}%</span>
                  </p>
                </li>
              )
            )}
          </ul>
        )}
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-dim">{label}</p>
      <p className="mt-1 font-display text-xl font-semibold tabular-nums text-ink">{value}</p>
    </div>
  );
}
