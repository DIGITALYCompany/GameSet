import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Lock, LogOut, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useSettings } from '@/hooks/useSettings';
import { clearAllData } from '@/lib/storage';
import { cn } from '@/utils/cn';
import { SectionHeader, SettingRow, Toggle } from './AccountUI';

export function SettingsSection({ isPremium, onSignOut }: { isPremium: boolean; onSignOut: () => void }) {
  const { settings, update } = useSettings();
  const [confirmClear, setConfirmClear] = useState(false);
  const [cleared, setCleared] = useState(false);
  const rounds = [5, 7, 10, 15, 20];

  const clear = () => {
    clearAllData();
    setConfirmClear(false);
    setCleared(true);
    window.setTimeout(() => setCleared(false), 2500);
  };

  return (
    <div className="space-y-10">
      <section>
        <SectionHeader title="Preferences" description="Saved on this device." />
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-6">
          <SettingRow title="Sound effects" description="Subtle sounds on selections and results.">
            <Toggle checked={settings.soundEffects} onChange={(v) => update({ soundEffects: v })} label="Sound effects" />
          </SettingRow>
          <SettingRow title="Reduced motion" description="Minimise animations and transitions.">
            <Toggle checked={settings.reducedMotion} onChange={(v) => update({ reducedMotion: v })} label="Reduced motion" />
          </SettingRow>
          <SettingRow title="Default rounds" description="How many rounds a new sensitivity test uses.">
            <div className="inline-flex rounded-lg border border-white/[0.08] bg-white/[0.02] p-1">
              {rounds.map((r) => {
                const locked = !isPremium && r > 10;
                const active = settings.defaultRounds === r;
                return (
                  <button
                    key={r}
                    type="button"
                    disabled={locked}
                    onClick={() => update({ defaultRounds: r })}
                    aria-pressed={active}
                    title={locked ? 'Available on paid plans' : undefined}
                    className={cn(
                      'relative flex h-8 min-w-[40px] items-center justify-center gap-1 rounded-md px-2 text-sm font-medium tabular-nums transition-all duration-200 focus-ring',
                      active ? 'bg-accent-purple text-white' : 'text-ink-muted hover:text-ink',
                      locked && 'cursor-not-allowed opacity-40 hover:text-ink-muted'
                    )}
                  >
                    {r}
                    {locked && <Lock className="h-3 w-3" />}
                  </button>
                );
              })}
            </div>
          </SettingRow>
          {!isPremium && (
            <p className="mt-4 text-xs text-ink-dim">
              Longer tests are available on paid plans.{' '}
              <Link to="/pricing" className="font-medium text-accent-purple-light hover:underline">See plans</Link>
            </p>
          )}
        </div>
      </section>

      <section>
        <SectionHeader title="Session" />
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-6">
          <SettingRow title="Sign out" description="Sign out of your account on this device.">
            <Button variant="secondary" size="sm" onClick={onSignOut}>
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </SettingRow>
        </div>
      </section>

      <section>
        <SectionHeader title="Danger zone" />
        <div className="rounded-xl border border-accent-red/20 bg-accent-red/[0.04] p-6">
          <SettingRow
            title="Clear local data"
            description="Removes history, settings and selected game stored on this device. Your account data is kept."
          >
            {cleared ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-green">
                <Check className="h-4 w-4" />
                Cleared
              </span>
            ) : confirmClear ? (
              <div className="flex items-center gap-2 animate-fade-in">
                <Button variant="ghost" size="sm" onClick={() => setConfirmClear(false)}>Cancel</Button>
                <Button variant="danger" size="sm" onClick={clear}>Confirm</Button>
              </div>
            ) : (
              <Button variant="danger" size="sm" onClick={() => setConfirmClear(true)}>
                <Trash2 className="h-4 w-4" />
                Clear data
              </Button>
            )}
          </SettingRow>
        </div>
      </section>
    </div>
  );
}
