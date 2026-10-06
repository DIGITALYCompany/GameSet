import type { ComparisonPair, FinderState } from '@/types';

/**
 * SensitivityFinderEngine
 *
 * A deterministic progressive sensitivity calibration algorithm inspired by
 * the PSA (Progressive Sensitivity Adjustment) methodology.
 *
 * The user starts with their current sensitivity. The engine generates a
 * range around that value and progressively narrows it through binary
 * comparisons. At each round, two values are presented (LOW and HIGH).
 * The user tests both in-game and picks the one that felt better. The
 * engine then narrows the search range toward the chosen side.
 *
 * After all rounds, the final result is the midpoint of the remaining range.
 *
 * The algorithm is deterministic — given the same initial sensitivity and
 * the same sequence of choices, it always produces the same result.
 * No randomness is involved.
 */
export class SensitivityFinderEngine {
  private state: FinderState;
  private readonly initialSensitivity: number;

  constructor(initialSensitivity: number, rounds = 7) {
    this.initialSensitivity = initialSensitivity;
    this.state = this.buildInitialState(initialSensitivity, rounds);
  }

  private buildInitialState(sens: number, rounds: number): FinderState {
    // Create a symmetric range around the player's current sensitivity.
    // The range spans from sens/2 to sens*1.5, giving enough room for
    // meaningful comparison while staying within realistic bounds.
    const lowBound = sens * 0.5;
    const highBound = sens * 1.5;

    const { lower, higher } = this.splitRange(lowBound, highBound);

    return {
      phase: 'testing',
      round: 1,
      totalRounds: Math.max(1, rounds),
      lowBound,
      highBound,
      lower,
      higher,
      result: null,
      history: [],
    };
  }

  /**
   * Split a range into three segments and return the two boundary points
   * (the 1/3 and 2/3 marks). This ensures LOW and HIGH are distinct and
   * meaningfully apart within the current range.
   */
  private splitRange(low: number, high: number): { lower: number; higher: number } {
    const third = (high - low) / 3;
    return {
      lower: low + third,
      higher: low + third * 2,
    };
  }

  /** Start/restart the test with the given sensitivity. */
  startTest(initialSensitivity: number, rounds?: number): void {
    this.state = this.buildInitialState(
      initialSensitivity,
      rounds ?? this.state.totalRounds
    );
  }

  /** Get the current comparison pair for this round. */
  getCurrentComparison(): ComparisonPair {
    return {
      round: this.state.round,
      totalRounds: this.state.totalRounds,
      lower: this.state.lower,
      higher: this.state.higher,
    };
  }

  /** User chose the lower value — narrow range toward the lower half. */
  selectLower(): void {
    if (this.state.phase !== 'testing') return;
    this.state.history.push(this.state.lower);
    this.advance(this.state.lowBound, this.state.higher);
  }

  /** User chose the higher value — narrow range toward the upper half. */
  selectHigher(): void {
    if (this.state.phase !== 'testing') return;
    this.state.history.push(this.state.higher);
    this.advance(this.state.lower, this.state.highBound);
  }

  /**
   * Narrow the range to [newLow, newHigh] and advance to the next round.
   * If this was the last round, compute the final result.
   */
  private advance(newLow: number, newHigh: number): void {
    this.state.lowBound = newLow;
    this.state.highBound = newHigh;

    if (this.state.round >= this.state.totalRounds) {
      // Final round: result is the midpoint of the narrowed range
      this.state.result = (newLow + newHigh) / 2;
      this.state.phase = 'result';
      return;
    }

    this.state.round++;
    const { lower, higher } = this.splitRange(newLow, newHigh);
    this.state.lower = lower;
    this.state.higher = higher;
  }

  /** Both values felt identical — the sweet spot lies between them, so finish now. */
  selectSame(): void {
    if (this.state.phase !== 'testing') return;
    this.state.lowBound = this.state.lower;
    this.state.highBound = this.state.higher;
    this.state.result = (this.state.lower + this.state.higher) / 2;
    this.state.phase = 'result';
  }

  /** Percent gap between the two values currently on screen. */
  get currentGapPercent(): number {
    const mid = (this.state.lower + this.state.higher) / 2;
    if (!(mid > 0)) return 0;
    return ((this.state.higher - this.state.lower) / mid) * 100;
  }

  /** Final precision (± % of the starting sensitivity) after a full run of N rounds. */
  static precisionFor(rounds: number): number {
    return (Math.pow(2 / 3, rounds) / 2) * 100;
  }

  /** Get the final result. Returns null if test is not complete. */
  getResult(): number | null {
    if (this.state.phase !== 'result') return null;
    return this.state.result;
  }

  /** Get the full internal state (for debugging or persistence). */
  getState(): FinderState {
    return { ...this.state, history: [...this.state.history] };
  }

  /** Current round number (1-indexed). */
  get round(): number {
    return this.state.round;
  }

  /** Total rounds configured. */
  get totalRounds(): number {
    return this.state.totalRounds;
  }

  /** Current phase. */
  get phase(): 'testing' | 'result' {
    return this.state.phase as 'testing' | 'result';
  }

  /** The player's starting sensitivity. */
  get startingSensitivity(): number {
    return this.initialSensitivity;
  }

  /** Reset the engine to a fresh state. */
  reset(): void {
    this.state = this.buildInitialState(
      this.initialSensitivity,
      this.state.totalRounds
    );
  }
}
