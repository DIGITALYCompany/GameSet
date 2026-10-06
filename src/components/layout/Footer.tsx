import { Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { GAMES } from '@/data/games';
import { getAvailableTools } from '@/data/tools';

const PLATFORM_LINKS = [
  { label: 'My setup', to: '/setup' },
  { label: 'Home', to: '/' },
  { label: 'Account', to: '/account' },
  { label: 'Premium', to: '/pricing' },
  { label: 'About', to: '/about' },
  { label: 'History', to: '/history' },
  { label: 'Settings', to: '/settings' },
];

function Column({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <h4 className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-dim">{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.to}>
            <Link
              to={l.to}
              className="group inline-flex items-center gap-1 text-sm text-ink-muted transition-colors duration-200 hover:text-ink"
            >
              <span className="h-px w-0 bg-accent-purple-light transition-all duration-300 ease-smooth group-hover:w-2.5" />
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const { pathname } = useLocation();
  const tools = getAvailableTools().slice(0, 6).map((t) => ({ label: t.name, to: t.route }));
  const games = GAMES.slice(0, 5).map((g) => ({ label: g.name, to: `/games/${g.slug}` }));

  return (
    <footer className="relative mt-16 border-t border-border bg-base-bg/70 backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-purple/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-accent-purple/[0.05] to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {pathname !== '/' && <div className="border-gradient -mt-px flex flex-col items-start justify-between gap-6 rounded-b-2xl px-6 py-8 sm:flex-row sm:items-center sm:px-8">
          <div>
            <p className="font-display text-2xl font-semibold tracking-tight text-ink">Stop guessing your sens.</p>
            <p className="mt-1 text-sm text-ink-muted">Find the number that actually fits your aim, in a few quick rounds.</p>
          </div>
          <Link
            to="/sensitivity"
            className="btn-shine group inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition-all duration-200 hover:-translate-y-px hover:shadow-[0_10px_30px_-10px_rgba(255,255,255,0.5)] focus-ring"
          >
            Start the finder
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>}

        <div className="flex flex-col gap-12 py-14 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <Logo size="sm" />
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              Precision tools for FPS players. Sensitivity, aim, crosshairs and hardware, all in one place.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.02] px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-green opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-green" />
              </span>
              <span className="text-xs text-ink-muted">All tools online</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-10 sm:grid-cols-3 sm:gap-x-16 lg:gap-x-24">
            <Column title="Tools" links={tools} />
            <Column title="Games" links={games} />
            <Column title="Platform" links={PLATFORM_LINKS} />
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-border py-6 sm:flex-row sm:items-center">
          <p className="text-xs text-ink-dim">&copy; {new Date().getFullYear()} DIGITALY Games. All rights reserved.</p>
          <nav aria-label="Legal" className="flex items-center gap-5">
            <Link to="/privacy" className="text-xs text-ink-dim transition-colors hover:text-ink">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-xs text-ink-dim transition-colors hover:text-ink">
              Terms of Service
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
