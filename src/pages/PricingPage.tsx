import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Cloud, Lock, RotateCcw, ShieldCheck } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { PlanCard } from '@/components/pricing/PlanCard';
import { PricingComparison } from '@/components/pricing/PricingComparison';
import { PricingFaq } from '@/components/pricing/PricingFaq';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { SUBSCRIPTION_PLANS } from '@/types';
import type { SubscriptionTier } from '@/types';

const ASSURANCES = [
  { icon: RotateCcw, title: 'Cancel anytime', text: 'No commitment, keep your data.' },
  { icon: ShieldCheck, title: '7-day refund', text: 'Not for you? Get your money back.' },
  { icon: Cloud, title: 'Data carries over', text: 'History and games follow your upgrade.' },
  { icon: Lock, title: 'Secure payments', text: 'Card details never touch our servers.' },
];

function Eyebrow({ children }: { children: string }) {
  return <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-purple-light">{children}</p>;
}

export function PricingPage() {
  const { user } = useAuth();
  const [currentTier, setCurrentTier] = useState<SubscriptionTier | null>(null);

  useEffect(() => {
    if (!user) {
      setCurrentTier(null);
      return;
    }
    let cancelled = false;
    supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        setCurrentTier(error ? null : ((data?.subscription_tier as SubscriptionTier | undefined) ?? 'free'));
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <Layout>
      <div className="relative">

        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 sm:pt-20">
          <header className="mx-auto max-w-2xl text-center">
            <Eyebrow>GAMESET Premium</Eyebrow>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-6xl">
              Sharper aim for less
              <br className="hidden sm:block" /> than a coffee
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
              Every core tool is free forever. Premium adds deeper tests, analytics and unlimited sync, starting at $0.99 a month.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-accent-orange/25 bg-accent-orange/[0.08] px-3.5 py-1.5 text-xs font-medium text-accent-orange-light">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-orange" />
              Paid plans open soon. Start free today, upgrade in one click later.
            </div>
          </header>

          <div className="mt-16 grid items-stretch gap-5 lg:grid-cols-3 lg:gap-6">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <PlanCard key={plan.tier} plan={plan} isCurrent={currentTier === plan.tier} />
            ))}
          </div>

          <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
            {ASSURANCES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-start gap-3 bg-base-bg p-5">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent-purple-light" strokeWidth={1.75} />
                <div>
                  <p className="text-sm font-medium text-ink">{title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-ink-dim">{text}</p>
                </div>
              </li>
            ))}
          </ul>

          <section className="mt-24">
            <div className="mb-8 max-w-xl">
              <Eyebrow>Compare</Eyebrow>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Every feature, side by side</h2>
            </div>
            <PricingComparison currentTier={currentTier} />
          </section>

          <section className="mt-24 grid gap-10 lg:grid-cols-[1fr_1.6fr]">
            <div>
              <Eyebrow>FAQ</Eyebrow>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Questions, answered</h2>
              <p className="mt-3 text-base leading-relaxed text-ink-muted">
                Something else? Write to us at{' '}
                <a href="mailto:hello@digitaly.games" className="text-ink underline decoration-white/20 underline-offset-4 transition-colors hover:decoration-accent-purple-light">
                  hello@digitaly.games
                </a>
              </p>
            </div>
            <PricingFaq />
          </section>

          <section className="border-gradient relative mt-24 overflow-hidden rounded-2xl">
            <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent-purple/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-accent-magenta/10 blur-3xl" />
            <div className="relative flex flex-col items-start gap-6 p-8 sm:p-12 md:flex-row md:items-center md:justify-between">
              <div className="max-w-lg">
                <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">Find your sensitivity in minutes</h2>
                <p className="mt-3 text-base leading-relaxed text-ink-muted">Free, in your browser, no account needed to get started.</p>
              </div>
              <Link
                to="/sensitivity"
                className="btn-shine group inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-black transition-shadow duration-300 hover:shadow-[0_10px_30px_-10px_rgba(255,255,255,0.5)] focus-ring"
              >
                Start the free test
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
