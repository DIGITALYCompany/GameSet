import { Check, Minus } from 'lucide-react';
import type { SubscriptionTier } from '@/types';
import { cn } from '@/utils/cn';

type Value = boolean | string;

const GROUPS: { title: string; rows: { label: string; values: [Value, Value, Value] }[] }[] = [
  {
    title: 'Sensitivity',
    rows: [
      { label: 'Sensitivity Finder', values: ['7 rounds', '10 rounds', '20 rounds'] },
      { label: 'Sensitivity Converter', values: [true, true, true] },
      { label: 'eDPI & cm/360 calculators', values: [true, true, true] },
      { label: 'Pro preset database', values: ['View only', 'Copy & apply', 'Copy & apply'] },
    ],
  },
  {
    title: 'Training',
    rows: [
      { label: 'Aim, tracking & reaction drills', values: [true, true, true] },
      { label: 'Aim & reaction analytics', values: [false, true, true] },
      { label: 'Progress tracking & trends', values: [false, false, true] },
    ],
  },
  {
    title: 'Account',
    rows: [
      { label: 'Test history', values: ['On this device', 'Unlimited cloud', 'Unlimited cloud'] },
      { label: 'Followed games', values: ['3 games', 'Unlimited', 'Unlimited'] },
      { label: 'Crosshair sharing', values: [false, false, true] },
      { label: 'Early access tools', values: [false, false, true] },
      { label: 'Priority support', values: [false, true, true] },
    ],
  },
];

const COLUMNS: { tier: SubscriptionTier; name: string; color: string }[] = [
  { tier: 'free', name: 'Free', color: 'text-ink-muted' },
  { tier: 'pro', name: 'Pro', color: 'text-accent-purple-light' },
  { tier: 'elite', name: 'Elite', color: 'text-accent-orange' },
];

function Cell({ value }: { value: Value }) {
  if (value === true) return <Check className="mx-auto h-4 w-4 text-accent-green" strokeWidth={2.25} aria-label="Included" />;
  if (value === false) return <Minus className="mx-auto h-4 w-4 text-ink-dim/60" aria-label="Not included" />;
  return <span className="text-ink">{value}</span>;
}

export function PricingComparison({ currentTier }: { currentTier: SubscriptionTier | null }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-white/[0.015]">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-white/[0.06]">
            <th className="w-[40%] px-6 py-5 text-left font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-dim">Feature</th>
            {COLUMNS.map((col) => (
              <th key={col.tier} className={cn('px-4 py-5 text-center', col.tier === 'pro' && 'bg-accent-purple/[0.06]')}>
                <span className={cn('font-display text-base font-semibold', col.color)}>{col.name}</span>
                {currentTier === col.tier && (
                  <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.15em] text-accent-green">Current</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        {GROUPS.map((group) => (
          <tbody key={group.title}>
            <tr>
              <td colSpan={4} className="px-6 pb-2 pt-6 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-purple-light">
                {group.title}
              </td>
            </tr>
            {group.rows.map((row) => (
              <tr key={row.label} className="border-t border-white/[0.04] transition-colors duration-150 hover:bg-white/[0.02]">
                <td className="px-6 py-3.5 text-ink-muted">{row.label}</td>
                {row.values.map((value, i) => (
                  <td key={COLUMNS[i].tier} className={cn('px-4 py-3.5 text-center', i === 1 && 'bg-accent-purple/[0.06]')}>
                    <Cell value={value} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}
