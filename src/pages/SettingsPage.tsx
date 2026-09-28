import { useState } from 'react';
import { Volume2, Sparkles, Hash, Trash2, Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useSettings } from '@/hooks/useSettings';
import { clearAllData } from '@/lib/storage';
import { cn } from '@/utils/cn';

export function SettingsPage() {
  const { settings, update } = useSettings();
  const [cleared, setCleared] = useState(false);

  const handleClearData = () => {
    clearAllData();
    setCleared(true);
    window.setTimeout(() => setCleared(false), 2500);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Settings
          </h1>
          <p className="mt-2 text-base text-ink-muted">
            Preferences are stored locally on your device.
          </p>
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          {/* Theme */}
          <Card className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-ink">Theme</p>
              <p className="mt-0.5 text-xs text-ink-muted">
                GAMESET uses a dark theme optimized for gaming
              </p>
            </div>
            <span className="rounded-md border border-border bg-base-surface-2 px-3 py-1.5 text-sm font-medium text-ink-muted">
              Dark
            </span>
          </Card>

          {/* Sound effects */}
          <Card className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-base-surface-3">
                <Volume2 className="h-4 w-4 text-ink-muted" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">Sound effects</p>
                <p className="mt-0.5 text-xs text-ink-muted">
                  Play subtle sounds on selections and results
                </p>
              </div>
            </div>
            <Toggle
              checked={settings.soundEffects}
              onChange={(v) => update({ soundEffects: v })}
              label="Sound effects"
            />
          </Card>

          {/* Reduced motion */}
          <Card className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-base-surface-3">
                <Sparkles className="h-4 w-4 text-ink-muted" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">Reduced motion</p>
                <p className="mt-0.5 text-xs text-ink-muted">
                  Minimize animations and transitions
                </p>
              </div>
            </div>
            <Toggle
              checked={settings.reducedMotion}
              onChange={(v) => update({ reducedMotion: v })}
              label="Reduced motion"
            />
          </Card>

          {/* Default rounds */}
          <Card>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-base-surface-3">
                <Hash className="h-4 w-4 text-ink-muted" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink">
                  Default number of rounds
                </p>
                <p className="mt-0.5 text-xs text-ink-muted">
                  Default rounds for new sensitivity tests
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              {[5, 7, 10].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => update({ defaultRounds: r })}
                  aria-pressed={settings.defaultRounds === r}
                  className={cn(
                    'rounded-md border px-4 py-2 text-sm font-medium transition-colors focus-ring',
                    settings.defaultRounds === r
                      ? 'border-accent-purple bg-accent-purple/10 text-accent-purple'
                      : 'border-border bg-base-surface-2 text-ink-muted hover:border-white/15 hover:text-ink'
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </Card>

          {/* Danger zone */}
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-5">
            <p className="text-sm font-semibold text-red-400">Danger zone</p>
            <p className="mt-1 text-xs text-ink-muted">
              Clear all local data including test history, settings, and
              selected game. This cannot be undone.
            </p>
            <Button
              variant="danger"
              size="sm"
              onClick={handleClearData}
              className="mt-4"
            >
              {cleared ? (
                <>
                  <Check className="h-4 w-4" />
                  Data Cleared
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Clear Local Data
                </>
              )}
            </Button>
          </div>
        </div>
    </div>
  );
}

interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}

function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-200 focus-ring',
        checked
          ? 'border-accent-purple bg-accent-purple'
          : 'border-border bg-base-surface-3'
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform duration-200',
          checked ? 'translate-x-[22px]' : 'translate-x-1'
        )}
      />
    </button>
  );
}
