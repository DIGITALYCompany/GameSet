import { Crosshair } from 'lucide-react';
import { AVATARS, type AvatarKey } from './avatars';
import { cn } from '@/utils/cn';
import type { SubscriptionTier } from '@/types';

export interface CloudTest {
  id: string;
  game_id: string;
  game_name: string;
  dpi: number;
  sensitivity: number;
  edpi: number;
  cm360: number;
  rounds: number;
  initial_sensitivity: number;
  fov: number | null;
  created_at: string;
}

export interface ProfileData {
  username: string;
  subscription_tier: SubscriptionTier;
  subscription_status: string | null;
  avatar_emoji: string | null;
  main_game_id: string | null;
}

export function Avatar({ value, size = 'md' }: { value: string | null; size?: 'sm' | 'md' | 'lg' }) {
  const Icon = value && value in AVATARS ? AVATARS[value as AvatarKey] : Crosshair;
  const dims = { sm: 'h-10 w-10 rounded-lg', md: 'h-14 w-14 rounded-xl', lg: 'h-20 w-20 rounded-2xl' }[size];
  const icon = { sm: 'h-5 w-5', md: 'h-6 w-6', lg: 'h-9 w-9' }[size];
  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center border border-white/10 bg-gradient-to-br from-accent-purple/30 via-accent-purple/10 to-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]',
        dims
      )}
    >
      <Icon className={cn('text-white', icon)} strokeWidth={1.75} />
    </div>
  );
}

export function GameMark({ name, color, size = 'md' }: { name: string; color?: string; size?: 'sm' | 'md' }) {
  const initials = name.split(/[\s/]+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center border font-display font-bold',
        size === 'sm' ? 'h-9 w-9 rounded-lg text-[11px]' : 'h-11 w-11 rounded-xl text-xs'
      )}
      style={{
        backgroundColor: color ? `${color}1A` : 'rgba(255,255,255,0.04)',
        borderColor: color ? `${color}33` : 'rgba(255,255,255,0.08)',
        color: color ?? '#9292A0',
      }}
    >
      {initials}
    </div>
  );
}

export function SectionHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-lg font-semibold tracking-tight text-ink">{title}</h2>
        {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, text, action }: { icon: typeof Crosshair; title: string; text: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.015] px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03]">
        <Icon className="h-5 w-5 text-ink-muted" />
      </div>
      <p className="mt-4 text-sm font-semibold text-ink">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-ink-muted">{text}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function StatTile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-dim">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold tabular-nums text-ink">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-ink-dim">{hint}</p>}
    </div>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (value: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-200 focus-ring',
        checked ? 'border-accent-purple bg-accent-purple' : 'border-white/10 bg-white/[0.06]'
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ease-smooth',
          checked ? 'translate-x-[22px]' : 'translate-x-1'
        )}
      />
    </button>
  );
}

export function SettingRow({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 border-b border-white/[0.06] py-5 first:pt-0 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="max-w-md">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="mt-0.5 text-sm text-ink-muted">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
