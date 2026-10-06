import { useEffect, useId, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, LayoutDashboard, UserRound, Settings, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Avatar } from '@/components/account/AccountUI';

export function AccountMenu() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<{ username: string | null; avatar_emoji: string | null } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setProfile(null);
    setImageFailed(false);
    const load = async () => {
      if (!user) return;
      const { data } = await supabase.from('profiles').select('username, avatar_emoji').eq('id', user.id).maybeSingle();
      if (!cancelled) setProfile(data);
    };
    void load();
    window.addEventListener('gameset:profile-updated', load);
    return () => { cancelled = true; window.removeEventListener('gameset:profile-updated', load); };
  }, [user]);

  useEffect(() => { setOpen(false); }, [location.pathname, location.search]);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); trigger.current?.focus(); } };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [open]);

  if (!user) return null;
  const name = profile?.username || user.user_metadata?.preferred_username || user.user_metadata?.full_name || 'Player';
  const candidate = user.user_metadata?.avatar_url || user.user_metadata?.picture;
  const photo = typeof candidate === 'string' && candidate.startsWith('https://') && !profile?.avatar_emoji && !imageFailed ? candidate : null;
  const avatar = photo ? <img src={photo} alt="" referrerPolicy="no-referrer" onError={() => setImageFailed(true)} className="h-8 w-8 rounded-lg border border-white/10 object-cover" /> : <span className="[&>div]:h-8 [&>div]:w-8 [&_svg]:h-4 [&_svg]:w-4"><Avatar value={profile?.avatar_emoji ?? null} size="sm" /></span>;
  async function logout() {
    setBusy(true); setError('');
    try { await signOut(); setOpen(false); navigate('/'); }
    catch { setError('Unable to sign out. Please try again.'); }
    finally { setBusy(false); }
  }
  return <div ref={root} className="relative" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false); }}>
    <button ref={trigger} type="button" aria-expanded={open} aria-controls={id} aria-label={`Account for ${name}`} onClick={() => { setOpen(value => !value); setError(''); }} onKeyDown={event => { if (event.key === 'ArrowDown') { event.preventDefault(); setOpen(true); requestAnimationFrame(() => root.current?.querySelector<HTMLAnchorElement>('nav a')?.focus()); } }} className="focus-ring flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1.5 text-sm font-semibold text-ink transition-colors hover:border-accent-purple/30 hover:bg-white/10 sm:pr-3">
      {avatar}<span className="hidden max-w-[120px] truncate sm:block">{name}</span><ChevronDown className={`h-3.5 w-3.5 text-ink-muted transition-transform ${open ? 'rotate-180' : ''}`} />
    </button>
    {open && <div id={id} className="absolute right-0 top-full z-50 mt-3 w-64 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-white/15 bg-[#14141e] shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
      <div className="flex items-center gap-3 border-b border-white/10 bg-accent-purple/[0.06] p-4">{avatar}<div className="min-w-0"><p className="truncate text-sm font-semibold text-ink">{name}</p><p className="mt-1 truncate text-xs text-ink-muted">{user.email}</p></div></div>
      <nav aria-label="Your account" className="space-y-1 p-2">{[{ to: '/account', label: 'Dashboard', icon: LayoutDashboard }, { to: '/account?tab=profile', label: 'My profile', icon: UserRound }, { to: '/account?tab=settings', label: 'Settings', icon: Settings }].map(({ to, label, icon: Icon }) => <Link key={to} to={to} onClick={() => setOpen(false)} className="focus-ring flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-muted hover:bg-white/5 hover:text-ink"><Icon className="h-4 w-4 text-accent-purple-light" />{label}</Link>)}</nav>
      <div className="border-t border-white/10 p-2"><button type="button" disabled={busy} onClick={() => void logout()} className="focus-ring flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-muted hover:bg-accent-red/10 hover:text-accent-red disabled:opacity-50">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}Sign out</button>{error && <p role="alert" className="px-3 py-2 text-xs text-accent-red">{error}</p>}</div>
    </div>}
  </div>;
}
