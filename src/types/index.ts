export type SubscriptionTier = 'free' | 'pro' | 'elite';

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  name: string;
  price: number;
  period: string;
  tagline: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    tier: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    tagline: 'Everything you need to find your sensitivity',
    features: [
      'Sensitivity Finder with 7-round tests',
      'Cross-game sensitivity converter',
      'eDPI & cm/360 calculators',
      'Crosshair generator',
      'Local test history (device storage)',
      'Follow up to 3 games',
    ],
  },
  {
    tier: 'pro',
    name: 'Pro',
    price: 0.99,
    period: 'month',
    tagline: 'For competitive players who want more precision',
    highlighted: true,
    badge: 'Most Popular',
    features: [
      'Everything in Free',
      '10-round precision sensitivity tests',
      'Unlimited cloud-synced test history',
      'Aim Trainer & Reaction Time analytics',
      'Follow unlimited games',
      'Pro preset database with copy-to-clipboard',
      'Advanced cm/360 matching across all games',
      'Priority support',
    ],
  },
  {
    tier: 'elite',
    name: 'Elite',
    price: 4.99,
    period: 'month',
    tagline: 'The complete competitive toolkit',
    badge: 'Best Value',
    features: [
      'Everything in Pro',
      'Unlimited sensitivity test rounds (up to 20)',
      'Aim training progress tracking & trends',
      'Personal sensitivity profile across all games',
      'Crosshair sharing & community presets',
      'Exclusive Elite-only tools (early access)',
      'Ad-free experience',
      'Direct feature request channel',
    ],
  },
];

export interface AimTrainingScore {
  id: string;
  game_mode: 'flick' | 'tracking' | 'reaction';
  score: number;
  accuracy: number;
  avg_reaction_ms: number | null;
  duration_seconds: number;
  created_at: string;
}

export type GameId =
  | 'valorant'
  | 'cs2'
  | 'apex'
  | 'cod'
  | 'r6'
  | 'overwatch2'
  | 'fortnite'
  | 'thefinals';

export interface ProPreset {
  player: string;
  team: string;
  dpi: number;
  sensitivity: number;
  edpi: number;
}

export interface GameConfig {
  id: GameId;
  name: string;
  slug: string;
  genre: string;
  color: string;
  tagline: string;
  description: string;
  sensScale: { min: number; max: number };
  sensDisplay: string;
  sensUnit?: string;
  recommendedRange: { min: number; max: number };
  defaultSens: number;
  dpiSupport: boolean;
  yaw: number;
  hasFov: boolean;
  defaultFov?: number;
  proPresets: ProPreset[];
}

export type ToolStatus = 'available' | 'coming_soon';

export type ToolCategory =
  | 'sensitivity'
  | 'aim'
  | 'performance';

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
