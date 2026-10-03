import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

export function EdpiCalculatorPage() {
  const [dpi, setDpi] = useState('800');
  const [sensitivity, setSensitivity] = useState('0.4');

  const dpiNum = parseFloat(dpi);
  const sensNum = parseFloat(sensitivity);
  const valid = !isNaN(dpiNum) && dpiNum > 0 && !isNaN(sensNum) && sensNum > 0;
  const edpi = valid ? dpiNum * sensNum : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-md border border-border bg-base-surface px-3 py-1.5">
            <Calculator className="h-3.5 w-3.5 text-accent-purple" />
            <span className="text-xs font-medium text-ink-muted">eDPI Calculator</span>
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            eDPI Calculator
          </h1>
          <p className="mt-2 text-base text-ink-muted">
            eDPI (effective DPI) combines your mouse DPI and in-game sensitivity
            into a single number that lets you compare setups across players.
          </p>
        </div>

        <Card className="mb-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="DPI"
              type="number"
              name="dpi"
              inputMode="numeric"
              placeholder="800"
              value={dpi}
              onChange={(e) => setDpi(e.target.value)}
            />
            <Input
              label="Sensitivity"
              type="number"
              name="sensitivity"
              step="any"
              inputMode="decimal"
              placeholder="0.4"
              value={sensitivity}
              onChange={(e) => setSensitivity(e.target.value)}
            />
          </div>
        </Card>

        <div className="rounded-lg border border-border bg-base-surface p-8 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-ink-dim">
            Your eDPI
          </p>
          <p className="mt-3 font-mono text-5xl font-bold text-ink">
            {edpi !== null ? edpi : '—'}
          </p>
          <p className="mt-4 text-sm text-ink-muted">
            Formula: DPI × Sensitivity = eDPI
          </p>
          {valid && (
            <p className="mt-2 font-mono text-xs text-ink-dim">
              {dpiNum} × {sensNum} = {edpi}
            </p>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <RangeCard label="Low" range="200–400" note="High precision, more arm movement" />
          <RangeCard label="Average" range="400–800" note="Balanced — most pros sit here" />
          <RangeCard label="High" range="800+" note="Fast flicks, less arm movement" />
        </div>
      </div>
  );
}

function RangeCard({ label, range, note }: { label: string; range: string; note: string }) {
  return (
    <div className="rounded-md border border-border bg-base-surface-2 p-4">
      <p className="text-sm font-semibold text-ink">{label}</p>
      <p className="mt-1 font-mono text-lg font-bold text-accent-purple">{range}</p>
      <p className="mt-1 text-xs text-ink-muted">{note}</p>
    </div>
  );
}
