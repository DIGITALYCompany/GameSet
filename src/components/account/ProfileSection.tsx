import { GameIcon } from '@/components/games/GameIcon';
import { AVATARS, type AvatarKey } from './avatars';
import { useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { GAMES } from '@/data/games';
import { cn } from '@/utils/cn';
import { Avatar, SectionHeader, type ProfileData } from './AccountUI';

interface Props {
  profile: ProfileData;
  email: string;
  onSave: (patch: Partial<ProfileData>) => Promise<boolean>;
}

export function ProfileSection({ profile, email, onSave }: Props) {
  const [username, setUsername] = useState(profile.username);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle');

  useEffect(() => setUsername(profile.username), [profile.username]);

  const trimmed = username.trim();
  const nameError = trimmed.length > 0 && (trimmed.length < 2 || trimmed.length > 24) ? 'Use between 2 and 24 characters.' : undefined;
  const canSave = trimmed.length >= 2 && !nameError && trimmed !== profile.username && !saving;

  const run = async (patch: Partial<ProfileData>) => {
    setSaving(true);
    const ok = await onSave(patch);
    setSaving(false);
    setStatus(ok ? 'saved' : 'error');
    window.setTimeout(() => setStatus('idle'), 2200);
  };

  return (
    <div className="space-y-10">
      <section>
        <SectionHeader title="Public profile" description="How you appear across the platform." />
        <div className="rounded-2xl border border-white/[0.12] bg-[#12121b] p-5 sm:p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (canSave) run({ username: trimmed });
            }}
            className="flex flex-col gap-4 sm:flex-row sm:items-start"
          >
            <div className="min-w-0 flex-1">
              <Input
                label="Display name"
                name="username"
                placeholder="Choose your player name"
                maxLength={24}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={nameError}
              />
            </div>
            <Button type="submit" variant="primary" disabled={!canSave} className="h-[46px] sm:mt-[26px] disabled:opacity-100 disabled:border-white/10 disabled:bg-none disabled:bg-[#252532] disabled:text-[#b3b3c3] disabled:shadow-none">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
            </Button>
          </form>
          <div className="mt-5 border-t border-white/[0.06] pt-5">
            <p className="text-sm font-medium text-ink">Email</p>
            <p className="mt-1 break-all text-sm text-ink">{email}</p>
          </div>
          <StatusLine status={status} />
        </div>
      </section>

      <section>
        <SectionHeader title="Avatar" description="Pick an icon that represents your playstyle." />
        <div className="grid grid-cols-6 gap-2 sm:grid-cols-12">
          {(Object.keys(AVATARS) as AvatarKey[]).map((key) => {
            const Icon = AVATARS[key];
            const active = profile.avatar_emoji === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => run({ avatar_emoji: key })}
                aria-label={`Avatar ${key}`}
                aria-pressed={active}
                className={cn(
                  'flex aspect-square items-center justify-center rounded-xl border transition-all duration-200 ease-smooth focus-ring',
                  active
                    ? 'border-accent-purple/60 bg-accent-purple/15 text-white shadow-[0_0_0_3px_rgba(142,59,255,0.15)]'
                    : 'border-white/[0.12] bg-[#161620] text-ink-muted hover:-translate-y-0.5 hover:border-white/15 hover:text-ink'
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex items-center gap-3 text-sm text-ink-muted">
          <Avatar value={profile.avatar_emoji} size="sm" />
          Preview
        </div>
      </section>

      <section>
        <SectionHeader title="Main game" description="Used to personalise your dashboard and shortcuts." />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {GAMES.map((game) => {
            const active = profile.main_game_id === game.id;
            return (
              <button
                key={game.id}
                type="button"
                onClick={() => run({ main_game_id: game.id })}
                aria-pressed={active}
                className={cn(
                  'flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all duration-200 focus-ring',
                  active
                    ? 'border-accent-purple/50 bg-accent-purple/10 text-ink'
                    : 'border-white/[0.12] bg-[#161620] text-ink-muted hover:border-white/15 hover:text-ink'
                )}
              >
                <span className="flex items-center gap-3">
                  <GameIcon gameId={game.id} size="xs" />
                  {game.name}
                </span>
                {active && <Check className="h-4 w-4 text-accent-purple-light" />}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function StatusLine({ status }: { status: 'idle' | 'saved' | 'error' }) {
  if (status === 'idle') return null;
  return (
    <p
      role="status"
      className={cn('mt-4 animate-fade-in text-sm', status === 'saved' ? 'text-accent-green' : 'text-accent-red')}
    >
      {status === 'saved' ? 'Changes saved.' : 'Could not save your changes. Please try again.'}
    </p>
  );
}
