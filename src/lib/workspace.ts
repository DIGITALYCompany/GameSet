import type { GameId } from '@/types';
import { GAMES } from '@/data/games';
import { TOOLS } from '@/data/tools';

export interface GameSetup {
  gameId: GameId;
  dpi: number;
  sensitivity: number;
  crosshair: string;
  mouse: string;
  notes: string;
  updatedAt: string;
}
export interface WorkspaceData {
  setups: GameSetup[];
  favorites: string[];
}
export interface CachedWorkspace { data: WorkspaceData; dirty: boolean; }
export const EMPTY_WORKSPACE: WorkspaceData = { setups: [], favorites: [] };
export const workspaceKey = (owner: string) => `gameset:workspace:${owner}`;

export function sanitizeWorkspace(value: unknown): WorkspaceData {
  const raw = value && typeof value === 'object' ? value as Partial<WorkspaceData> : {};
  const seen = new Set<string>();
  const setups: GameSetup[] = [];
  if (Array.isArray(raw.setups)) for (const item of raw.setups) {
    if (!item || typeof item !== 'object') continue;
    const game = GAMES.find(g => g.id === item.gameId);
    if (!game || seen.has(game.id) || !Number.isInteger(item.dpi) || item.dpi <= 0 || item.dpi > 100000 || !Number.isFinite(item.sensitivity) || item.sensitivity < game.sensScale.min || item.sensitivity > game.sensScale.max || item.sensitivity <= 0) continue;
    seen.add(game.id);
    setups.push({ gameId: game.id, dpi: item.dpi, sensitivity: item.sensitivity, crosshair: typeof item.crosshair === 'string' ? item.crosshair.slice(0, 2000) : '', mouse: typeof item.mouse === 'string' ? item.mouse.slice(0, 120) : '', notes: typeof item.notes === 'string' ? item.notes.slice(0, 2000) : '', updatedAt: typeof item.updatedAt === 'string' && !Number.isNaN(Date.parse(item.updatedAt)) ? item.updatedAt : new Date(0).toISOString() });
  }
  const favorites = Array.isArray(raw.favorites) ? [...new Set(raw.favorites.filter(id => typeof id === 'string' && TOOLS.some(tool => tool.id === id)))] : [];
  return { setups, favorites };
}
export function readWorkspace(owner: string): CachedWorkspace {
  try {
    const raw = JSON.parse(localStorage.getItem(workspaceKey(owner)) || '{}');
    return { data: sanitizeWorkspace(raw?.data), dirty: raw?.dirty === true };
  } catch { return { data: EMPTY_WORKSPACE, dirty: false }; }
}
export function writeWorkspace(owner: string, cache: CachedWorkspace): boolean {
  try { localStorage.setItem(workspaceKey(owner), JSON.stringify(cache)); return true; }
  catch { return false; }
}
