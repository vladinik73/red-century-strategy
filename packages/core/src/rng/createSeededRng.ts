/**
 * Deterministic PRNG (mulberry32) for reproducible game logic.
 * rng()        → float  in [0, 1)
 * rng.uint32() → uint32 in [0, 2^32)
 */

export interface SeededRng {
  /** Returns float in [0, 1). Use for thresholds, lerp, probability checks. */
  (): number;
  /** Returns raw uint32 in [0, 2^32). Use for modulo / shuffle / index pick. */
  uint32(): number;
}

export function createSeededRng(seed: number): SeededRng {
  let s = seed | 0;

  function uint32(): number {
    s = (s + 0x6d2b79f5) | 0; // mulberry32
    const t = Math.imul(s ^ (s >>> 15), 1 | s);
    return ((t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ (t ^ (t >>> 14))) >>> 0;
  }

  function float(): number {
    return uint32() / 4294967296; // 2^32
  }

  return Object.assign(float, { uint32 }) as SeededRng;
}
