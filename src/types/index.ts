export type GameId =
  | 'valorant'
  | 'cs2'
  | 'apex'
  | 'cod'
  | 'r6'
  | 'overwatch2'
  | 'fortnite'
  | 'thefinals';

export interface GameConfig {
  id: GameId;
  name: string;
  slug: string;
  /** Sensitivity range that covers the vast majority of players */
  sensRange: { min: number; max: number };
  defaultSens: number;
  /** Whether the game natively supports a separate DPI setting */
  dpiSupport: boolean;
  /**
   * cm/360 conversion factor.
   * cm/360 = (360 / (sens * yaw * dpi)) * 2.54
   * Where `yaw` is the game-specific yaw base.
   */
  yaw: number;
  /** Whether FOV affects the calculation */
  hasFov: boolean;
  /** Optional FOV default */
  defaultFov?: number;
}

export type ToolStatus = 'available' | 'coming_soon';

export type ToolCategory =
  | 'sensitivity'
  | 'aim'
  | 'conversion'
  | 'performance'
  | 'profile';

export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  category: ToolCategory;
  status: ToolStatus;
  route: string;
}

export interface SensitivityResult {
  id: string;
  gameId: GameId;
  gameName: string;
  date: string;
  dpi: number;
  sensitivity: number;
  edpi: number;
  cm360: number;
  rounds: number;
  fov?: number;
  initialSensitivity: number;
}

export interface AppSettings {
  theme: 'dark';
  soundEffects: boolean;
  reducedMotion: boolean;
  defaultRounds: number;
}

export interface ComparisonPair {
  round: number;
  totalRounds: number;
  lower: number;
  higher: number;
}

export type FinderPhase = 'setup' | 'testing' | 'result';

export interface FinderState {
  phase: FinderPhase;
  round: number;
  totalRounds: number;
  lowBound: number;
  highBound: number;
  lower: number;
  higher: number;
  result: number | null;
  history: number[];
}
