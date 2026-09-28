import { Link } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import { GAMES } from '@/data/games';
import { TOOLS } from '@/data/tools';

export function Footer() {
  return (
    <footer className="border-t border-border bg-base-bg">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <Logo size="sm" />
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              Gaming tools built for players. Start with sensitivity — expand
              into the complete gaming toolkit.
            </p>
            <p className="mt-3 text-xs text-ink-dim">
              A product by DIGITALY Games
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-dim">
                Tools
              </h4>
              <ul className="mt-3 space-y-2">
                {TOOLS.slice(0, 5).map((tool) => (
                  <li key={tool.id}>
                    <Link
                      to={tool.status === 'available' ? tool.route : '/tools'}
                      className="text-sm text-ink-muted transition-colors hover:text-ink"
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-dim">
                Games
              </h4>
              <ul className="mt-3 space-y-2">
                {GAMES.slice(0, 5).map((game) => (
                  <li key={game.id}>
                    <Link
                      to="/sensitivity"
                      className="text-sm text-ink-muted transition-colors hover:text-ink"
                    >
                      {game.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-dim">
                Platform
              </h4>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link to="/" className="text-sm text-ink-muted transition-colors hover:text-ink">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/history" className="text-sm text-ink-muted transition-colors hover:text-ink">
                    History
                  </Link>
                </li>
                <li>
                  <Link to="/settings" className="text-sm text-ink-muted transition-colors hover:text-ink">
                    Settings
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-sm text-ink-muted transition-colors hover:text-ink">
                    About
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-ink-dim">
            &copy; {new Date().getFullYear()} DIGITALY Games. All rights reserved.
          </p>
          <nav aria-label="Legal" className="flex items-center gap-4">
            <Link
              to="/privacy"
              className="text-xs text-ink-dim transition-colors hover:text-ink"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-xs text-ink-dim transition-colors hover:text-ink"
            >
              Terms of Service
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
