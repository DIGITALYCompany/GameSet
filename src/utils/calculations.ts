import type { GameConfig } from '@/types';

/**
 * eDPI = DPI × Sensitivity
 */
export function calcEdpi(dpi: number, sensitivity: number): number {
  return dpi * sensitivity;
}

/**
 * cm/360 = (360 / (sens × yaw × dpi)) × 2.54
 *
 * Returns the centimeters of mouse movement required for a full
 * 360-degree turn in-game.
 */
export function calcCm360(
  dpi: number,
  sensitivity: number,
  game: GameConfig
): number {
  const counts = sensitivity * game.yaw * dpi;
  if (counts === 0) return 0;
  return (360 / counts) * 2.54;
}

/** Round to a fixed number of decimals, returning a number. */
export function round(value: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/** Format a number for display with consistent decimals. */
export function formatSens(value: number, decimals = 3): string {
  return value.toFixed(decimals);
}

export function formatCm(value: number): string {
  if (value >= 100) return value.toFixed(0);
  return value.toFixed(1);
}
