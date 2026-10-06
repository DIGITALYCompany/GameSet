import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useWorkspace } from '@/hooks/useWorkspace';
import { createPortal } from 'react-dom';
import { Crosshair, Settings2, ArrowRight, RotateCcw } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { GameSelector } from '@/components/sensitivity/GameSelector';
import { PlayerInput } from '@/components/sensitivity/PlayerInput';
import { ComparisonView } from '@/components/sensitivity/ComparisonView';
import { FloatingComparison, FloatingResult } from '@/components/sensitivity/FloatingComparison';
import { useFloatingWindow } from '@/hooks/useFloatingWindow';
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
import { cn } from '@/utils/cn';
import type { GameConfig, GameId, SensitivityResult } from '@/types';

type Phase = 'setup' | 'testing' | 'result';

export function SensitivityPage() {
  const [searchParams] = useSearchParams();
  const { data: workspace } = useWorkspace();
  const { user } = useAuth();
  const floating = useFloatingWindow();

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
    gapPercent: 0,
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

    const savedGameId = searchParams.get('game') || getSelectedGame();
    if (savedGameId) {
      const game = getGame(savedGameId as GameId);
      if (game) {
        setSelectedGame(game);
        setSensitivity(String(game.defaultSens));
      }
    }
  }, [searchParams]);

  const handleGameSelect = (game: GameConfig) => {
    setSelectedGame(game);
    saveSelectedGame(game.id);
    setSensError('');
    // Pre-fill sensitivity if empty
    if (!sensitivity) {
      setSensitivity(String(game.defaultSens));
    }
  };

  const loadMySetup = () => {
    const setup = workspace.setups.find(item => item.gameId === selectedGame?.id);
    if (!setup) return;
    setDpi(String(setup.dpi));
    setSensitivity(String(setup.sensitivity));
    setDpiError('');
    setSensError('');
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
    } else if (sensNum < selectedGame.sensScale.min || sensNum > selectedGame.sensScale.max) {
      setSensError(
        `Valid range: ${selectedGame.sensDisplay}`
      );
      hasError = true;
    } else {
      setSensError('');
    }

    if (hasError) return;

    // Create engine and start test
    const engine = new SensitivityFinderEngine(sensNum, rounds);
    engineRef.current = engine;
    syncComparison(engine);
    setPhase('testing');
  };

  const syncComparison = (engine: SensitivityFinderEngine) => {
    setComparison({ ...engine.getCurrentComparison(), gapPercent: engine.currentGapPercent });
  };

  const handleChoice = (choice: 'lower' | 'higher' | 'same') => {
    const engine = engineRef.current;
    if (!engine) return;
    if (choice === 'lower') engine.selectLower();
    else if (choice === 'higher') engine.selectHigher();
    else engine.selectSame();
    if (engine.phase === 'result') {
      finishTest();
    } else {
      syncComparison(engine);
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
      rounds: engine.round,
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
    floating.close();
    setPhase('setup');
    setResultData(null);
    setSaved(false);
    engineRef.current = null;
  };

  const handleExitTest = () => {
    setPhase('setup');
    engineRef.current = null;
    floating.close();
  };

  const handleRestartTest = () => {
    const current = engineRef.current;
    if (!current) return;
    const engine = new SensitivityFinderEngine(current.startingSensitivity, rounds);
    engineRef.current = engine;
    syncComparison(engine);
  };

  const floatingTarget = floating.floatingWindow;

  if (phase === 'testing') {
    return (
      <>
        <ComparisonView
          round={comparison.round}
          totalRounds={comparison.totalRounds}
          lower={comparison.lower}
          higher={comparison.higher}
          gapPercent={comparison.gapPercent}
          onChoose={handleChoice}
          onExit={handleExitTest}
          onRestart={handleRestartTest}
          canDetach={floating.supported}
          detached={!!floatingTarget}
          onDetach={() => floating.open(340, 380)}
          onReattach={floating.close}
        />
        {floatingTarget &&
          createPortal(
            <FloatingComparison
              round={comparison.round}
              totalRounds={comparison.totalRounds}
              lower={comparison.lower}
              higher={comparison.higher}
              gapPercent={comparison.gapPercent}
              onChoose={handleChoice}
              onReattach={floating.close}
              onRestart={handleRestartTest}
              target={floatingTarget}
            />,
            floatingTarget.document.body
          )}
      </>
    );
  }

  if (phase === 'result' && resultData) {
    return (
      <>
        {floatingTarget &&
          createPortal(
            <FloatingResult sensitivity={resultData.sensitivity} gameName={resultData.gameName} onClose={floating.close} />,
            floatingTarget.document.body
          )}
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
      </>
    );
  }

  // Setup view
  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Header */}
        <div className="mb-8">
          <div className="badge">
            <Crosshair className="h-3.5 w-3.5 text-accent-purple" />
            <span className="text-ink-muted">Sensitivity Finder</span>
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
            <>
            {workspace.setups.some(item => item.gameId === selectedGame.id) && <button type="button" onClick={loadMySetup} className="mb-4 rounded text-xs text-accent-purple-light focus-ring">Use my saved {selectedGame.name} setup</button>}
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
            </>
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
              <p className="text-sm font-medium text-ink">Test depth</p>
              <p className="mt-1 max-w-xs text-xs leading-relaxed text-ink-muted">
                Each round narrows the search. Deeper tests pin your sensitivity
                down more precisely. You can finish early anytime both values feel the same.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {ROUND_PRESETS.map((preset) => (
                <button
                  key={preset.rounds}
                  type="button"
                  onClick={() => setRounds(preset.rounds)}
                  aria-pressed={rounds === preset.rounds}
                  className={cn(
                    'flex flex-col items-center rounded-lg border px-4 py-2.5 transition-all duration-200 focus-ring',
                    rounds === preset.rounds
                      ? 'border-accent-purple bg-accent-purple/10 text-accent-purple shadow-glow-sm'
                      : 'border-border bg-base-surface-2 text-ink-muted hover:border-white/15 hover:text-ink hover:bg-base-surface-3'
                  )}
                >
                  <span className="text-sm font-semibold">{preset.label}</span>
                  <span className="mt-0.5 font-mono text-[11px] opacity-80">
                    {preset.rounds} rounds
                  </span>
                  <span className="font-mono text-[11px] opacity-60">
                    ±{SensitivityFinderEngine.precisionFor(preset.rounds).toFixed(1)}%
                  </span>
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
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-base-surface-2 p-4">
          <Settings2 className="mt-0.5 h-4 w-4 shrink-0 text-ink-dim" />
          <p className="text-sm leading-relaxed text-ink-muted">
            Each round shows two values. Set each one in your game, do a few
            flicks and tracking, then pick the one that felt better. Your result
            will land within ±{SensitivityFinderEngine.precisionFor(rounds).toFixed(1)}%
            of your ideal sensitivity, anywhere from half to one and a half times your
            current value.
          </p>
        </div>
      </div>
    </Layout>
  );
}

const ROUND_PRESETS = [
  { rounds: 5, label: 'Quick' },
  { rounds: 7, label: 'Balanced' },
  { rounds: 10, label: 'Precise' },
];

function StepHeader({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-base-surface-3 font-mono text-xs font-bold text-ink-muted">
        {number}
      </span>
      <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
    </div>
  );
}
