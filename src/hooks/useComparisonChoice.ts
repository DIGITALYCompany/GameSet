import { useEffect, useState } from 'react';

export type Choice = 'lower' | 'higher' | 'same';

export function useComparisonChoice(
  round: number,
  onChoose: (choice: Choice) => void,
  onExit: () => void,
  target: Window | null
) {
  const [selection, setSelection] = useState<Choice | null>(null);

  useEffect(() => {
    setSelection(null);
  }, [round]);

  const select = (choice: Choice) => {
    if (selection) return;
    setSelection(choice);
    window.setTimeout(() => onChoose(choice), 300);
  };

  useEffect(() => {
    if (!target) return;
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (e.key === 'ArrowLeft' || key === 'l') {
        e.preventDefault();
        select('lower');
      } else if (e.key === 'ArrowRight' || key === 'h') {
        e.preventDefault();
        select('higher');
      } else if (e.key === 'ArrowDown' || key === 's') {
        e.preventDefault();
        select('same');
      } else if (e.key === 'Escape') {
        onExit();
      }
    };
    target.addEventListener('keydown', handler);
    return () => target.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection, round, target]);

  return { selection, select };
}
