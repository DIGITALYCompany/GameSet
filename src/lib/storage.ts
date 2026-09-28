import type { AppSettings, SensitivityResult } from '@/types';

const KEYS = {
  tests: 'gameset:tests',
  settings: 'gameset:settings',
  selectedGame: 'gameset:selectedGame',
} as const;

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  soundEffects: false,
  reducedMotion: false,
  defaultRounds: 7,
};

/** Safely parse JSON from localStorage. Returns fallback on corruption. */
function safeParse<T>(raw: string | null, fallback: T): T {
  if (raw === null) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return parsed as T;
  } catch {
    return fallback;
  }
}

/* ── Tests ──────────────────────────────────────────────── */

export function getTests(): SensitivityResult[] {
  const tests = safeParse<SensitivityResult[]>(
    localStorage.getItem(KEYS.tests),
    []
  );
  return Array.isArray(tests) ? tests : [];
}

export function saveTest(result: SensitivityResult): void {
  const tests = getTests();
  tests.unshift(result);
  try {
    localStorage.setItem(KEYS.tests, JSON.stringify(tests));
  } catch {
    // Storage full or unavailable — fail silently
  }
}

export function deleteTest(id: string): void {
  const tests = getTests().filter((t) => t.id !== id);
  localStorage.setItem(KEYS.tests, JSON.stringify(tests));
}

export function clearTests(): void {
  localStorage.removeItem(KEYS.tests);
}

/* ── Settings ───────────────────────────────────────────── */

export function getSettings(): AppSettings {
  return {
    ...DEFAULT_SETTINGS,
    ...safeParse<Partial<AppSettings>>(
      localStorage.getItem(KEYS.settings),
      {}
    ),
  };
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(KEYS.settings, JSON.stringify(settings));
}

/* ── Selected game ──────────────────────────────────────── */

export function getSelectedGame(): string | null {
  return localStorage.getItem(KEYS.selectedGame);
}

export function saveSelectedGame(gameId: string): void {
  localStorage.setItem(KEYS.selectedGame, gameId);
}

/* ── Clear all ──────────────────────────────────────────── */

export function clearAllData(): void {
  localStorage.removeItem(KEYS.tests);
  localStorage.removeItem(KEYS.settings);
  localStorage.removeItem(KEYS.selectedGame);
}
