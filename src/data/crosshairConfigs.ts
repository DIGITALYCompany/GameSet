import type { GameId } from '@/types';
import {
  cs2ConsoleCommands,
  cs2ShareCode,
  valorantProfileCode,
  type CrosshairShape,
} from '@/lib/crosshairCodes';

export interface CrosshairColor {
  id: string;
  label: string;
  hex: string;
  gameIndex?: number;
}

export interface CrosshairSettings {
  gap: number;
  length: number;
  thickness: number;
  dotSize: number;
  outlineThickness: number;
  colorId: string;
  customHex: string;
  outline: boolean;
  dot: boolean;
  tShape: boolean;
}

type NumericKey = 'gap' | 'length' | 'thickness' | 'dotSize' | 'outlineThickness';

export interface CrosshairRange {
  label: string;
  min: number;
  max: number;
  step: number;
}

export interface CrosshairExport {
  id: string;
  label: string;
  kind: 'code' | 'console' | 'manual';
  generate: (s: CrosshairShape, color: CrosshairColor | null) => string;
  steps: string[];
}

export type ImportSupport = 'code' | 'manual' | 'limited';

export interface GameCrosshairConfig {
  gameId: GameId;
  support: ImportSupport;
  lines: Partial<Record<'gap' | 'length' | 'thickness', CrosshairRange>>;
  outline?: CrosshairRange | 'toggle';
  dot?: CrosshairRange | 'toggle';
  tShape: boolean;
  colors: CrosshairColor[];
  customColor: boolean;
  toPixels: (s: CrosshairSettings) => Pick<CrosshairShape, NumericKey>;
  defaults: CrosshairSettings;
  presets: { name: string; settings: Partial<CrosshairSettings> }[];
  exports: CrosshairExport[];
  note?: string;
}

const base: CrosshairSettings = {
  gap: 2,
  length: 6,
  thickness: 2,
  dotSize: 2,
  outlineThickness: 1,
  colorId: 'green',
  customHex: '#00ff88',
  outline: true,
  dot: false,
  tShape: false,
};

const settings = (patch: Partial<CrosshairSettings>): CrosshairSettings => ({ ...base, ...patch });
const identity = (s: CrosshairSettings) => ({
  gap: s.gap,
  length: s.length,
  thickness: s.thickness,
  dotSize: s.dotSize,
  outlineThickness: s.outlineThickness,
});

const VALORANT_COLORS: CrosshairColor[] = [
  { id: 'white', label: 'White', hex: '#ffffff', gameIndex: 0 },
  { id: 'green', label: 'Green', hex: '#00ff00', gameIndex: 1 },
  { id: 'yellow-green', label: 'Yellow Green', hex: '#7fff00', gameIndex: 2 },
  { id: 'green-yellow', label: 'Green Yellow', hex: '#dfff00', gameIndex: 3 },
  { id: 'yellow', label: 'Yellow', hex: '#ffff00', gameIndex: 4 },
  { id: 'cyan', label: 'Cyan', hex: '#00ffff', gameIndex: 5 },
  { id: 'pink', label: 'Pink', hex: '#ff00ff', gameIndex: 6 },
  { id: 'red', label: 'Red', hex: '#ff0000', gameIndex: 7 },
];

const SWATCHES: CrosshairColor[] = [
  { id: 'green', label: 'Green', hex: '#00ff00' },
  { id: 'cyan', label: 'Cyan', hex: '#00ffff' },
  { id: 'yellow', label: 'Yellow', hex: '#ffff00' },
  { id: 'white', label: 'White', hex: '#ffffff' },
  { id: 'pink', label: 'Pink', hex: '#ff00ff' },
  { id: 'red', label: 'Red', hex: '#ff0000' },
];

function manualExport(title: string, menuPath: string, rows: (s: CrosshairShape) => string[]): CrosshairExport {
  return {
    id: 'manual',
    label: 'Menu values',
    kind: 'manual',
    generate: (s) => [`${title}: ${menuPath}`, '', ...rows(s)].join('\n'),
    steps: [`Open ${menuPath}.`, 'Set each value exactly as listed.', 'Save your settings.'],
  };
}

const onOff = (v: boolean) => (v ? 'On' : 'Off');

const limited = (gameId: GameId, note: string, menuPath: string, title: string): GameCrosshairConfig => ({
  gameId,
  support: 'limited',
  lines: {},
  tShape: false,
  colors: SWATCHES,
  customColor: false,
  toPixels: () => ({ gap: 3, length: 5, thickness: 2, dotSize: 0, outlineThickness: 0 }),
  defaults: settings({ outline: false }),
  presets: [],
  exports: [manualExport(title, menuPath, (s) => [`Color: closest to ${s.hex.toUpperCase()}`])],
  note,
});

export const GAME_CROSSHAIR_CONFIGS: Record<GameId, GameCrosshairConfig> = {
  valorant: {
    gameId: 'valorant',
    support: 'code',
    lines: {
      gap: { label: 'Inner Line Offset', min: 0, max: 20, step: 1 },
      length: { label: 'Inner Line Length', min: 0, max: 20, step: 1 },
      thickness: { label: 'Inner Line Thickness', min: 0, max: 10, step: 1 },
    },
    outline: { label: 'Outline Thickness', min: 1, max: 6, step: 1 },
    dot: { label: 'Center Dot Thickness', min: 1, max: 6, step: 1 },
    tShape: false,
    colors: VALORANT_COLORS,
    customColor: true,
    toPixels: identity,
    defaults: settings({ gap: 3, length: 4, thickness: 2, colorId: 'cyan' }),
    presets: [
      { name: 'Pro Small', settings: { gap: 2, length: 4, thickness: 2, outline: false, dot: false, colorId: 'cyan' } },
      { name: 'Dot', settings: { length: 0, thickness: 0, dot: true, dotSize: 3, outline: true, outlineThickness: 1, colorId: 'white' } },
      { name: 'Classic', settings: { gap: 3, length: 6, thickness: 2, outline: true, outlineThickness: 1, dot: false, colorId: 'green' } },
      { name: 'Plus', settings: { gap: 0, length: 3, thickness: 2, outline: true, outlineThickness: 1, dot: false, colorId: 'yellow' } },
    ],
    exports: [
      {
        id: 'profile',
        label: 'Profile code',
        kind: 'code',
        generate: (s, color) => valorantProfileCode(s, color?.gameIndex ?? null),
        steps: [
          'Open Settings, then the Crosshair tab.',
          'Click the import icon next to the Crosshair Profile dropdown.',
          'Paste the code and confirm.',
        ],
      },
    ],
  },

  cs2: {
    gameId: 'cs2',
    support: 'code',
    lines: {
      gap: { label: 'Gap', min: -5, max: 5, step: 0.5 },
      length: { label: 'Length', min: 0, max: 10, step: 0.5 },
      thickness: { label: 'Thickness', min: 0, max: 5, step: 0.5 },
    },
    outline: { label: 'Outline Thickness', min: 0, max: 3, step: 0.5 },
    dot: 'toggle',
    tShape: true,
    colors: SWATCHES,
    customColor: true,
    toPixels: (s) => ({
      gap: Math.max(-s.thickness, s.gap + 4),
      length: s.length * 2,
      thickness: Math.max(1, s.thickness * 2),
      dotSize: Math.max(1, s.thickness * 2),
      outlineThickness: s.outlineThickness,
    }),
    defaults: settings({ gap: -2, length: 2, thickness: 1, outlineThickness: 1, colorId: 'green' }),
    presets: [
      { name: 'Pro Tiny', settings: { gap: -3, length: 1.5, thickness: 0.5, outline: true, outlineThickness: 1, dot: false, colorId: 'green' } },
      { name: 'Classic', settings: { gap: -1, length: 3, thickness: 1, outline: true, outlineThickness: 1, dot: false, colorId: 'cyan' } },
      { name: 'Dot', settings: { gap: 0, length: 0, thickness: 1, outline: true, outlineThickness: 1, dot: true, colorId: 'white' } },
      { name: 'T-Shape', settings: { gap: -2, length: 2.5, thickness: 1, outline: true, outlineThickness: 1, tShape: true, colorId: 'yellow' } },
    ],
    exports: [
      {
        id: 'share',
        label: 'Share code',
        kind: 'code',
        generate: (s) => cs2ShareCode(s),
        steps: [
          'Open Settings, then Game, then Crosshair.',
          'Click "Share or Import", then Import.',
          'Paste the code and press Import.',
        ],
      },
      {
        id: 'console',
        label: 'Console',
        kind: 'console',
        generate: (s) => cs2ConsoleCommands(s),
        steps: [
          'Enable the developer console in Settings, then Game.',
          'Press the ~ key to open the console.',
          'Paste the whole line and press Enter.',
        ],
      },
    ],
  },

  overwatch2: {
    gameId: 'overwatch2',
    support: 'manual',
    lines: {
      gap: { label: 'Center Gap', min: 0, max: 50, step: 1 },
      length: { label: 'Crosshair Length', min: 0, max: 50, step: 1 },
      thickness: { label: 'Thickness', min: 1, max: 15, step: 1 },
    },
    outline: 'toggle',
    dot: { label: 'Dot Size', min: 1, max: 30, step: 1 },
    tShape: false,
    colors: SWATCHES,
    customColor: true,
    toPixels: (s) => ({ ...identity(s), outlineThickness: 1 }),
    defaults: settings({ gap: 4, length: 6, thickness: 2, outline: true, dot: false, colorId: 'green' }),
    presets: [
      { name: 'Hitscan', settings: { gap: 3, length: 5, thickness: 2, dot: true, dotSize: 2, colorId: 'green' } },
      { name: 'Dot', settings: { length: 0, dot: true, dotSize: 4, colorId: 'pink' } },
      { name: 'Wide', settings: { gap: 8, length: 8, thickness: 2, dot: false, colorId: 'cyan' } },
    ],
    exports: [
      manualExport('Overwatch 2', 'Options → Controls → General → Reticle → Advanced', (s) => [
        `Type: ${s.length === 0 ? 'Dot' : 'Crosshairs'}`,
        'Show Accuracy: Off',
        `Color: ${s.hex.toUpperCase()}`,
        `Thickness: ${s.thickness}`,
        `Crosshair Length: ${s.length}`,
        `Center Gap: ${s.gap}`,
        'Opacity: 100%',
        `Outline Opacity: ${s.outline ? '100%' : '0%'}`,
        `Dot Size: ${s.dot ? s.dotSize : 0}`,
        `Dot Opacity: ${s.dot ? '100%' : '0%'}`,
        'Scale With Resolution: On',
      ]),
    ],
  },

  thefinals: {
    gameId: 'thefinals',
    support: 'manual',
    lines: {
      gap: { label: 'Gap', min: 0, max: 20, step: 1 },
      length: { label: 'Length', min: 0, max: 30, step: 1 },
      thickness: { label: 'Thickness', min: 1, max: 10, step: 1 },
    },
    outline: 'toggle',
    dot: { label: 'Dot Size', min: 1, max: 10, step: 1 },
    tShape: false,
    colors: SWATCHES,
    customColor: true,
    toPixels: (s) => ({ ...identity(s), outlineThickness: 1 }),
    defaults: settings({ gap: 3, length: 6, thickness: 2, outline: true, dot: true, colorId: 'white' }),
    presets: [
      { name: 'Default', settings: { gap: 3, length: 6, thickness: 2, dot: true, dotSize: 2, colorId: 'white' } },
      { name: 'Dot', settings: { length: 0, dot: true, dotSize: 3, colorId: 'red' } },
      { name: 'Cross', settings: { gap: 4, length: 10, thickness: 2, dot: false, colorId: 'green' } },
    ],
    exports: [
      manualExport('The Finals', 'Settings → Crosshair', (s) => [
        `Color: ${s.hex.toUpperCase()}`,
        `Gap: ${s.gap}`,
        `Length: ${s.length}`,
        `Thickness: ${s.thickness}`,
        `Outline: ${onOff(s.outline)}`,
        `Center Dot: ${onOff(s.dot)}${s.dot ? ` (size ${s.dotSize})` : ''}`,
      ]),
    ],
  },

  apex: limited(
    'apex',
    'Apex Legends only lets you change reticle colors, not the crosshair shape. Pick a color here and match it in-game.',
    'Settings → Gameplay → Reticle Customization',
    'Apex Legends'
  ),
  cod: limited(
    'cod',
    'Call of Duty offers only a few preset crosshair styles. Use the color here as a reference and choose the closest preset.',
    'Settings → Interface → Crosshair',
    'Call of Duty'
  ),
  r6: limited(
    'r6',
    'Rainbow Six Siege uses fixed reticles. You can only change the reticle color in-game.',
    'Options → Display → Reticle',
    'Rainbow Six Siege'
  ),
  fortnite: limited(
    'fortnite',
    'Fortnite has no crosshair customization. The preview is just a reference for overlay or aim-trainer setups.',
    'Settings → Game',
    'Fortnite'
  ),
};

export function getCrosshairConfig(gameId: GameId): GameCrosshairConfig {
  return GAME_CROSSHAIR_CONFIGS[gameId];
}
