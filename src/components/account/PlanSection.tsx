import { Link } from 'react-router-dom';
import { ArrowRight, Crown, Sparkles, Clock, ShieldCheck } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { SubscriptionTier } from '@/types';
import { SectionHeader } from './AccountUI';

export function TierBadge({ tier }: { tier: SubscriptionTier }) {
  const premium = tier !== 'free';
  const Icon = premium ? Crown : Sparkles;
  return <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider', premium ? 'border-amber-200/25 bg-amber-200/10 text-amber-200' : 'border-white/10 bg-white/5 text-ink-muted')}><Icon className="h-3 w-3" />{premium ? 'Premium' : 'Free'}</span>;
}

export function PlanSection({ tier, status }: { tier: SubscriptionTier; status: string | null }) {
  const premium = tier !== 'free';
  return <div className="space-y-6"><SectionHeader title="Your membership" description="Your current plan and the next chapter of GameSet." /><section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8"><TierBadge tier={tier} /><h2 className="mt-5 font-display text-3xl font-semibold text-ink">{premium ? 'Your Premium membership' : 'Your essentials, always free.'}</h2><p className="mt-3 text-sm leading-relaxed text-ink-muted">{premium ? `Subscription status: ${status ?? 'Not available'}.` : 'Find your sensitivity, convert your settings, create a crosshair and practice with the free tools.'}</p><p className="mt-5 flex items-center gap-2 text-xs text-ink-dim"><ShieldCheck className="h-4 w-4" />Your saved player data stays in your account.</p></section><section className="relative overflow-hidden rounded-3xl border border-amber-200/25 bg-gradient-to-br from-amber-200/[0.08] to-base-bg p-6 sm:p-8"><div className="flex items-center justify-between gap-3"><Crown className="h-6 w-6 text-amber-200" /><span className="rounded-full bg-amber-200/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-200">Coming soon</span></div><h2 className="mt-5 font-display text-3xl font-semibold text-ink">Go further with Premium.</h2><p className="mt-3 font-display text-3xl font-semibold text-amber-200">$0.99 <span className="text-sm font-normal text-ink-dim">/ month at launch</span></p><p className="mt-4 max-w-lg text-sm leading-relaxed text-ink-muted">A deeper progress dashboard, setup comparisons and personalized routines are in development.</p><ul className="mt-5 grid gap-3 sm:grid-cols-2">{['Progress insights', 'Before / after comparisons', 'Personalized routines', 'Weekly reports'].map(feature => <li key={feature} className="flex items-center gap-2 text-xs text-ink-muted"><Clock className="h-3.5 w-3.5 text-amber-200" />{feature}</li>)}</ul><Link to="/pricing" className="focus-ring mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-200 px-5 py-3 text-sm font-semibold text-black hover:bg-amber-100">Explore Premium<ArrowRight className="h-4 w-4" /></Link><p className="mt-3 text-xs text-ink-dim">Payments are not available yet.</p></section></div>;
}
