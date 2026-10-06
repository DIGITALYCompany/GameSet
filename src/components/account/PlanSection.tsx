import { Link } from 'react-router-dom';
import { ArrowRight, Check, Crown, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { SUBSCRIPTION_PLANS } from '@/types';
import type { SubscriptionTier } from '@/types';
import { SectionHeader } from './AccountUI';

const TIER_INFO: Record<SubscriptionTier, { label: string; icon: typeof Crown; badge: string }> = {
  free: { label: 'Free', icon: Sparkles, badge: 'border-white/10 bg-white/[0.04] text-ink-muted' },
  pro: { label: 'Pro', icon: Zap, badge: 'border-accent-purple/30 bg-accent-purple/15 text-accent-purple-light' },
  elite: { label: 'Elite', icon: Crown, badge: 'border-accent-orange/30 bg-accent-orange/15 text-accent-orange' },
};

export function TierBadge({ tier }: { tier: SubscriptionTier }) {
  const info = TIER_INFO[tier];
  const Icon = info.icon;
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider', info.badge)}>
      <Icon className="h-3 w-3" />
      {info.label}
    </span>
  );
}

interface Props {
  tier: SubscriptionTier;
  status: string | null;
}

export function PlanSection({ tier, status }: Props) {
  const current = SUBSCRIPTION_PLANS.find((p) => p.tier === tier);
  const isPremium = tier !== 'free';

  return (
    <div className="space-y-10">
      <section>
        <SectionHeader title="Current plan" />
        <div className="border-gradient relative overflow-hidden rounded-2xl p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-24 h-60 w-60 rounded-full bg-accent-purple/15 blur-3xl" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <TierBadge tier={tier} />
              <p className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">
                {current ? (current.price === 0 ? 'Free' : `$${current.price.toFixed(2)}`) : TIER_INFO[tier].label}
                {current && current.price > 0 && <span className="ml-1 text-base font-normal text-ink-dim">/{current.period}</span>}
              </p>
              <p className="mt-1 text-sm text-ink-muted">
                {isPremium ? `Status: ${status ?? 'active'}` : current?.tagline ?? 'The essentials, free forever.'}
              </p>
            </div>
            <Link to="/pricing">
              <Button variant={isPremium ? 'secondary' : 'primary'}>
                {isPremium ? 'Manage plan' : 'Upgrade'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          {current && (
            <ul className="relative mt-6 grid gap-2.5 border-t border-white/[0.06] pt-6 sm:grid-cols-2">
              {current.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-ink-muted">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-green" />
                  {f}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section>
        <SectionHeader title="Compare plans" />
        <div className="grid gap-3 md:grid-cols-3">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrent = plan.tier === tier;
            const Icon = TIER_INFO[plan.tier].icon;
            return (
              <div
                key={plan.tier}
                className={cn(
                  'flex flex-col rounded-xl border p-5 transition-colors',
                  isCurrent ? 'border-accent-purple/40 bg-accent-purple/[0.05]' : 'border-white/[0.06] bg-white/[0.015] hover:border-white/[0.12]'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <Icon className="h-4 w-4 text-ink-muted" />
                    {plan.name}
                  </span>
                  {isCurrent && <span className="text-[11px] font-semibold uppercase tracking-wider text-accent-purple-light">Current</span>}
                </div>
                <p className="mt-3 font-display text-2xl font-semibold text-ink">
                  ${plan.price.toFixed(2)}
                  <span className="ml-1 text-xs font-normal text-ink-dim">/{plan.period}</span>
                </p>
                <ul className="mt-4 flex-1 space-y-2">
                  {plan.features.slice(0, 4).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-ink-muted">
                      <Check className="mt-0.5 h-3 w-3 shrink-0 text-ink-dim" />
                      {f}
                    </li>
                  ))}
                </ul>
                {!isCurrent && (
                  <Link to="/pricing" className="mt-5 block">
                    <Button variant={plan.highlighted ? 'primary' : 'secondary'} size="sm" fullWidth>
                      {plan.price === 0 ? 'Switch to Free' : `Choose ${plan.name}`}
                    </Button>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
