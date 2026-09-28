import { useEffect, useRef, useState } from 'react';
import { Crosshair, Settings2, ArrowRight, RotateCcw } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { GameSelector } from '@/components/sensitivity/GameSelector';
import { PlayerInput } from '@/components/sensitivity/PlayerInput';
import { ComparisonView } from '@/components/sensitivity/ComparisonView';
import { ResultView } from '@/components/sensitivity/ResultView';
import { SensitivityFinderEngine } from '@/lib/sensitivityFinderEngine';
import {
  saveTest,
  getSettings,
  saveSelectedGame,
  getSelectedGame,
} from '@/lib/storage';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { getGame } from '@/data/games';
import { calcEdpi, calcCm360 } from '@/utils/calculations';
import { generateId } from '@/utils/helpers';
import type { GameConfig, GameId, SensitivityResult } from '@/types';

type Phase = 'setup' | 'testing' | 'result';

export function SensitivityPage() {
  const { user } = useAuth();

  // Setup state
  const [phase, setPhase] = useState<Phase>('setup');
  const [selectedGame, setSelectedGame] = useState<GameConfig | null>(null);
  const [dpi, setDpi] = useState('800');
  const [sensitivity, setSensitivity] = useState('');
  const [fov, setFov] = useState('');
  const [dpiError, setDpiError] = useState('');
  const [sensError, setSensError] = useState('');
  const [rounds, setRounds] = useState(7);

  // Engine state
  const engineRef = useRef<SensitivityFinderEngine | null>(null);
  const [comparison, setComparison] = useState({
    round: 1,
    totalRounds: 7,
    lower: 0,
    higher: 0,
  });
  const [resultData, setResultData] = useState<{
    sensitivity: number;
    dpi: number;
    edpi: number;
    cm360: number;
    gameName: string;
    rounds: number;
    initialSensitivity: number;
  } | null>(null);
  const [saved, setSaved] = useState(false);

  // Restore selected game from storage and load default rounds
  useEffect(() => {
    const settings = getSettings();
    setRounds(settings.defaultRounds);

    const savedGameId = getSelectedGame();
    if (savedGameId) {
      const game = getGame(savedGameId as GameId);
      if (game) {
        setSelectedGame(game);
        setSensitivity(String(game.defaultSens));
      }
    }
  }, []);

  const handleGameSelect = (game: GameConfig) => {
    setSelectedGame(game);
    saveSelectedGame(game.id);
    setSensError('');
    // Pre-fill sensitivity if empty
    if (!sensitivity) {
      setSensitivity(String(game.defaultSens));
    }
  };

  const validateAndStart = () => {
    if (!selectedGame) {
      setSensError('Select a game to continue');
      return;
    }

    const dpiNum = parseFloat(dpi);
    const sensNum = parseFloat(sensitivity);

    let hasError = false;
    if (isNaN(dpiNum) || dpiNum <= 0) {
      setDpiError('Enter a valid DPI');
      hasError = true;
    } else {
      setDpiError('');
    }

    if (isNaN(sensNum) || sensNum <= 0) {
      setSensError('Enter a valid sensitivity');
      hasError = true;
    } else if (sensNum < selectedGame.sensRange.min || sensNum > selectedGame.sensRange.max) {
      setSensError(
        `Sensitivity range: ${selectedGame.sensRange.min}–${selectedGame.sensRange.max}`
      );
      hasError = true;
    } else {
      setSensError('');
    }

    if (hasError) return;

    // Create engine and start test
    const engine = new SensitivityFinderEngine(sensNum, rounds);
    engineRef.current = engine;
    setComparison(engine.getCurrentComparison());
    setPhase('testing');
  };

  const handleLower = () => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.selectLower();
    if (engine.phase === 'result') {
      finishTest();
    } else {
      setComparison(engine.getCurrentComparison());
    }
  };

  const handleHigher = () => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.selectHigher();
    if (engine.phase === 'result') {
      finishTest();
    } else {
      setComparison(engine.getCurrentComparison());
    }
  };

  const finishTest = () => {
    const engine = engineRef.current;
    if (!engine || !selectedGame) return;

    const result = engine.getResult();
    if (result === null) return;

    const dpiNum = parseFloat(dpi);
    const edpi = calcEdpi(dpiNum, result);
    const cm360 = calcCm360(dpiNum, result, selectedGame);

    setResultData({
      sensitivity: result,
      dpi: dpiNum,
      edpi,
      cm360,
      gameName: selectedGame.name,
      rounds: engine.totalRounds,
      initialSensitivity: engine.startingSensitivity,
    });
    setSaved(false);
    setPhase('result');
  };

  const handleSave = () => {
    if (!resultData || !selectedGame) return;

    const result: SensitivityResult = {
      id: generateId(),
      gameId: selectedGame.id,
      gameName: selectedGame.name,
      date: new Date().toISOString(),
      dpi: resultData.dpi,
      sensitivity: resultData.sensitivity,
      edpi: resultData.edpi,
      cm360: resultData.cm360,
      rounds: resultData.rounds,
      initialSensitivity: resultData.initialSensitivity,
      fov: fov ? parseFloat(fov) : undefined,
    };

    // Save locally (always)
    saveTest(result);

    // Sync to cloud if signed in
    if (user) {
      supabase.from('cloud_test_results').insert({
        game_id: selectedGame.id,
        game_name: selectedGame.name,
        dpi: resultData.dpi,
        sensitivity: resultData.sensitivity,
        edpi: resultData.edpi,
        cm360: resultData.cm360,
        rounds: resultData.rounds,
        initial_sensitivity: resultData.initialSensitivity,
        fov: fov ? parseInt(fov, 10) : null,
      }).then(({ error }) => {
        if (error) {
          // Cloud save failed — local save still succeeded
          // Silently continue; the user's data is safe locally
        }
      });
    }

    setSaved(true);
  };

  const handleRunAgain = () => {
    setPhase('setup');
    setResultData(null);
    setSaved(false);
    engineRef.current = null;
  };

  const handleExitTest = () => {
    setPhase('setup');
    engineRef.current = null;
  };

  // Focused testing view — no nav, no footer
  if (phase === 'testing') {
    return (
      <ComparisonView
        round={comparison.round}
        totalRounds={comparison.totalRounds}
        lower={comparison.lower}
        higher={comparison.higher}
        onLower={handleLower}
        onHigher={handleHigher}
        onExit={handleExitTest}
      />
    );
  }

  // Focused result view
  if (phase === 'result' && resultData) {
    return (
      <ResultView
        sensitivity={resultData.sensitivity}
        dpi={resultData.dpi}
        edpi={resultData.edpi}
        cm360={resultData.cm360}
        gameName={resultData.gameName}
        rounds={resultData.rounds}
        initialSensitivity={resultData.initialSensitivity}
        onSave={handleSave}
        onRunAgain={handleRunAgain}
        saved={saved}
      />
    );
  }

  // Setup view
  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-md border border-border bg-base-surface px-3 py-1.5">
            <Crosshair className="h-3.5 w-3.5 text-accent-purple" />
            <span className="text-xs font-medium text-ink-muted">
              Sensitivity Finder
            </span>
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Sensitivity Finder
          </h1>
          <p className="mt-2 max-w-xl text-base leading-relaxed text-ink-muted">
            Find a sensitivity that feels natural to you through a progressive
            comparison process.
          </p>
        </div>

        {/* Step 1: Game selection */}
        <StepHeader number={1} title="Select your game" />
        <Card className="mb-6 mt-3">
          <GameSelector
            selectedId={selectedGame?.id ?? null}
            onSelect={handleGameSelect}
          />
        </Card>

        {/* Step 2: Player input */}
        <StepHeader number={2} title="Enter your current settings" />
        <Card className="mb-6 mt-3">
          {selectedGame ? (
            <PlayerInput
              game={selectedGame}
              dpi={dpi}
              sensitivity={sensitivity}
              fov={fov}
              dpiError={dpiError}
              sensError={sensError}
              onDpiChange={setDpi}
              onSensitivityChange={setSensitivity}
              onFovChange={setFov}
            />
          ) : (
            <p className="py-8 text-center text-sm text-ink-dim">
              Select a game to enter your settings
            </p>
          )}
        </Card>

        {/* Step 3: Rounds config */}
        <StepHeader number={3} title="Configure test" />
        <Card className="mb-8 mt-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-ink">Number of rounds</p>
              <p className="mt-1 text-xs text-ink-muted">
                More rounds = more precision, but takes longer
              </p>
            </div>
            <div className="flex items-center gap-2">
              {[5, 7, 10].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRounds(r)}
                  aria-pressed={rounds === r}
                  className={
                    rounds === r
                      ? 'rounded-md border border-accent-purple bg-accent-purple/10 px-4 py-2 text-sm font-semibold text-accent-purple focus-ring'
                      : 'rounded-md border border-border bg-base-surface-2 px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:border-white/15 hover:text-ink focus-ring'
                  }
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Start button */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="ghost"
            size="lg"
            onClick={handleRunAgain}
          >
            <RotateCcw className="h-5 w-5" />
            Reset
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={validateAndStart}
            disabled={!selectedGame}
          >
            <ArrowRight className="h-5 w-5" />
            Start Sensitivity Test
          </Button>
        </div>

        {/* Info note */}
        <div className="mt-6 flex items-start gap-3 rounded-md border border-border bg-base-surface-2 p-4">
          <Settings2 className="mt-0.5 h-4 w-4 shrink-0 text-ink-dim" />
          <p className="text-sm leading-relaxed text-ink-muted">
            You'll be presented with two sensitivity values each round. Test
            both in your game and choose which felt better. The test takes about{' '}
            {rounds} rounds and narrows your optimal range progressively.
          </p>
        </div>
      </div>
    </Layout>
  );
}

function StepHeader({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-base-surface-3 font-mono text-xs font-bold text-ink-muted">
        {number}
      </span>
      <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
    </div>
  );
}
