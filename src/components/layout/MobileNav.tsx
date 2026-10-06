import { Link, useLocation } from 'react-router-dom';
import { Bookmark, Gamepad2, Wrench, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';

const LINK_ITEMS = [
  { label: 'My setup', to: '/setup', icon: Bookmark },
  { label: 'Games', to: '/games', icon: Gamepad2 },
  { label: 'Tools', to: '/tools', icon: Wrench },
];

interface MobileNavProps {
  onOpenAuth: () => void;
}

export function MobileNav({ onOpenAuth }: MobileNavProps) {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const accountActive = pathname === '/account' || pathname === '/settings';

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border glass-strong md:hidden"
      aria-label="Mobile navigation"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {LINK_ITEMS.map((item) => {
          const active =
            item.to === '/' ? pathname === '/' : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors duration-200',
                active ? 'text-accent-purple' : 'text-ink-muted'
              )}
              aria-current={active ? 'page' : undefined}
              aria-label={item.label}
            >
              <Icon className={cn('h-5 w-5 transition-transform', active && 'scale-110')} />
              {item.label}
            </Link>
          );
        })}
        {user ? (
          <Link
            to="/account"
            className={cn(
              'flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors duration-200',
              accountActive ? 'text-accent-purple' : 'text-ink-muted'
            )}
            aria-current={accountActive ? 'page' : undefined}
            aria-label="Account"
          >
            <User className={cn('h-5 w-5 transition-transform', accountActive && 'scale-110')} />
            Account
          </Link>
        ) : (
          <button
            type="button"
            onClick={onOpenAuth}
            className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium text-accent-purple transition-colors duration-200"
            aria-label="Sign in"
          >
            <User className="h-5 w-5" />
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
