import { Link } from 'react-router-dom';
import { ArrowUpRight, Bookmark, Crosshair } from 'lucide-react';
import { useWorkspace } from '@/hooks/useWorkspace';
import { GAMES } from '@/data/games';
import { TOOLS } from '@/data/tools';
import { calcCm360, round } from '@/utils/calculations';

export function QuickAccess() {
  const { data } = useWorkspace();
  const setup = data.setups[0];
  const game = setup && GAMES.find(item => item.id === setup.gameId);
  if (!setup && !data.favorites.length) return null;
  return <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6" aria-label="Your quick access"><div className="rounded-xl border border-accent-purple/20 bg-base-surface p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><p className="eyebrow">WELCOME BACK / YOUR QUICK ACCESS</p><Link to="/setup" className="inline-flex items-center gap-1 rounded text-xs text-ink-muted hover:text-ink focus-ring">My setup<ArrowUpRight className="h-3 w-3" /></Link></div>
    {setup && game && <Link to={`/setup?game=${game.id}`} className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/20 p-4 focus-ring"><div className="flex items-center gap-3"><Crosshair className="h-5 w-5 shrink-0" style={{ color: game.color }} /><div><h2 className="text-sm font-semibold text-ink">Pick up your {game.name} setup</h2><p className="mt-1 font-mono text-[10px] text-ink-muted">{setup.dpi} DPI / {setup.sensitivity} sens / {round(calcCm360(setup.dpi, setup.sensitivity, game), 1)} cm/360</p></div></div><ArrowUpRight className="h-4 w-4 shrink-0 text-ink-muted" /></Link>}
    {!!data.favorites.length && <div className="mt-4 flex flex-wrap gap-2">{data.favorites.map(id => { const tool = TOOLS.find(item => item.id === id); return tool && <Link key={id} to={tool.route} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-ink-muted hover:text-ink focus-ring"><Bookmark className="h-3 w-3 text-accent-purple-light" />{tool.name}</Link>; })}</div>}
  </div></section>;
}
