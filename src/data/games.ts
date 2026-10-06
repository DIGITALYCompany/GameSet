import type { GameConfig, GameId } from '@/types';

/**
 * Centralized game configuration.
 *
 * cm/360 formula:
 *   cm/360 = (360 / (sens × yaw × dpi)) × 2.54
 */

export const GAMES: GameConfig[] = [
  {
    id: 'valorant',
    name: 'Valorant',
    slug: 'valorant',
    genre: 'Tactical FPS',
    color: '#FF4655',
    tagline: '5v5 tactical shooter where precision wins rounds',
    description: 'Riot Games\' tactical 5v5 shooter where headshots dominate and a single bullet can change the round. Low time-to-kill makes sensitivity precision critical.',
    sensScale: { min: 0.001, max: 10 },
    sensDisplay: '0.001 – 10.00',
    recommendedRange: { min: 0.1, max: 1.0 },
    defaultSens: 0.4,
    dpiSupport: false,
    yaw: 0.07,
    hasFov: false,
    proPresets: [
      { player: 'TenZ', team: 'Sentinels', dpi: 800, sensitivity: 0.4, edpi: 320 },
      { player: 'Aspas', team: 'LOUD', dpi: 1600, sensitivity: 0.25, edpi: 400 },
      { player: 'Demon1', team: 'Evil Geniuses', dpi: 800, sensitivity: 0.4, edpi: 320 },
    ],
  },
  {
    id: 'cs2',
    name: 'Counter-Strike 2',
    slug: 'cs2',
    genre: 'Tactical FPS',
    color: '#F7A500',
    tagline: 'The legendary tactical shooter, now on Source 2',
    description: 'The gold standard of competitive FPS. Spray control and crosshair placement are everything — your sensitivity directly impacts your ability to master recoil patterns.',
    sensScale: { min: 0.05, max: 8 },
    sensDisplay: '0.05 – 8.00',
    recommendedRange: { min: 0.5, max: 4.0 },
    defaultSens: 2.0,
    dpiSupport: false,
    yaw: 0.022,
    hasFov: false,
    proPresets: [
      { player: 's1mple', team: 'Natus Vincere', dpi: 400, sensitivity: 3.09, edpi: 1236 },
      { player: 'ZywOo', team: 'Vitality', dpi: 400, sensitivity: 2.0, edpi: 800 },
      { player: 'NiKo', team: 'G2', dpi: 400, sensitivity: 1.35, edpi: 540 },
    ],
  },
  {
    id: 'apex',
    name: 'Apex Legends',
    slug: 'apex-legends',
    genre: 'Battle Royale',
    color: '#DA292A',
    tagline: 'Fast-paced battle royale with movement mechanics',
    description: 'High mobility battle royale where tracking moving targets is essential. A balance between fast flicks and smooth tracking is key — your sensitivity affects both.',
    sensScale: { min: 0.1, max: 20 },
    sensDisplay: '0.1 – 20.0',
    recommendedRange: { min: 0.5, max: 5.0 },
    defaultSens: 1.6,
    dpiSupport: false,
    yaw: 0.022,
    hasFov: true,
    defaultFov: 90,
    proPresets: [
      { player: 'ImperialHal', team: 'TSM', dpi: 800, sensitivity: 1.6, edpi: 1280 },
      { player: 'Genburten', team: 'DarkZero', dpi: 800, sensitivity: 1.5, edpi: 1200 },
      { player: 'Verhulst', team: 'TSM', dpi: 800, sensitivity: 1.4, edpi: 1120 },
    ],
  },
  {
    id: 'cod',
    name: 'Call of Duty / Warzone',
    slug: 'cod-warzone',
    genre: 'Battle Royale',
    color: '#26A0FX',
    tagline: 'Large-scale battle royale with fast TTK',
    description: 'Warzone demands quick reflexes at multiple engagement distances. A mid-range sensitivity handles both close-quarters fights and long-range sniping.',
    sensScale: { min: 0.1, max: 20 },
    sensDisplay: '0.1 – 20.0',
    recommendedRange: { min: 2.0, max: 12.0 },
    defaultSens: 6.5,
    dpiSupport: false,
    yaw: 0.022,
    hasFov: true,
    defaultFov: 80,
    proPresets: [
      { player: 'Scump', team: 'OpTic', dpi: 800, sensitivity: 6.5, edpi: 5200 },
      { player: 'Shotzzy', team: 'OpTic', dpi: 800, sensitivity: 7.0, edpi: 5600 },
      { player: 'Aydan', team: 'Ghost', dpi: 800, sensitivity: 6.2, edpi: 4960 },
    ],
  },
  {
    id: 'r6',
    name: 'Rainbow Six Siege',
    slug: 'r6-siege',
    genre: 'Tactical FPS',
    color: '#00A6E2',
    tagline: 'Close-quarters tactical with destructible environments',
    description: 'Siege rewards pre-aiming angles and quick peeks. A lower sensitivity helps with precise crosshair placement while still allowing fast flicks for room clearing.',
    sensScale: { min: 1, max: 100 },
    sensDisplay: '1 – 100',
    recommendedRange: { min: 10, max: 90 },
    defaultSens: 50,
    dpiSupport: false,
    yaw: 0.00572958,
    hasFov: true,
    defaultFov: 90,
    proPresets: [
      { player: 'Pengu', team: 'G2', dpi: 800, sensitivity: 11, edpi: 8800 },
      { player: 'Beaulo', team: 'DarkZero', dpi: 800, sensitivity: 14, edpi: 11200 },
      { player: 'Shaiiko', team: 'BDS', dpi: 800, sensitivity: 12, edpi: 9600 },
    ],
  },
  {
    id: 'overwatch2',
    name: 'Overwatch 2',
    slug: 'overwatch-2',
    genre: 'Hero Shooter',
    color: '#F99E1A',
    tagline: '5v5 hero shooter with diverse aim requirements',
    description: 'Overwatch 2 features heroes with vastly different aim needs — from tracking beams to flick projectiles. Your sensitivity should work across multiple hero types.',
    sensScale: { min: 0.01, max: 100 },
    sensDisplay: '0.01 – 100',
    recommendedRange: { min: 2, max: 15 },
    defaultSens: 5,
    dpiSupport: false,
    yaw: 0.0066,
    hasFov: false,
    proPresets: [
      { player: 'Carpe', team: 'Philly Fusion', dpi: 800, sensitivity: 5.0, edpi: 4000 },
      { player: 'Sinatraa', team: 'Shock', dpi: 800, sensitivity: 6.0, edpi: 4800 },
      { player: 'Fleta', team: 'Dragons', dpi: 800, sensitivity: 5.5, edpi: 4400 },
    ],
  },
  {
    id: 'fortnite',
    name: 'Fortnite',
    slug: 'fortnite',
    genre: 'Battle Royale',
    color: '#00B3F0',
    tagline: 'Building battle royale with unique aim demands',
    description: 'Fortnite combines building mechanics with aim duels. A slightly higher sensitivity helps with 360-degree building while still landing edits and shots.',
    sensScale: { min: 1, max: 100 },
    sensDisplay: '1% – 100%',
    sensUnit: '%',
    recommendedRange: { min: 5, max: 50 },
    defaultSens: 10,
    dpiSupport: false,
    yaw: 0.5555,
    hasFov: false,
    proPresets: [
      { player: 'Bugha', team: 'Sentinels', dpi: 800, sensitivity: 8, edpi: 6400 },
      { player: 'Clix', team: 'NRG', dpi: 800, sensitivity: 7, edpi: 5600 },
      { player: 'Mongraal', team: 'FaZe', dpi: 800, sensitivity: 9, edpi: 7200 },
    ],
  },
  {
    id: 'thefinals',
    name: 'The Finals',
    slug: 'the-finals',
    genre: 'Tactical FPS',
    color: '#E6B450',
    tagline: 'Destructible arenas with fast movement',
    description: 'The Finals features fully destructible environments and high mobility. A versatile sensitivity handles both tracking fast movers and precise long-range shots.',
    sensScale: { min: 1, max: 100 },
    sensDisplay: '1 – 100',
    recommendedRange: { min: 10, max: 90 },
    defaultSens: 50,
    dpiSupport: false,
    yaw: 0.0066,
    hasFov: true,
    defaultFov: 90,
    proPresets: [
      { player: 'Shroud', team: 'Streamer', dpi: 800, sensitivity: 35, edpi: 28000 },
      { player: 'TimTheTatman', team: 'Streamer', dpi: 800, sensitivity: 45, edpi: 36000 },
      { player: 'Ninja', team: 'Streamer', dpi: 800, sensitivity: 40, edpi: 32000 },
    ],
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
