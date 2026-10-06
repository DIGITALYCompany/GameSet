import { Link } from 'react-router-dom';
import { ArrowRight, Check, Crown, Target, TrendingUp, SlidersHorizontal, Clock, Sparkles } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { PricingFaq } from '@/components/pricing/PricingFaq';

const BENEFITS = [
  { icon: TrendingUp, title: 'See your progress.', text: 'Accuracy, tracking and reaction time in one dashboard. See what changes over a week or a month.', detail: 'Progress dashboard' },
  { icon: SlidersHorizontal, title: 'Find what works.', text: 'Compare your results before and after a sensitivity change. Build your setup around your own performance.', detail: 'Setup comparisons' },
  { icon: Target, title: 'Train with a purpose.', text: 'A focused 10-minute routine shaped by your results and the game you play. Know what to work on next.', detail: 'Personalized routines' },
];
const FREE_FEATURES = ['Sensitivity Finder', 'Cross-game sensitivity converter', 'eDPI & cm/360 calculators', 'Crosshair generator', 'Aim, tracking & reaction drills', 'Local test history'];
const PREMIUM_FEATURES = ['Progress dashboard & weekly insights', 'Before / after setup comparisons', 'Personalized training routines', 'Multiple saved setups per game', 'Goals & weekly progress reports'];

function ProgressPreview() {
  return (
    <div className="relative rounded-3xl border border-amber-200/20 bg-[#101016] p-5 shadow-[0_24px_100px_-30px_rgba(251,191,36,0.2)] sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3"><span className="rounded-xl bg-amber-300/10 p-2.5"><Crown className="h-5 w-5 text-amber-200" /></span><div><p className="text-sm font-semibold text-ink">Your performance hub</p><p className="mt-1 text-xs text-ink-dim">VALORANT · Last 7 days</p></div></div>
        <span className="rounded-full border border-amber-200/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-200">Concept preview</span>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-4">
        {[['Accuracy', '84%', '+8 pts'], ['Reaction', '218 ms', '−24 ms'], ['Consistency', '92%', '+6 pts']].map(([label, value, change]) => <div key={label} className="rounded-xl border border-white/5 bg-white/[0.025] p-3"><p className="text-[10px] text-ink-dim sm:text-xs">{label}</p><p className="mt-2 font-display text-lg font-semibold text-ink sm:text-2xl">{value}</p><p className="mt-1 text-xs text-emerald-300">{change}</p></div>)}
      </div>
      <div className="mt-6 flex items-center justify-between text-xs"><span className="text-ink-muted">Accuracy over time</span><span className="text-amber-200">This week</span></div>
      <svg viewBox="0 0 400 130" className="mt-3 w-full" role="img" aria-label="Illustrative accuracy chart trending upwards across seven days">
        <defs><linearGradient id="premium-chart-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fcd34d" stopOpacity=".22" /><stop offset="100%" stopColor="#fcd34d" stopOpacity="0" /></linearGradient></defs>
        {[30, 65, 100].map(y => <line key={y} x1="0" x2="400" y1={y} y2={y} stroke="white" strokeOpacity=".06" />)}
        <path d="M0 106 L65 89 L130 95 L195 57 L260 66 L325 34 L400 15 L400 130 L0 130 Z" fill="url(#premium-chart-fill)" />
        <path d="M0 106 L65 89 L130 95 L195 57 L260 66 L325 34 L400 15" fill="none" stroke="#fcd34d" strokeWidth="3" strokeLinejoin="round" />
      </svg>
      <div className="flex justify-between text-[10px] text-ink-dim"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
      <div className="mt-6 flex items-center gap-3 rounded-xl border border-accent-purple/20 bg-accent-purple/10 p-4"><Target className="h-5 w-5 shrink-0 text-accent-purple-light" /><div><p className="text-sm font-medium text-ink">Your next session</p><p className="mt-1 text-xs text-ink-muted">4 min tracking · 4 min flicks · 2 min reaction</p></div><span className="ml-auto shrink-0 text-xs text-accent-purple-light">10 min</span></div>
      <p className="mt-4 text-center text-[11px] leading-relaxed text-ink-dim">Illustrative data. Dashboard and routines are in development.</p>
    </div>
  );
}

export function PricingPage() {
  return (
    <Layout>
      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 sm:pt-20">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.08),transparent_65%)]" />
        <section className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <header>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200/25 bg-amber-200/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-200"><Crown className="h-3.5 w-3.5" /> GAMESET Premium</span>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-6xl">Every session.<br />A step <span className="bg-gradient-to-r from-amber-100 to-amber-400 bg-clip-text text-transparent">forward.</span></h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-muted">Understand your aim. Find your settings. See your progress. Your personal performance hub, built around the way you play. Just $0.99 a month at launch.</p>
            <div className="mt-8 flex flex-wrap gap-3"><a href="#premium-plans" className="focus-ring inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-200 to-amber-400 px-6 py-3.5 text-sm font-semibold text-black transition-shadow hover:shadow-[0_0_30px_-10px_rgba(251,191,36,0.6)]">Explore Premium <ArrowRight className="h-4 w-4" /></a><Link to="/tools" className="focus-ring rounded-xl border border-white/10 px-6 py-3.5 text-sm font-medium text-ink hover:bg-white/5">Try the free tools</Link></div>
            <p className="mt-5 flex items-center gap-2 text-xs text-ink-dim"><Clock className="h-3.5 w-3.5 text-amber-200" /> Premium is coming soon. Core tools are free today.</p>
          </header>
          <ProgressPreview />
        </section>

        <section className="mt-20 sm:mt-28" aria-labelledby="benefits-title">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-200">More than another sensitivity test</p>
          <h2 id="benefits-title" className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Turn your results into a next step.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">{BENEFITS.map(({ icon: Icon, title, text, detail }) => <article key={title} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6"><div className="flex items-center justify-between"><Icon className="h-6 w-6 text-amber-200" strokeWidth={1.5} /><span className="text-[10px] uppercase tracking-wider text-ink-dim">In development</span></div><h3 className="mt-6 font-display text-xl font-semibold text-ink">{title}</h3><p className="mt-3 text-sm leading-relaxed text-ink-muted">{text}</p><p className="mt-5 text-xs font-medium text-amber-200">{detail}</p></article>)}</div>
        </section>

        <section id="premium-plans" className="mt-20 scroll-mt-24 sm:mt-28" aria-labelledby="plans-title">
          <div className="mx-auto max-w-xl text-center"><Sparkles className="mx-auto h-6 w-6 text-amber-200" /><h2 id="plans-title" className="mt-4 font-display text-3xl font-semibold text-ink sm:text-4xl">Start free. Go further.</h2><p className="mt-4 text-ink-muted">One Premium plan. $0.99 a month to go further.</p></div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2">
            <article className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.02] p-7 sm:p-8"><p className="text-sm font-medium text-ink-muted">GAMESET Free</p><h3 className="mt-4 font-display text-4xl font-semibold text-ink">Free forever.</h3><p className="mt-4 text-sm leading-relaxed text-ink-muted">Find your sensitivity and practice with the essentials.</p><ul className="my-7 flex-1 space-y-3">{FREE_FEATURES.map(feature => <li key={feature} className="flex items-start gap-3 text-sm text-ink-muted"><Check className="h-4 w-4 shrink-0 text-ink-dim" />{feature}</li>)}</ul><Link to="/sensitivity" className="focus-ring flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-sm font-semibold text-ink hover:bg-white/10">Start free <ArrowRight className="h-4 w-4" /></Link><p className="mt-3 text-center text-xs text-ink-dim">No card required</p></article>
            <article className="relative flex flex-col overflow-hidden rounded-3xl border border-amber-200/30 bg-gradient-to-br from-amber-200/[0.08] via-[#121116] to-[#0c0c12] p-7 shadow-[0_0_60px_-30px_rgba(251,191,36,0.3)] sm:p-8"><div className="flex items-center justify-between gap-2"><p className="flex items-center gap-2 text-sm font-semibold text-amber-200"><Crown className="h-4 w-4" /> GAMESET Premium</p><span className="rounded-full bg-amber-200/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-200">Coming soon</span></div><h3 className="mt-4 font-display text-4xl font-semibold text-ink">$0.99<span className="ml-2 font-sans text-base font-normal text-ink-muted">/ month</span></h3><p className="mt-4 text-sm leading-relaxed text-ink-muted">Everything in Free, with a planned toolkit to make every session count.</p><ul className="my-7 flex-1 space-y-3">{PREMIUM_FEATURES.map(feature => <li key={feature} className="flex items-start gap-3 text-sm text-ink-muted"><Clock className="h-4 w-4 shrink-0 text-amber-200" />{feature}</li>)}</ul><Link to="/account" className="focus-ring flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-200 to-amber-400 px-5 py-3.5 text-sm font-semibold text-black hover:brightness-110">Create your free account <ArrowRight className="h-4 w-4" /></Link><p className="mt-3 text-center text-xs text-ink-dim">$0.99 / month at launch · No payment today</p></article>
          </div>
        </section>

        <section className="mt-20 grid gap-8 sm:mt-28 lg:grid-cols-[1fr_1.5fr]"><div><p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-200">Good to know</p><h2 className="mt-3 font-display text-3xl font-semibold text-ink">Your questions, answered.</h2><p className="mt-4 text-sm leading-relaxed text-ink-muted">Start playing now. Discover the Premium experience as it takes shape.</p></div><PricingFaq /></section>
        <section className="mt-20 rounded-3xl border border-white/10 bg-white/[0.025] p-8 text-center sm:p-12"><h2 className="font-display text-3xl font-semibold text-ink">Your next session starts here.</h2><p className="mt-3 text-ink-muted">Find your sensitivity, try a drill, and build your setup today.</p><Link to="/tools" className="focus-ring mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-amber-100">Explore the tools <ArrowRight className="h-4 w-4" /></Link></section>
      </div>
    </Layout>
  );
}
