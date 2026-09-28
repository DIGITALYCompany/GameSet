import type { GameId } from '@/types';

/** Unique ID generator for test results. */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Reverse-lookup a GameId from a slug. */
export function gameIdFromSlug(slug: string): GameId | undefined {
  return (
    {
      valorant: 'valorant',
      cs2: 'cs2',
      'apex-legends': 'apex',
      'cod-warzone': 'cod',
      'r6-siege': 'r6',
      'overwatch-2': 'overwatch2',
      fortnite: 'fortnite',
      'the-finals': 'thefinals',
    } as Record<string, GameId>
  )[slug];
}

/** Format an ISO date string for the history list. */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Format an ISO date string with time. */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
