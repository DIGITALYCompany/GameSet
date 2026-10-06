import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Crown } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';
import { GamesMenu } from './GamesMenu';

const NAV_LINKS = [
  { label: 'Tools', to: '/tools' },
  { label: 'Setup', to: '/setup' },
];

interface NavbarProps {
  onOpenAuth: () => void;
}

export function Navbar({ onOpenAuth }: NavbarProps) {
  const { pathname } = useLocation();
  const { user, loading } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4">
      <div
        className={cn(
          'relative mx-auto flex h-14 max-w-6xl items-center justify-between rounded-2xl border px-3 transition-all duration-500 ease-smooth sm:px-4',
          scrolled
            ? 'border-white/[0.08] bg-[rgba(8,8,14,0.78)] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.7)] backdrop-blur-2xl'
            : 'border-white/[0.07] bg-base-surface/70 backdrop-blur-xl'
        )}
      >
        <Link to="/" className="focus-ring rounded-lg transition-opacity hover:opacity-90" aria-label="GAMESET home">
          <Logo size="sm" />
        </Link>

        <nav
          className="hidden items-center gap-3 md:flex"
          aria-label="Main navigation"
        >
          <GamesMenu />
          {NAV_LINKS.map((link) => {
            const active = pathname === link.to || pathname.startsWith(`${link.to}/`);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'relative rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all duration-300 ease-smooth focus-ring',
                  active
                    ? 'text-ink'
                    : 'text-ink-muted hover:text-ink'
                )}
                aria-current={active ? 'page' : undefined}
              >
                {link.label}
                {active && (
                  <span className="absolute inset-x-3 bottom-0 h-px bg-accent-purple-light" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/pricing"
            className={cn(
              'premium-nav inline-flex items-center gap-2 rounded-xl border p-2 text-sm font-semibold transition-all duration-200 focus-ring sm:px-3.5 sm:py-2',
              pathname === '/pricing'
                ? 'border-amber-300/60 bg-amber-300/15 text-amber-200'
                : 'border-amber-300/30 bg-amber-300/10 text-amber-200 hover:border-amber-300/60 hover:bg-amber-300/20'
            )}
            aria-current={pathname === '/pricing' ? 'page' : undefined}
            aria-label="Discover GAMESET Premium"
          >
            <Crown className="relative h-4 w-4 fill-amber-300/20" strokeWidth={1.8} />
            <span className="relative hidden sm:inline">Premium</span>
          </Link>
          {user ? (
            <Link
              to="/account"
              className={cn(
                'inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all duration-200 focus-ring',
                pathname === '/account'
                  ? 'border-white/10 bg-white/[0.08] text-ink'
                  : 'border-transparent text-ink-muted hover:border-border hover:bg-white/[0.04] hover:text-ink'
              )}
              aria-current={pathname === '/account' ? 'page' : undefined}
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              disabled={loading}
              className="btn-shine inline-flex items-center gap-2 rounded-lg bg-white px-3.5 py-1.5 text-sm font-semibold text-black transition-all duration-200 hover:-translate-y-px hover:shadow-[0_8px_24px_-8px_rgba(255,255,255,0.45)] focus-ring"
              aria-label="Sign in"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{loading ? '' : 'Sign In'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
