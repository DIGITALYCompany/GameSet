import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { AuthForm } from './AuthForm';

export function AuthModal({ open, onClose, initialMode = 'signin' }: { open: boolean; onClose: () => void; initialMode?: 'signin' | 'signup' }) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.querySelector<HTMLElement>('button, input')?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const elements = Array.from(panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), a[href]') ?? []);
      const first = elements[0], last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', handleKey);
    return () => { document.removeEventListener('keydown', handleKey); document.body.style.overflow = overflow; previous?.focus(); };
  }, [open, onClose]);
  if (!open) return null;
  return createPortal(<div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4" role="dialog" aria-modal="true" aria-label="GAMESET account"><div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} /><div ref={panel} className="relative my-auto max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-3xl border border-white/10 bg-base-surface px-6 pb-6 pt-8 shadow-2xl"><div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-purple-light to-transparent" /><button type="button" onClick={onClose} aria-label="Close" className="focus-ring absolute right-3 top-3 rounded-lg p-2 text-ink-dim hover:bg-white/5"><X className="h-4 w-4" /></button><AuthForm initialMode={initialMode} onSuccess={onClose} /></div></div>, document.body);
}
