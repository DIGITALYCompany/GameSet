import type { GameConfig, GameId } from '@/types';

/**
 * Centralized game configuration.
 *
 * cm/360 formula:
 *   cm/360 = (360 / (sens × yaw × dpi)) × 2.54
 *
 * `yaw` is the game's base yaw value (degrees per count at 1 sens, 1 DPI).
 * All values sourced from publicly documented game conversion data.
 */
export const GAMES: GameConfig[] = [
  {
    id: 'valorant',
    name: 'Valorant',
    slug: 'valorant',
    sensRange: { min: 0.1, max: 1.5 },
    defaultSens: 0.4,
    dpiSupport: false,
    yaw: 0.07,
    hasFov: false,
  },
  {
    id: 'cs2',
    name: 'Counter-Strike 2',
    slug: 'cs2',
    sensRange: { min: 0.1, max: 10 },
    defaultSens: 2.0,
    dpiSupport: false,
    yaw: 0.022,
    hasFov: false,
  },
  {
    id: 'apex',
    name: 'Apex Legends',
    slug: 'apex-legends',
    sensRange: { min: 0.1, max: 30 },
    defaultSens: 1.6,
    dpiSupport: false,
    yaw: 0.022,
    hasFov: true,
    defaultFov: 90,
  },
  {
    id: 'cod',
    name: 'Call of Duty / Warzone',
    slug: 'cod-warzone',
    sensRange: { min: 0.1, max: 30 },
    defaultSens: 6.5,
    dpiSupport: false,
    yaw: 0.022,
    hasFov: true,
    defaultFov: 80,
  },
  {
    id: 'r6',
    name: 'Rainbow Six Siege',
    slug: 'r6-siege',
    sensRange: { min: 1, max: 100 },
    defaultSens: 50,
    dpiSupport: false,
    yaw: 0.00572958,
    hasFov: true,
    defaultFov: 90,
  },
  {
    id: 'overwatch2',
    name: 'Overwatch 2',
    slug: 'overwatch-2',
    sensRange: { min: 1, max: 100 },
    defaultSens: 5,
    dpiSupport: false,
    yaw: 0.0066,
    hasFov: false,
  },
  {
    id: 'fortnite',
    name: 'Fortnite',
    slug: 'fortnite',
    sensRange: { min: 0.1, max: 2.0 },
    defaultSens: 0.1,
    dpiSupport: false,
    yaw: 0.5555,
    hasFov: false,
  },
  {
    id: 'thefinals',
    name: 'The Finals',
    slug: 'the-finals',
    sensRange: { min: 1, max: 100 },
    defaultSens: 50,
    dpiSupport: false,
    yaw: 0.0066,
    hasFov: true,
    defaultFov: 90,
  },
];

const GAME_MAP = new Map<GameId, GameConfig>(
  GAMES.map((g) => [g.id, g])
);

export function getGame(id: GameId): GameConfig | undefined {
  return GAME_MAP.get(id);
}

export function getGameBySlug(slug: string): GameConfig | undefined {
  return GAMES.find((g) => g.slug === slug);
}
