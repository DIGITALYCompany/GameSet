import { useCallback, useEffect, useState } from 'react';
import type { AppSettings } from '@/types';
import { applyReducedMotion, getSettings, saveSettings as persistSettings } from '@/lib/storage';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(getSettings);

  useEffect(() => {
    applyReducedMotion(settings.reducedMotion);
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
