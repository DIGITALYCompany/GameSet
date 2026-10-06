import { GameIcon } from "@/components/games/GameIcon";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Bookmark,
  Check,
  Cloud,
  Crosshair,
  HardDrive,
  Plus,
  Trash2,
  ArrowUpRight,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useWorkspace } from "@/hooks/useWorkspace";
import { GAMES } from "@/data/games";
import { TOOLS } from "@/data/tools";
import { calcCm360, round } from "@/utils/calculations";
import { readWorkspace, type GameSetup } from "@/lib/workspace";
import { cn } from "@/utils/cn";
import type { GameId } from "@/types";

const inputClass =
  "mt-2 w-full rounded-lg border border-white/10 bg-[#0c0c14] px-3 py-2.5 text-sm text-ink outline-none focus:border-accent-purple-light";
export function SetupSection() {
  const { user } = useAuth();
  const {
    data,
    status,
    storageError,
    saveSetup,
    deleteSetup,
    sync,
    importGuest,
    hasGuestData,
  } = useWorkspace();
  const [searchParams] = useSearchParams();
  const initialGame =
    GAMES.find((game) => game.id === searchParams.get("game")) || GAMES[0];
  const [gameId, setGameId] = useState<GameId>(initialGame.id);
  const [dpi, setDpi] = useState("800");
  const [sensitivity, setSensitivity] = useState(
    String(initialGame.defaultSens),
  );
  const [crosshair, setCrosshair] = useState("");
  const [mouse, setMouse] = useState("");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<GameId | null>(null);
  const game = GAMES.find((item) => item.id === gameId)!;
  const selected = data.setups.find((item) => item.gameId === gameId);
  const requestedSens = searchParams.get("sensitivity");
  const requestedDpi = searchParams.get("dpi");
  const requestedCrosshair = searchParams.get("crosshair");
  const owner = user?.id || "guest";
  const ready = status !== "loading";

  useEffect(() => {
    if (!ready) return;
    const existing = readWorkspace(owner).data.setups.find(
      (item) => item.gameId === gameId,
    );
    setDpi(requestedDpi || String(existing?.dpi || 800));
    setSensitivity(
      requestedSens || String(existing?.sensitivity || game.defaultSens),
    );
    setCrosshair(requestedCrosshair || existing?.crosshair || "");
    setMouse(existing?.mouse || "");
    setNotes(existing?.notes || "");
    setSaved(false);
    setError("");
  }, [
    gameId,
    game.defaultSens,
    owner,
    ready,
    requestedSens,
    requestedDpi,
    requestedCrosshair,
  ]);

  const dpiNum = Number(dpi);
  const sensNum = Number(sensitivity);
  const valid =
    Number.isInteger(dpiNum) &&
    dpiNum > 0 &&
    dpiNum <= 100000 &&
    Number.isFinite(sensNum) &&
    sensNum > 0 &&
    sensNum >= game.sensScale.min &&
    sensNum <= game.sensScale.max;
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!valid) {
      setError(
        `Enter a DPI from 1 to 100000 and a sensitivity within ${game.sensDisplay}.`,
      );
      return;
    }
    const setup: GameSetup = {
      gameId,
      dpi: dpiNum,
      sensitivity: sensNum,
      crosshair: crosshair.trim(),
      mouse: mouse.trim(),
      notes: notes.trim(),
      updatedAt: new Date().toISOString(),
    };
    saveSetup(setup);
    setSaved(true);
    setError("");
  };
  const update = (setter: (value: string) => void, value: string) => {
    setter(value);
    setSaved(false);
  };
  return (
    <>
      <div className="">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">YOUR PERSONAL LOADOUT</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              My setup.
            </h2>
            <p className="mt-4 max-w-xl text-base text-ink-muted">
              Your settings, your games, your favorite tools. Ready for the next
              session.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs text-ink-muted">
            {user ? (
              <Cloud className="h-3.5 w-3.5" />
            ) : (
              <HardDrive className="h-3.5 w-3.5" />
            )}
            {status === "loading"
              ? "Loading your setupâ€¦"
              : status === "syncing"
                ? "Syncingâ€¦"
                : status === "synced"
                  ? "Cloud synced"
                  : status === "error"
                    ? "Cloud sync pending"
                    : "Saved on this device"}
          </span>
        </div>
        {status === "error" && (
          <div
            role="status"
            className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-accent-orange/25 bg-accent-orange/5 p-4"
          >
            <p className="text-sm text-ink-muted">
              Your local changes are kept on this device. Cloud sync is
              unavailable or has changes waiting.
            </p>
            <button
              type="button"
              onClick={() => void sync()}
              className="rounded text-sm text-accent-orange focus-ring"
            >
              Retry sync
            </button>
          </div>
        )}
        {storageError && (
          <p role="alert" className="mt-4 text-sm text-accent-red">
            Device storage is unavailable. Keep this page open until cloud sync
            completes.
          </p>
        )}
        {hasGuestData && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 p-4">
            <p className="text-sm text-ink-muted">
              Bring your guest setups and favorites into your account. Existing
              game setups stay as they are.
            </p>
            <button
              type="button"
              disabled={!ready}
              onClick={importGuest}
              className="rounded text-sm text-accent-purple-light focus-ring disabled:opacity-40"
            >
              Import device setups
            </button>
          </div>
        )}
        <div className="mt-8 grid items-start gap-6 xl:grid-cols-[.7fr_1.3fr]">
          <aside className="space-y-5">
            <section className="rounded-xl border border-white/10 bg-base-surface p-5">
              <h2 className="font-display text-lg font-semibold text-ink">
                Saved loadouts{" "}
                <span className="ml-1 text-sm text-ink-muted">
                  {data.setups.length}/{GAMES.length}
                </span>
              </h2>
              <div className="mt-4 space-y-2">
                {data.setups.length ? (
                  data.setups.map((setup) => {
                    const item = GAMES.find((g) => g.id === setup.gameId)!;
                    return (
                      <div
                        key={setup.gameId}
                        className={cn(
                          "rounded-lg border p-3",
                          gameId === setup.gameId
                            ? "border-accent-purple/40 bg-accent-purple/5"
                            : "border-white/[0.08]",
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setGameId(setup.gameId);
                            setConfirmDelete(null);
                          }}
                          className="flex w-full items-center justify-between gap-3 rounded text-left focus-ring"
                        >
                          <div>
                            <p className="text-sm font-semibold text-ink">
                              {item.name}
                            </p>
                            <p className="mt-1 font-mono text-[10px] text-ink-muted">
                              {setup.dpi} DPI / {setup.sensitivity} sens
                            </p>
                          </div>
                          <GameIcon gameId={item.id} size="sm" />
                        </button>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <span className="font-mono text-[10px] text-ink-muted">
                            {round(
                              calcCm360(setup.dpi, setup.sensitivity, item),
                              1,
                            )}{" "}
                            cm/360
                          </span>
                          {confirmDelete === setup.gameId ? (
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  deleteSetup(setup.gameId);
                                  setConfirmDelete(null);
                                  setSaved(false);
                                }}
                                className="rounded text-xs text-accent-red focus-ring"
                              >
                                Delete
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDelete(null)}
                                className="rounded text-xs text-ink-muted focus-ring"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              aria-label={`Delete ${item.name} setup`}
                              onClick={() => setConfirmDelete(setup.gameId)}
                              className="rounded p-1 text-ink-muted hover:text-accent-red focus-ring"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="py-4 text-sm leading-relaxed text-ink-muted">
                    Save your first game setup. Your settings will be waiting
                    here next time.
                  </p>
                )}
              </div>
            </section>
            <section className="rounded-xl border border-white/10 bg-base-surface p-5">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
                <Bookmark className="h-4 w-4 text-accent-purple-light" />
                Favorite tools
              </h2>
              <div className="mt-4 space-y-2">
                {data.favorites.length ? (
                  data.favorites.map((id) => {
                    const tool = TOOLS.find((t) => t.id === id);
                    return (
                      tool && (
                        <Link
                          key={id}
                          to={tool.route}
                          className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.08] px-3 py-3 text-sm text-ink-muted hover:text-ink focus-ring"
                        >
                          {tool.name}
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      )
                    );
                  })
                ) : (
                  <p className="text-sm leading-relaxed text-ink-muted">
                    Use the bookmark button on a tool to pin it here.
                  </p>
                )}
                <Link
                  to="/tools"
                  className="mt-3 inline-flex items-center gap-2 rounded text-xs text-accent-purple-light focus-ring"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Explore tools
                </Link>
              </div>
            </section>
          </aside>
          <form
            onSubmit={submit}
            className="rounded-2xl border border-white/[0.12] bg-[#12121b] p-5 sm:p-6"
          >
            <fieldset disabled={!ready}>
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-xl font-semibold text-ink">
                  {selected ? "Edit your loadout" : "Build your loadout"}
                </h2>
                <span className="rounded-xl border border-accent-purple/25 bg-accent-purple/10 p-2"><Crosshair aria-hidden="true" className="h-5 w-5 text-accent-purple-light" /></span>
              </div>
              <label className="mt-6 block text-xs font-medium text-ink-muted">
                Game
                <div className="relative mt-2">
                  <GameIcon
                    gameId={gameId}
                    size="sm"
                    className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2"
                  />
                  <select
                    value={gameId}
                    onChange={(event) => {
                      setGameId(event.target.value as GameId);
                      setConfirmDelete(null);
                    }}
                    className={`${inputClass} !mt-0 pl-12`}
                  >
                    {GAMES.map((item) => (
                      <option key={item.id} value={item.id} className="bg-[#12121b] text-ink">
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </label>
              <div className="mt-5 grid grid-cols-2 gap-4">
                <label className="block text-xs font-medium text-ink-muted">
                  Mouse DPI
                  <input
                    name="setup-dpi"
                    type="number"
                    min="1"
                    max="100000"
                    step="1"
                    required
                    value={dpi}
                    onChange={(event) => update(setDpi, event.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="block text-xs font-medium text-ink-muted">
                  In-game sensitivity
                  <input
                    name="setup-sensitivity"
                    type="number"
                    min={Math.max(game.sensScale.min, 0.000001)}
                    max={game.sensScale.max}
                    step="any"
                    required
                    value={sensitivity}
                    onChange={(event) =>
                      update(setSensitivity, event.target.value)
                    }
                    className={inputClass}
                  />
                </label>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 rounded-lg border border-accent-purple/20 bg-accent-purple/5 p-4">
                <div>
                  <p className="font-mono text-[10px] uppercase text-ink-muted">
                    eDPI
                  </p>
                  <p className="mt-1 font-mono text-xl text-ink">
                    {valid ? round(dpiNum * sensNum, 2) : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase text-ink-muted">
                    cm/360
                  </p>
                  <p className="mt-1 font-mono text-xl text-ink">
                    {valid ? round(calcCm360(dpiNum, sensNum, game), 2) : "N/A"}
                  </p>
                </div>
              </div>
              <label className="mt-5 block text-xs font-medium text-ink-muted">
                Mouse <span className="font-normal">(optional)</span>
                <input
                  name="setup-mouse"
                  value={mouse}
                  onChange={(event) => update(setMouse, event.target.value)}
                  maxLength={120}
                  placeholder="Your mouse model"
                  className={inputClass}
                />
              </label>
              <label className="mt-5 block text-xs font-medium text-ink-muted">
                Crosshair code or settings{" "}
                <span className="font-normal">(optional)</span>
                <textarea
                  name="setup-crosshair"
                  value={crosshair}
                  onChange={(event) => update(setCrosshair, event.target.value)}
                  maxLength={2000}
                  rows={3}
                  placeholder="Paste your crosshair code or menu values"
                  className={`${inputClass} resize-y font-mono`}
                />
              </label>
              <Link
                to={`/tools/crosshair-generator?game=${gameId}`}
                className="mt-2 inline-flex items-center gap-1 rounded text-xs text-accent-purple-light focus-ring"
              >
                Open crosshair studio
                <ArrowUpRight className="h-3 w-3" />
              </Link>
              <label className="mt-5 block text-xs font-medium text-ink-muted">
                Personal notes <span className="font-normal">(optional)</span>
                <textarea
                  name="setup-notes"
                  value={notes}
                  onChange={(event) => update(setNotes, event.target.value)}
                  maxLength={2000}
                  rows={3}
                  placeholder="Mousepad, scoped settings, what feels rightâ€¦"
                  className={`${inputClass} resize-y`}
                />
              </label>
              {error && (
                <p role="alert" className="mt-3 text-sm text-accent-red">
                  {error}
                </p>
              )}
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  className="arena-primary focus-ring disabled:opacity-40"
                >
                  {saved ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                  {saved ? "Setup saved" : "Save setup"}
                </button>
                <Link
                  to={`/sensitivity?game=${gameId}`}
                  className="rounded text-xs text-ink-muted hover:text-ink focus-ring"
                >
                  Find my sensitivity
                  <ArrowUpRight className="ml-1 inline h-3 w-3" />
                </Link>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </>
  );
}
