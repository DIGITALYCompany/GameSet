import { useState } from 'react';
import { Save, RotateCcw, Copy, Check } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { round } from '@/utils/calculations';

interface ResultViewProps {
  sensitivity: number;
  dpi: number;
  edpi: number;
  cm360: number;
  gameName: string;
  rounds: number;
  initialSensitivity: number;
  onSave: () => void;
  onRunAgain: () => void;
  saved?: boolean;
}

export function ResultView({
  sensitivity,
  dpi,
  edpi,
  cm360,
  gameName,
  rounds,
  initialSensitivity,
  onSave,
  onRunAgain,
  saved,
}: ResultViewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = [
      'GAMESET Sensitivity Result',
      '',
      `Game: ${gameName}`,
      `DPI: ${dpi}`,
      `Sensitivity: ${round(sensitivity, 2)}`,
      `eDPI: ${round(edpi, 0)}`,
      `cm/360: ${round(cm360, 1)}`,
    ].join('\n');

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-base-bg">
      {/* Minimal focused header */}
      <div className="border-b border-border px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Logo size="sm" />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <div className="mx-auto w-full max-w-2xl animate-slide-up">
          {/* Result */}
          <div className="text-center">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-ink-muted">
              Your GAMESET Sensitivity
            </p>
            <p className="mt-4 font-mono text-6xl font-bold text-ink sm:text-7xl animate-pop">
              {round(sensitivity, 2)}
            </p>
            <p className="mt-3 text-sm text-ink-dim">
              Starting sensitivity was{' '}
              <span className="font-mono text-ink-muted">
                {round(initialSensitivity, 2)}
              </span>
            </p>
          </div>

          {/* Stats grid */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <StatTile label="DPI" value={String(dpi)} />
            <StatTile label="eDPI" value={String(round(edpi, 0))} />
            <StatTile label="cm / 360°" value={String(round(cm360, 1))} />
            <StatTile label="Game" value={gameName} />
            <StatTile label="Rounds" value={String(rounds)} />
            <StatTile
              label="Adjustment"
              value={`${sensitivity > initialSensitivity ? '+' : ''}${round(sensitivity - initialSensitivity, 2)}`}
            />
          </div>

          {/* Actions */}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={onSave}
              disabled={saved}
              className="sm:min-w-[160px]"
            >
              <Save className="h-5 w-5" />
              {saved ? 'Saved' : 'Save Result'}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={handleCopy}
              className="sm:min-w-[160px]"
            >
              {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              {copied ? 'Copied' : 'Copy Result'}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={onRunAgain}
              className="sm:min-w-[160px]"
            >
              <RotateCcw className="h-5 w-5" />
              Run Another Test
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-base-surface p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-ink-dim">
        {label}
      </p>
      <p className="mt-1.5 font-mono text-lg font-bold text-ink">{value}</p>
    </div>
  );
}
