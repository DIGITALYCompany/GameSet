import { useCallback, useEffect, useState } from 'react';

interface DocumentPictureInPicture {
  requestWindow(options?: { width?: number; height?: number }): Promise<Window>;
  window: Window | null;
}

declare global {
  interface Window {
    documentPictureInPicture?: DocumentPictureInPicture;
  }
}

function copyStyles(target: Document) {
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      const style = target.createElement('style');
      style.textContent = Array.from(sheet.cssRules).map((r) => r.cssText).join('\n');
      target.head.appendChild(style);
    } catch {
      // Cross-origin sheets (e.g. web fonts) can't be read, so link them instead.
      if (sheet.href) {
        const link = target.createElement('link');
        link.rel = 'stylesheet';
        link.href = sheet.href;
        target.head.appendChild(link);
      }
    }
  }
}

export function useFloatingWindow() {
  const [floatingWindow, setFloatingWindow] = useState<Window | null>(null);
  const supported = typeof window !== 'undefined' && 'documentPictureInPicture' in window;

  const open = useCallback(async (width: number, height: number) => {
    const api = window.documentPictureInPicture;
    if (!api) return false;
    try {
      const win = await api.requestWindow({ width, height });
      copyStyles(win.document);
      win.document.title = 'GAMESET';
      win.document.body.style.margin = '0';
      win.addEventListener('pagehide', () => setFloatingWindow(null), { once: true });
      setFloatingWindow(win);
      return true;
    } catch {
      return false;
    }
  }, []);

  const close = useCallback(() => {
    window.documentPictureInPicture?.window?.close();
    setFloatingWindow(null);
  }, []);

  useEffect(() => () => window.documentPictureInPicture?.window?.close(), []);

  return { supported, floatingWindow, open, close };
}
