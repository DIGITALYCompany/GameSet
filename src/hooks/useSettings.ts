import { useCallback, useEffect, useState } from 'react';
import type { AppSettings } from '@/types';
import { getSettings, saveSettings as persistSettings } from '@/lib/storage';

const DEFAULTS: AppSettings = {
  theme: 'dark',
  soundEffects: false,
  reducedMotion: false,
  defaultRounds: 7,
};

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      return getSettings();
    } catch {
      return DEFAULTS;
    }
  });

  // Apply reduced motion preference to the document
  useEffect(() => {
    const root = document.documentElement;
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  }, [settings.reducedMotion]);

  const update = useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      persistSettings(next);
      return next;
    });
  }, []);

  return { settings, update };
}
