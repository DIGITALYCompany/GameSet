import { Link, useLocation } from 'react-router-dom';
import { Home, Crosshair, Wrench, History, User } from 'lucide-react';
import { cn } from '@/utils/cn';

const ITEMS = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Sensitivity', to: '/sensitivity', icon: Crosshair },
  { label: 'Tools', to: '/tools', icon: Wrench },
  { label: 'History', to: '/history', icon: History },
  { label: 'Account', to: '/account', icon: User },
];

export function MobileNav() {
  const { pathname } = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-base-bg/95 backdrop-blur-md md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {ITEMS.map((item) => {
          const active =
            item.to === '/' ? pathname === '/' : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors duration-150',
                active ? 'text-accent-purple' : 'text-ink-muted'
              )}
              aria-current={active ? 'page' : undefined}
              aria-label={item.label}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
