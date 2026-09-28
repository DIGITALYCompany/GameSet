import type { GameId } from '@/types';

/**
 * Game-specific crosshair configuration.
 *
 * Each game has its own crosshair parameter names, color systems,
 * and export format. This keeps game-specific logic out of the UI
 * components and makes adding new games straightforward.
 */

export interface CrosshairColor {
  id: string;
  label: string;
  /** The hex color used for the SVG preview */
  hex: string;
  /** The value used in the game's export string (may differ from hex) */
  exportValue: string;
}

export interface CrosshairParamConfig {
  /** Parameter key in CrosshairSettings */
  key: keyof CrosshairSettingsValues;
  /** Display label for this game */
  label: string;
  min: number;
  max: number;
  /** Whether this parameter is available in this game */
  available: boolean;
}

export interface CrosshairSettingsValues {
  gap: number;
  length: number;
  thickness: number;
  dotSize: number;
  outlineThickness: number;
}

export interface GameCrosshairConfig {
  gameId: GameId;
  /** Games that have a native crosshair customization system */
  supported: boolean;
  /** Parameter mapping for this game's crosshair settings */
  params: CrosshairParamConfig[];
  /** Available colors for this game's crosshair */
  colors: CrosshairColor[];
  /** Whether the game supports outline */
  hasOutline: boolean;
  /** Whether the game supports center dot */
  hasDot: boolean;
  /** Whether the game supports T-shape (no top line) */
  hasTShape: boolean;
  /** Default settings for this game */
  defaults: CrosshairSettingsValues & {
    colorId: string;
    outline: boolean;
    dot: boolean;
    tShape: boolean;
  };
  /** Named presets tailored to this game */
  presets: { name: string; settings: CrosshairSettingsValues & {
    colorId: string;
    outline: boolean;
    dot: boolean;
    tShape: boolean;
  } }[];
  /** Generate the game-specific export string */
  exportFormat: (settings: ExportSettings) => string;
  /** Instructions for applying the crosshair in-game */
  applyInstructions: string;
}

export interface ExportSettings {
  gap: number;
  length: number;
  thickness: number;
  colorId: string;
  colorHex: string;
  colorExport: string;
  outline: boolean;
  outlineThickness: number;
  dot: boolean;
  dotSize: number;
  tShape: boolean;
}

const SHARED_COLORS: CrosshairColor[] = [
  { id: 'green', label: 'Green', hex: '#00ff00', exportValue: '0' },
  { id: 'yellow', label: 'Yellow', hex: '#ffff00', exportValue: '1' },
  { id: 'cyan', label: 'Cyan', hex: '#00ffff', exportValue: '2' },
  { id: 'white', label: 'White', hex: '#ffffff', exportValue: '5' },
  { id: 'red', label: 'Red', hex: '#ff0000', exportValue: '4' },
  { id: 'orange', label: 'Orange', hex: '#ff9148', exportValue: '3' },
];

const RAINBOW_COLORS: CrosshairColor[] = [
  { id: 'white', label: 'White', hex: '#ffffff', exportValue: '0' },
  { id: 'green', label: 'Green', hex: '#00ff00', exportValue: '1' },
  { id: 'yellow', label: 'Yellow', hex: '#ffff00', exportValue: '2' },
  { id: 'cyan', label: 'Cyan', hex: '#00ffff', exportValue: '3' },
  { id: 'pink', label: 'Pink', hex: '#ff00ff', exportValue: '4' },
  { id: 'red', label: 'Red', hex: '#ff0000', exportValue: '5' },
];

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

export const GAME_CROSSHAIR_CONFIGS: Record<GameId, GameCrosshairConfig> = {
  valorant: {
    gameId: 'valorant',
    supported: true,
    hasOutline: true,
    hasDot: true,
    hasTShape: true,
    defaults: {
      gap: 2,
      length: 6,
      thickness: 2,
      dotSize: 2,
      outlineThickness: 1,
      colorId: 'green',
      outline: true,
      dot: true,
      tShape: false,
    },
    params: [
      { key: 'gap', label: 'Inner Line Offset', min: 0, max: 20, available: true },
      { key: 'length', label: 'Inner Line Length', min: 0, max: 20, available: true },
      { key: 'thickness', label: 'Inner Line Thickness', min: 1, max: 10, available: true },
      { key: 'outlineThickness', label: 'Outline Thickness', min: 0, max: 6, available: true },
      { key: 'dotSize', label: 'Center Dot Size', min: 0, max: 10, available: true },
    ],
    colors: SHARED_COLORS,
    presets: [
      { name: 'Default', settings: { gap: 2, length: 6, thickness: 2, dotSize: 2, outlineThickness: 1, colorId: 'green', outline: true, dot: true, tShape: false } },
      { name: 'Dot Only', settings: { gap: 0, length: 0, thickness: 0, dotSize: 4, outlineThickness: 0, colorId: 'green', outline: false, dot: true, tShape: false } },
      { name: 'Cross', settings: { gap: 4, length: 10, thickness: 2, dotSize: 0, outlineThickness: 1, colorId: 'cyan', outline: true, dot: false, tShape: false } },
      { name: 'Minimal', settings: { gap: 1, length: 3, thickness: 1, dotSize: 0, outlineThickness: 1, colorId: 'white', outline: true, dot: false, tShape: false } },
    ],
    exportFormat: (s) => {
      const lines = [
        'GAMESET Crosshair — Valorant',
        '',
        'Settings → Crosshair:',
        `Color: ${s.colorExport} (${s.colorHex})`,
        `Outlines: ${s.outline ? 'On' : 'Off'}`,
        s.outline ? `Outline Opacity: 1 · Outline Thickness: ${s.outlineThickness}` : '',
        `Center Dot: ${s.dot ? 'On' : 'Off'}`,
        s.dot ? `Center Dot Size: ${s.dotSize}` : '',
        `Inner Line Offset: ${s.gap}`,
        `Inner Line Length: ${s.length}`,
        `Inner Line Thickness: ${s.thickness}`,
        `Inner Line Opacity: 1`,
        s.tShape ? 'Top Line: Off (T-Shape)' : 'Top Line: On',
      ].filter(Boolean);
      return lines.join('\n');
    },
    applyInstructions: 'Open Settings → Crosshair in Valorant and match these values manually.',
  },

  cs2: {
    gameId: 'cs2',
    supported: true,
    hasOutline: true,
    hasDot: false,
    hasTShape: false,
    defaults: {
      gap: 5,
      length: 10,
      thickness: 2,
      dotSize: 0,
      outlineThickness: 1,
      colorId: 'green',
      outline: true,
      dot: false,
      tShape: false,
    },
    params: [
      { key: 'gap', label: 'Gap', min: -5, max: 20, available: true },
      { key: 'length', label: 'Length', min: 0, max: 30, available: true },
      { key: 'thickness', label: 'Thickness', min: 0, max: 10, available: true },
      { key: 'outlineThickness', label: 'Outline', min: 0, max: 3, available: true },
    ],
    colors: SHARED_COLORS,
    presets: [
      { name: 'Default', settings: { gap: 5, length: 10, thickness: 2, dotSize: 0, outlineThickness: 1, colorId: 'green', outline: true, dot: false, tShape: false } },
      { name: 'Static', settings: { gap: -2, length: 8, thickness: 1, dotSize: 0, outlineThickness: 1, colorId: 'cyan', outline: true, dot: false, tShape: false } },
      { name: 'Long', settings: { gap: 3, length: 20, thickness: 2, dotSize: 0, outlineThickness: 1, colorId: 'green', outline: true, dot: false, tShape: false } },
      { name: 'Tight', settings: { gap: 0, length: 5, thickness: 1, dotSize: 0, outlineThickness: 0, colorId: 'white', outline: false, dot: false, tShape: false } },
    ],
    exportFormat: (s) => {
      const { r, g, b } = hexToRgb(s.colorHex);
      const lines = [
        'GAMESET Crosshair — CS2',
        '',
        'Settings → Game → Crosshair:',
        `Crosshair Code: cl_crosshairgap ${s.gap}; cl_crosshairsize ${s.length}; cl_crosshairthickness ${s.thickness}`,
        `Color: cl_crosshaircolor 5; cl_crosshaircolor_r ${r}; cl_crosshaircolor_g ${g}; cl_crosshaircolor_b ${b}`,
        `Outline: cl_crosshair_drawoutline ${s.outline ? '1' : '0'}; cl_crosshair_outlinethickness ${s.outlineThickness}`,
        'Style: cl_crosshairstyle 4',
      ];
      return lines.join('\n');
    },
    applyInstructions: 'Open console in CS2 and paste the crosshair commands above.',
  },

  apex: {
    gameId: 'apex',
    supported: true,
    hasOutline: false,
    hasDot: false,
    hasTShape: false,
    defaults: {
      gap: 4,
      length: 8,
      thickness: 2,
      dotSize: 0,
      outlineThickness: 0,
      colorId: 'green',
      outline: false,
      dot: false,
      tShape: false,
    },
    params: [
      { key: 'gap', label: 'Gap', min: 0, max: 20, available: true },
      { key: 'length', label: 'Length', min: 0, max: 30, available: true },
      { key: 'thickness', label: 'Thickness', min: 1, max: 10, available: true },
    ],
    colors: SHARED_COLORS,
    presets: [
      { name: 'Default', settings: { gap: 4, length: 8, thickness: 2, dotSize: 0, outlineThickness: 0, colorId: 'green', outline: false, dot: false, tShape: false } },
      { name: 'Dot', settings: { gap: 0, length: 0, thickness: 3, dotSize: 0, outlineThickness: 0, colorId: 'red', outline: false, dot: false, tShape: false } },
      { name: 'Long', settings: { gap: 2, length: 15, thickness: 2, dotSize: 0, outlineThickness: 0, colorId: 'cyan', outline: false, dot: false, tShape: false } },
    ],
    exportFormat: (s) => {
      const lines = [
        'GAMESET Crosshair — Apex Legends',
        '',
        'Settings → Gameplay → Reticle:',
        `Color: ${s.colorId} (${s.colorHex})`,
        `Gap: ${s.gap}`,
        `Length: ${s.length}`,
        `Thickness: ${s.thickness}`,
        'Type: 2 (Cross)',
      ];
      return lines.join('\n');
    },
    applyInstructions: 'Open Settings → Gameplay → Reticle in Apex Legends and match these values.',
  },

  cod: {
    gameId: 'cod',
    supported: true,
    hasOutline: false,
    hasDot: true,
    hasTShape: false,
    defaults: {
      gap: 4,
      length: 8,
      thickness: 2,
      dotSize: 2,
      outlineThickness: 0,
      colorId: 'green',
      outline: false,
      dot: true,
      tShape: false,
    },
    params: [
      { key: 'gap', label: 'Center Gap', min: 0, max: 20, available: true },
      { key: 'length', label: 'Line Length', min: 0, max: 30, available: true },
      { key: 'thickness', label: 'Thickness', min: 1, max: 10, available: true },
      { key: 'dotSize', label: 'Center Dot', min: 0, max: 10, available: true },
    ],
    colors: SHARED_COLORS,
    presets: [
      { name: 'Default', settings: { gap: 4, length: 8, thickness: 2, dotSize: 2, outlineThickness: 0, colorId: 'green', outline: false, dot: true, tShape: false } },
      { name: 'Dot', settings: { gap: 0, length: 0, thickness: 0, dotSize: 3, outlineThickness: 0, colorId: 'red', outline: false, dot: true, tShape: false } },
      { name: 'Cross', settings: { gap: 5, length: 12, thickness: 2, dotSize: 0, outlineThickness: 0, colorId: 'cyan', outline: false, dot: false, tShape: false } },
    ],
    exportFormat: (s) => {
      const lines = [
        'GAMESET Crosshair — Call of Duty',
        '',
        'Settings → Interface → Reticle:',
        `Color: ${s.colorId} (${s.colorHex})`,
        `Center Gap: ${s.gap}`,
        `Line Length: ${s.length}`,
        `Thickness: ${s.thickness}`,
        `Center Dot: ${s.dot ? 'On' : 'Off'}`,
        s.dot ? `Dot Size: ${s.dotSize}` : '',
        'Style: 6 (Custom)',
      ].filter(Boolean);
      return lines.join('\n');
    },
    applyInstructions: 'Open Settings → Interface → Reticle in Call of Duty and match these values.',
  },

  r6: {
    gameId: 'r6',
    supported: false,
    hasOutline: false,
    hasDot: false,
    hasTShape: false,
    defaults: {
      gap: 4,
      length: 8,
      thickness: 2,
      dotSize: 0,
      outlineThickness: 0,
      colorId: 'green',
      outline: false,
      dot: false,
      tShape: false,
    },
    params: [
      { key: 'gap', label: 'Gap', min: 0, max: 20, available: false },
    ],
    colors: SHARED_COLORS,
    presets: [],
    exportFormat: (s) => {
      const lines = [
        'GAMESET Crosshair — Rainbow Six Siege',
        '',
        'Note: R6 Siege uses a limited set of preset reticles.',
        'The closest match to your design:',
        `Color: ${s.colorId} (${s.colorHex})`,
        'Choose the "Cross" or "Dot" reticle in-game.',
      ];
      return lines.join('\n');
    },
    applyInstructions: 'Open Settings → Gameplay → Reticle in Rainbow Six Siege and choose the closest preset reticle.',
  },

  overwatch2: {
    gameId: 'overwatch2',
    supported: true,
    hasOutline: false,
    hasDot: true,
    hasTShape: false,
    defaults: {
      gap: 3,
      length: 7,
      thickness: 2,
      dotSize: 2,
      outlineThickness: 0,
      colorId: 'green',
      outline: false,
      dot: true,
      tShape: false,
    },
    params: [
      { key: 'gap', label: 'Gap', min: 0, max: 20, available: true },
      { key: 'length', label: 'Length', min: 0, max: 30, available: true },
      { key: 'thickness', label: 'Thickness', min: 1, max: 10, available: true },
      { key: 'dotSize', label: 'Dot Size', min: 0, max: 10, available: true },
    ],
    colors: RAINBOW_COLORS,
    presets: [
      { name: 'Default', settings: { gap: 3, length: 7, thickness: 2, dotSize: 2, outlineThickness: 0, colorId: 'green', outline: false, dot: true, tShape: false } },
      { name: 'Dot', settings: { gap: 0, length: 0, thickness: 0, dotSize: 4, outlineThickness: 0, colorId: 'pink', outline: false, dot: true, tShape: false } },
      { name: 'Circle', settings: { gap: 5, length: 5, thickness: 2, dotSize: 0, outlineThickness: 0, colorId: 'yellow', outline: false, dot: false, tShape: false } },
    ],
    exportFormat: (s) => {
      const lines = [
        'GAMESET Crosshair — Overwatch 2',
        '',
        'Settings → Controls → Reticle:',
        `Type: ${s.length === 0 ? 'Dot' : 'Cross'}`,
        `Color: ${s.colorId} (${s.colorHex})`,
        `Gap: ${s.gap}`,
        `Length: ${s.length}`,
        `Thickness: ${s.thickness}`,
        `Dot Size: ${s.dot ? s.dotSize : 0}`,
        'Show Accuracy: Off',
      ];
      return lines.join('\n');
    },
    applyInstructions: 'Open Settings → Controls → Reticle in Overwatch 2 and match these values.',
  },

  fortnite: {
    gameId: 'fortnite',
    supported: false,
    hasOutline: false,
    hasDot: false,
    hasTShape: false,
    defaults: {
      gap: 4,
      length: 8,
      thickness: 2,
      dotSize: 0,
      outlineThickness: 0,
      colorId: 'white',
      outline: false,
      dot: false,
      tShape: false,
    },
    params: [
      { key: 'gap', label: 'Gap', min: 0, max: 20, available: false },
    ],
    colors: SHARED_COLORS,
    presets: [],
    exportFormat: (s: ExportSettings) => {
      const lines = [
        'GAMESET Crosshair — Fortnite',
        '',
        'Note: Fortnite does not support custom crosshairs.',
        'Your settings can be used as a reference for aim practice.',
        `Color: ${s.colorId} (${s.colorHex})`,
      ];
      return lines.join('\n');
    },
    applyInstructions: 'Fortnite does not support custom crosshairs natively. Use these settings as a reference for aim trainers.',
  },

  thefinals: {
    gameId: 'thefinals',
    supported: true,
    hasOutline: false,
    hasDot: true,
    hasTShape: false,
    defaults: {
      gap: 3,
      length: 6,
      thickness: 2,
      dotSize: 2,
      outlineThickness: 0,
      colorId: 'white',
      outline: false,
      dot: true,
      tShape: false,
    },
    params: [
      { key: 'gap', label: 'Gap', min: 0, max: 20, available: true },
      { key: 'length', label: 'Length', min: 0, max: 30, available: true },
      { key: 'thickness', label: 'Thickness', min: 1, max: 10, available: true },
      { key: 'dotSize', label: 'Dot Size', min: 0, max: 10, available: true },
    ],
    colors: SHARED_COLORS,
    presets: [
      { name: 'Default', settings: { gap: 3, length: 6, thickness: 2, dotSize: 2, outlineThickness: 0, colorId: 'white', outline: false, dot: true, tShape: false } },
      { name: 'Dot', settings: { gap: 0, length: 0, thickness: 0, dotSize: 3, outlineThickness: 0, colorId: 'red', outline: false, dot: true, tShape: false } },
      { name: 'Cross', settings: { gap: 4, length: 10, thickness: 2, dotSize: 0, outlineThickness: 0, colorId: 'green', outline: false, dot: false, tShape: false } },
    ],
    exportFormat: (s) => {
      const lines = [
        'GAMESET Crosshair — The Finals',
        '',
        'Settings → Gameplay → Crosshair:',
        `Color: ${s.colorId} (${s.colorHex})`,
        `Gap: ${s.gap}`,
        `Length: ${s.length}`,
        `Thickness: ${s.thickness}`,
        `Center Dot: ${s.dot ? 'On' : 'Off'}`,
        s.dot ? `Dot Size: ${s.dotSize}` : '',
      ].filter(Boolean);
      return lines.join('\n');
    },
    applyInstructions: 'Open Settings → Gameplay → Crosshair in The Finals and match these values.',
  },
};

/** Games that have a native custom crosshair system */
export const CROSSHAIR_SUPPORTED_GAMES = (Object.entries(GAME_CROSSHAIR_CONFIGS)
  .filter(([, cfg]) => cfg.supported)
  .map(([id]) => id)) as GameId[];

export function getCrosshairConfig(gameId: GameId): GameCrosshairConfig {
  return GAME_CROSSHAIR_CONFIGS[gameId];
}
