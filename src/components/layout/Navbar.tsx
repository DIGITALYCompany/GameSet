import { Link, useLocation } from 'react-router-dom';
import { Settings, User } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Sensitivity', to: '/sensitivity' },
  { label: 'Tools', to: '/tools' },
  { label: 'History', to: '/history' },
];

export function Navbar() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-base-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="focus-ring rounded-md" aria-label="GAMESET home">
          <Logo size="sm" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => {
            const active =
              link.to === '/'
                ? pathname === '/'
                : pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 focus-ring',
                  active
                    ? 'text-ink'
                    : 'text-ink-muted hover:text-ink'
                )}
                aria-current={active ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            to="/account"
            className={cn(
              'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 focus-ring',
              pathname === '/account'
                ? 'text-ink'
                : 'text-ink-muted hover:text-ink'
            )}
            aria-current={pathname === '/account' ? 'page' : undefined}
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">
              {user ? 'Account' : 'Sign In'}
            </span>
          </Link>
          {user && (
            <Link
              to="/settings"
              className={cn(
                'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 focus-ring',
                pathname === '/settings'
                  ? 'text-ink'
                  : 'text-ink-muted hover:text-ink'
              )}
              aria-current={pathname === '/settings' ? 'page' : undefined}
            >
              <Settings className="h-4 w-4" />
              <span className="hidden lg:inline">Settings</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
