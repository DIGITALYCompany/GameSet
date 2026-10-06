import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Eye, X, History as HistoryIcon, Crosshair, ArrowLeft } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getTests, deleteTest, clearTests } from '@/lib/storage';
import { formatDate, formatDateTime } from '@/utils/helpers';
import { round } from '@/utils/calculations';
import type { SensitivityResult } from '@/types';

export function HistoryPage() {
  const [tests, setTests] = useState<SensitivityResult[]>(() => getTests());
  const [viewing, setViewing] = useState<SensitivityResult | null>(null);

  const handleDelete = (id: string) => {
    deleteTest(id);
    setTests(getTests());
  };

  const handleClear = () => {
    clearTests();
    setTests([]);
  };

  const hasTests = tests.length > 0;

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              History
            </h1>
            <p className="mt-3 text-lg text-ink-muted">
              Your previous sensitivity tests saved on this device.
            </p>
          </div>
          {hasTests && (
            <Button
              variant="danger"
              size="sm"
              onClick={handleClear}
              className="shrink-0"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>

        {/* Empty state */}
        {!hasTests && (
          <Card className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-base-surface-3">
              <HistoryIcon className="h-8 w-8 text-ink-dim" />
            </div>
            <h2 className="mt-5 font-display text-xl font-semibold text-ink">
              No tests yet
            </h2>
            <p className="mt-2 max-w-xs text-sm text-ink-muted">
              Complete a sensitivity test to see your results here.
            </p>
            <Link to="/sensitivity" className="mt-6">
              <Button variant="primary" size="md">
                <Crosshair className="h-4 w-4" />
                Find Your Sensitivity
              </Button>
            </Link>
          </Card>
        )}

        {/* Test list */}
        {hasTests && (
          <div className="space-y-3">
            {tests.map((test) => (
              <Card
                key={test.id}
                hover
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-purple/15 to-accent-magenta/10 transition-transform group-hover:scale-110">
                    <Crosshair className="h-5 w-5 text-accent-purple" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-base font-semibold text-ink">
                      {test.gameName}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-dim">
                      {formatDate(test.date)} · {test.rounds} rounds
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 sm:flex sm:items-center sm:gap-6">
                  <Stat label="Sens" value={round(test.sensitivity, 2).toString()} />
                  <Stat label="eDPI" value={round(test.edpi, 0).toString()} />
                  <Stat label="cm/360" value={round(test.cm360, 1).toString()} />
                </div>

                <div className="flex items-center gap-2 sm:shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewing(test)}
                    aria-label={`View ${test.gameName} test details`}
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(test.id)}
                    aria-label={`Delete ${test.gameName} test`}
                    className="text-accent-red hover:text-accent-red hover:bg-accent-red/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Back link */}
        <div className="mt-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </div>

      {/* Detail modal */}
      {viewing && (
        <DetailModal result={viewing} onClose={() => setViewing(null)} />
      )}
    </Layout>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-left sm:text-right">
      <p className="text-xs font-medium uppercase tracking-wider text-ink-dim">
        {label}
      </p>
      <p className="mt-0.5 font-mono text-sm font-bold text-ink">{value}</p>
    </div>
  );
}

function DetailModal({
  result,
  onClose,
}: {
  result: SensitivityResult;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Test details"
    >
      <Card
        noPadding
        className="w-full max-w-md animate-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-lg font-semibold text-ink">
            Test Details
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-base-surface-2 hover:text-ink focus-ring"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 p-5">
          <DetailRow label="Game" value={result.gameName} />
          <DetailRow label="Date" value={formatDateTime(result.date)} />
          <DetailRow label="DPI" value={String(result.dpi)} />
          <DetailRow
            label="Sensitivity"
            value={round(result.sensitivity, 3).toString()}
          />
          <DetailRow label="eDPI" value={round(result.edpi, 0).toString()} />
          <DetailRow
            label="cm / 360°"
            value={round(result.cm360, 1).toString()}
          />
          <DetailRow label="Rounds" value={String(result.rounds)} />
          <DetailRow
            label="Starting Sens"
            value={round(result.initialSensitivity, 3).toString()}
          />
          {result.fov && (
            <DetailRow label="FOV" value={`${result.fov}°`} />
          )}
        </div>
      </Card>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/50 pb-2.5 last:border-0">
      <span className="text-sm text-ink-muted">{label}</span>
      <span className="font-mono text-sm font-semibold text-ink">{value}</span>
    </div>
  );
}
