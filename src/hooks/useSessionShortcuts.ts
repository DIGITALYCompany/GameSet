import { useEffect, useRef } from 'react';

interface SessionShortcuts {
  running: boolean;
  paused: boolean;
  onPause?: () => void;
  onResume?: () => void;
  onReset: () => void;
}

// P / Esc toggles pause, R restarts; leaving the tab or window auto-pauses.
export function useSessionShortcuts({ running, paused, onPause, onResume, onReset }: SessionShortcuts) {
  const handlers = useRef({ onPause, onResume, onReset });
  handlers.current = { onPause, onResume, onReset };
  const active = running || paused;

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) return;
      const key = e.key.toLowerCase();
      if (key === 'p' || e.key === 'Escape') {
        e.preventDefault();
        if (paused) handlers.current.onResume?.();
        else handlers.current.onPause?.();
      } else if (key === 'r') {
        e.preventDefault();
        handlers.current.onReset();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, paused]);

  useEffect(() => {
    if (!running) return;
    const autoPause = () => handlers.current.onPause?.();
    const onVisibility = () => { if (document.hidden) autoPause(); };
    window.addEventListener('blur', autoPause);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('blur', autoPause);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [running]);
}
