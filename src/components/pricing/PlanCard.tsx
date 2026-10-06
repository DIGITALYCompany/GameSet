import { Link } from 'react-router-dom';
import { ArrowRight, Check, Clock, Crown, Sparkles, Zap } from 'lucide-react';
import type { SubscriptionPlan, SubscriptionTier } from '@/types';
import { cn } from '@/utils/cn';

const TIER_STYLE: Record<SubscriptionTier, { icon: typeof Crown; accent: string; ring: string; glow: string }> = {
  free: { icon: Sparkles, accent: 'text-ink-muted', ring: 'border-white/10 bg-white/[0.03]', glow: '' },
  pro: { icon: Zap, accent: 'text-accent-purple-light', ring: 'border-accent-purple/30 bg-gradient-to-br from-accent-purple/25 to-transparent', glow: 'bg-accent-purple/25' },
  elite: { icon: Crown, accent: 'text-accent-orange', ring: 'border-accent-orange/30 bg-gradient-to-br from-accent-orange/20 to-transparent', glow: 'bg-accent-orange/15' },
};

interface PlanCardProps {
  plan: SubscriptionPlan;
  isCurrent: boolean;
}

export function PlanCard({ plan, isCurrent }: PlanCardProps) {
  const style = TIER_STYLE[plan.tier];
  const Icon = style.icon;
  const [whole, cents] = plan.price.toFixed(2).split('.');
  const perDay = plan.price > 0 ? (plan.price / 30).toFixed(2) : null;
  const [inherit, ...features] = plan.features[0]?.startsWith('Everything in') ? plan.features : [null, ...plan.features];

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300 ease-smooth hover:-translate-y-1',
        plan.highlighted
          ? 'border-gradient shadow-glow lg:-my-4'
          : 'border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
      )}
    >
      {style.glow && <div className={cn('pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl', style.glow)} />}
      {plan.highlighted && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-purple-light to-transparent" />
      )}

      <div className={cn('relative p-7', plan.highlighted && 'lg:pt-11')}>
        <div className="flex items-center justify-between">
          <span className={cn('flex h-11 w-11 items-center justify-center rounded-xl border', style.ring)}>
            <Icon className={cn('h-5 w-5', style.accent)} strokeWidth={1.75} />
          </span>
          {isCurrent ? (
            <span className="rounded-full border border-accent-green/30 bg-accent-green/10 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-accent-green">
              Your plan
            </span>
          ) : (
            plan.badge && (
              <span
                className={cn(
                  'rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.15em]',
                  plan.highlighted ? 'bg-white text-black' : 'border border-accent-orange/30 bg-accent-orange/10 text-accent-orange'
                )}
              >
                {plan.badge}
              </span>
            )
          )}
        </div>

        <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight text-ink">{plan.name}</h2>
        <p className="mt-1.5 min-h-[40px] text-sm leading-relaxed text-ink-muted">{plan.tagline}</p>

        <div className="mt-6 flex items-end gap-1">
          <span className="font-display text-5xl font-semibold leading-none tracking-tight text-ink">${whole}</span>
          <span className="mb-1 font-display text-xl font-semibold text-ink">.{cents}</span>
          <span className="mb-1 ml-1 text-sm text-ink-dim">/ {plan.period}</span>
        </div>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-dim">
          {perDay ? `About $${perDay} a day` : 'No card required'}
        </p>

        <div className="mt-7">
          {isCurrent ? (
            <span className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-5 py-3 text-sm font-semibold text-ink-muted">
              <Check className="h-4 w-4 text-accent-green" />
              Current plan
            </span>
          ) : plan.price > 0 ? (
            <button
              type="button"
              disabled
              title="Online payments are coming soon"
              className={cn(
                'flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold',
                plan.highlighted ? 'bg-white/90 text-black/70' : 'border border-white/[0.08] bg-white/[0.03] text-ink-muted'
              )}
            >
              <Clock className="h-4 w-4" />
              Coming soon
            </button>
          ) : (
            <Link
              to="/sensitivity"
              className="group/cta flex w-full items-center justify-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.04] px-5 py-3 text-sm font-semibold text-ink transition-all duration-200 hover:border-white/20 hover:bg-white/[0.07] focus-ring"
            >
              Start free
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/cta:translate-x-0.5" />
            </Link>
          )}
        </div>
      </div>

      <div className="relative flex-1 border-t border-white/[0.06] p-7">
        {inherit && (
          <p className={cn('mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.15em]', style.accent)}>
            {inherit}, plus
          </p>
        )}
        <ul className="space-y-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm leading-relaxed text-ink-muted">
              <Check className={cn('mt-0.5 h-4 w-4 shrink-0', style.accent)} strokeWidth={2.25} />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
